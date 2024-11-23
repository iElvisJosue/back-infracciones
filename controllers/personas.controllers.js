// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_ERROR_CONSULTA_SQL,
  MENSAJE_DE_NO_AUTORIZADO,
} from "../helpers/MensajesDeError.js";
import { ValidarTokenParaPeticion } from "../helpers/ValidarToken.js";
import { ObtenerHoraActual } from "../helpers/Funciones.js";

// SE UTILIZA EN LA VISTA:
// ADMINISTRAR PERSONAS > REGISTRAR PERSONA
export const RegistrarPersona = async (req, res) => {
  const {
    CookieConToken,
    TipoPersona,
    NombrePersona,
    ApellidoPaternoPersona,
    ApellidoMaternoPersona,
    RFCPersona,
    CURPPersona,
    GeneroPersona,
    DireccionPersona,
  } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM personas WHERE RFCPersona = ? OR CURPPersona = ?`;
    CONEXION.query(sql, [RFCPersona, CURPPersona], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        res
          .status(409)
          .json(
            `¡Oops! Parece que ya existe una persona con el RFC ${RFCPersona.toUpperCase()} o CURP ${CURPPersona.toUpperCase()}, por favor intente con otra persona.`
          );
      } else {
        const sql = `INSERT INTO personas (TipoPersona, NombrePersona, ApellidoPaternoPersona, ApellidoMaternoPersona, RFCPersona, CURPPersona,GeneroPersona, DireccionPersona, FechaCreacionPersona, HoraCreacionPersona) VALUES (?,?,?,?,?,?,?,?, CURDATE(),'${ObtenerHoraActual()}')`;
        CONEXION.query(
          sql,
          [
            TipoPersona || "N/A",
            NombrePersona || "N/A",
            ApellidoPaternoPersona || "N/A",
            ApellidoMaternoPersona || "N/A",
            RFCPersona || "N/A",
            CURPPersona || "N/A",
            GeneroPersona || "N/A",
            DireccionPersona || "N/A",
          ],
          (error, result) => {
            if (error) throw error;
            res
              .status(200)
              .json(
                `¡La persona ${NombrePersona.toUpperCase()} ha sido registrada con éxito!`
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
// ADMINISTRAR PERSONAS > LISTA DE PERSONAS
export const ObtenerPersonasPorFiltro = async (req, res) => {
  const { CookieConToken, filtro } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  // DEFINIMOS EL ARRAY DE FILTROS
  let PARAMETROS_SQL = [];
  if (filtro !== "") {
    PARAMETROS_SQL.push(`%${filtro}%`, `%${filtro}%`, `%${filtro}%`);
  }

  try {
    const sql =
      filtro === ""
        ? `SELECT * FROM personas WHERE idPersona != 1 ORDER BY idPersona DESC`
        : `SELECT * FROM personas WHERE (NombrePersona LIKE ? OR CURPPersona LIKE ? OR RFCPersona LIKE ?) AND idPersona != 1 ORDER BY idPersona DESC`;
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
// ADMINISTRAR PERSONAS > LISTA DE PERSONAS
export const ActivarDesactivarPersona = async (req, res) => {
  const { idPersona, EstadoPersona, CookieConToken } = req.body;

  const TEXTO_ESTADO = EstadoPersona === "Activa" ? "ACTIVADA" : "DESACTIVADA";

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `UPDATE personas SET ActivaPersona = ? WHERE idPersona = ?`;
    CONEXION.query(sql, [EstadoPersona, idPersona], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(`¡La persona ha sido ${TEXTO_ESTADO} con éxito!`);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// SE UTILIZA EN LA VISTA:
// ADMINISTRAR PERSONAS > LISTA DE PERSONAS
export const ActualizarPersona = async (req, res) => {
  const {
    idPersona,
    TipoPersona,
    NombrePersona,
    ApellidoPaternoPersona,
    ApellidoMaternoPersona,
    RFCPersona,
    CURPPersona,
    GeneroPersona,
    DireccionPersona,
    CookieConToken,
  } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM personas WHERE (RFCPersona = ? OR CURPPersona = ?) AND idPersona != ?`;
    CONEXION.query(
      sql,
      [RFCPersona, CURPPersona, idPersona],
      (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        if (result.length > 0) {
          res
            .status(409)
            .json(
              `¡Oops! Parece que ya existe una persona con el RFC ${RFCPersona.toUpperCase()} o CURP ${CURPPersona.toUpperCase()}, por favor intente con otra persona.`
            );
        } else {
          const sql = `UPDATE personas SET TipoPersona = ?, NombrePersona = ?, ApellidoPaternoPersona = ?, ApellidoMaternoPersona = ?, RFCPersona = ?, CURPPersona = ?, GeneroPersona = ?, DireccionPersona = ? WHERE idPersona = ?`;
          CONEXION.query(
            sql,
            [
              TipoPersona || "N/A",
              NombrePersona || "N/A",
              ApellidoPaternoPersona || "N/A",
              ApellidoMaternoPersona || "N/A",
              RFCPersona || "N/A",
              CURPPersona || "N/A",
              GeneroPersona || "N/A",
              DireccionPersona || "N/A",
              idPersona,
            ],
            (error, result) => {
              if (error)
                return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
              res
                .status(200)
                .json(`¡La persona ha sido actualizada con éxito!`);
            }
          );
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// SE UTILIZA EN LA VISTA:
// CREAR INFRACCION > SELECCIONAR PERSONA
export const ObtenerPersonasActivasPorFiltro = async (req, res) => {
  const { CookieConToken, filtro } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  // DEFINIMOS EL ARRAY DE FILTROS
  let PARAMETROS_SQL = [];
  if (filtro !== "") {
    PARAMETROS_SQL.push(`%${filtro}%`, `%${filtro}%`, `%${filtro}%`);
  }

  try {
    const sql =
      filtro === ""
        ? `SELECT * FROM personas WHERE ActivaPersona = "Activa" ORDER BY idPersona ASC`
        : `SELECT * FROM personas WHERE (NombrePersona LIKE ? OR CURPPersona LIKE ? OR RFCPersona LIKE ?) AND ActivaPersona = "Activa" ORDER BY idPersona ASC`;
    CONEXION.query(sql, PARAMETROS_SQL, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
