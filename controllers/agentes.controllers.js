// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
// IMPORTAMOS EL ENCRIPTADO
import bcrypt from "bcrypt";
// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_ERROR_CONSULTA_SQL,
  MENSAJE_DE_NO_AUTORIZADO,
} from "../helpers/MensajesDeError.js";
import { ValidarTokenParaPeticion } from "../helpers/ValidarToken.js";
import { ObtenerHoraActual } from "../helpers/Funciones.js";

// SE UTILIZA EN LA VISTA:
// ADMINISTRAR AGENTES > REGISTRAR AGENTE
export const RegistrarAgente = async (req, res) => {
  const {
    CookieConToken,
    ClaveInternaAgente,
    ContraseñaAgente,
    NombreAgente,
    ApellidosAgente,
    TipoPerfilAgente,
  } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM agentes WHERE ClaveInternaAgente = ?`;
    CONEXION.query(sql, [ClaveInternaAgente], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        res
          .status(409)
          .json(
            `¡Oops! Parece que el agente ${ClaveInternaAgente.toUpperCase()} ya existe, por favor intente con otra clave de agente.`
          );
      } else {
        // DEFINIMOS EL TAMAÑO DEL HASH
        const TamañoHash = 10;
        // GENERAMOS CONTRASEÑA ENCRIPTADA
        const ContraseñaEncriptada = bcrypt.hashSync(
          ContraseñaAgente,
          TamañoHash
        );

        const sql = `INSERT INTO agentes (ClaveInternaAgente, ContraseñaAgente, NombreAgente, ApellidosAgente, TipoPerfilAgente, FechaCreacionAgente, HoraCreacionAgente) VALUES (?,?,?,?,?, CURDATE(),'${ObtenerHoraActual()}')`;
        CONEXION.query(
          sql,
          [
            ClaveInternaAgente || "N/A",
            ContraseñaEncriptada || "N/A",
            NombreAgente || "N/A",
            ApellidosAgente || "N/A",
            TipoPerfilAgente || "Agente",
          ],
          (error, result) => {
            if (error) throw error;
            res
              .status(200)
              .json(
                `¡El agente ${ClaveInternaAgente.toUpperCase()} ha sido registrado con éxito!`
              );
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// SE UTILIZA EN LA VISTA:
// ADMINISTRAR AGENTES > LISTA DE AGENTES
export const ObtenerAgentesPorFiltro = async (req, res) => {
  const { CookieConToken, filtro, idAgenteLogueado } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  // DEFINIMOS EL ARRAY DE FILTROS
  let PARAMETROS_SQL = [idAgenteLogueado];
  if (filtro !== "") {
    PARAMETROS_SQL.push(`%${filtro}%`);
  }
  try {
    const sql =
      filtro === ""
        ? `SELECT * FROM agentes WHERE idAgente != ? ORDER BY idAgente DESC`
        : `SELECT * FROM agentes WHERE ClaveInternaAgente LIKE ? AND idAgente != ? ORDER BY ClaveInternaAgente DESC`;
    CONEXION.query(sql, PARAMETROS_SQL, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// SE UTILIZA EN LA VISTA:
// ADMINISTRAR AGENTES > LISTA DE AGENTES
export const ActivarDesactivarAgente = async (req, res) => {
  const { idAgente, EstadoAgente, CookieConToken } = req.body;

  const TEXTO_ESTADO = EstadoAgente === "Alta" ? "ALTA" : "BAJA";

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `UPDATE agentes SET EstatusAgente = ? WHERE idAgente = ?`;
    CONEXION.query(sql, [EstadoAgente, idAgente], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res
        .status(200)
        .json(`¡El agente ha sido dado de ${TEXTO_ESTADO} con éxito!`);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// SE UTILIZA EN LA VISTA:
// ADMINISTRAR AGENTES > LISTA DE AGENTES
export const ActualizarAgente = async (req, res) => {
  const {
    idAgente,
    ClaveInternaAgente,
    ContraseñaAgente,
    NombreAgente,
    ApellidosAgente,
    TipoPerfilAgente,
    CookieConToken,
  } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM agentes WHERE ClaveInternaAgente = ? AND idAgente != ?`;
    CONEXION.query(
      sql,
      [ClaveInternaAgente, idAgente],
      async (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        if (result.length > 0) {
          res
            .status(409)
            .json(
              `¡Oops! Parece que el agente ${ClaveInternaAgente.toUpperCase()} ya existe, por favor intente con otra clave de agente.`
            );
        } else {
          await ValidarActualizacionDeContraseñaAgente(
            idAgente,
            ClaveInternaAgente,
            ContraseñaAgente,
            NombreAgente,
            ApellidosAgente,
            TipoPerfilAgente
          );
          res.status(200).json(`¡El agente ha sido actualizado con éxito!`);
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
const ValidarActualizacionDeContraseñaAgente = (
  idAgente,
  ClaveInternaAgente,
  ContraseñaAgente,
  NombreAgente,
  ApellidosAgente,
  TipoPerfilAgente
) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT ContraseñaAgente FROM agentes WHERE idAgente = ?`;
    CONEXION.query(sql, [idAgente], (error, result) => {
      if (error) return reject(error);
      if (ContraseñaAgente === result[0].ContraseñaAgente) {
        const sqlContraseñaNoCambiada = `UPDATE agentes SET ClaveInternaAgente = ?, NombreAgente = ?, ApellidosAgente = ?, TipoPerfilAgente = ? WHERE idAgente = ?`;
        CONEXION.query(
          sqlContraseñaNoCambiada,
          [
            ClaveInternaAgente || "N/A",
            NombreAgente || "N/A",
            ApellidosAgente || "N/A",
            TipoPerfilAgente || "Agente",
            idAgente,
          ],
          (error, result) => {
            if (error) return reject(error);
            resolve(true);
          }
        );
      } else {
        // DEFINIMOS EL TAMAÑO DEL HASH
        const TamañoHash = 10;
        // GENERAMOS CONTRASEÑA ENCRIPTADA
        const ContraseñaEncriptada = bcrypt.hashSync(
          ContraseñaAgente,
          TamañoHash
        );
        const sql = `UPDATE agentes SET ClaveInternaAgente = ?, ContraseñaAgente = ?, NombreAgente = ?, ApellidosAgente = ?, TipoPerfilAgente = ? WHERE idAgente = ?`;
        CONEXION.query(
          sql,
          [
            ClaveInternaAgente || "N/A",
            ContraseñaEncriptada || "N/A",
            NombreAgente || "N/A",
            ApellidosAgente || "N/A",
            TipoPerfilAgente || "Agente",
            idAgente,
          ],
          (error, result) => {
            if (error) return reject(error);
            resolve(true);
          }
        );
      }
    });
  });
};
