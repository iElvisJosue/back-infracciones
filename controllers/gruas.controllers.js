// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_ERROR_CONSULTA_SQL,
  MENSAJE_DE_NO_AUTORIZADO,
} from "../helpers/MensajesDeError.js";
import { ObtenerHoraActual } from "../helpers/Funciones.js";
import { ValidarTokenParaPeticion } from "../helpers/ValidarToken.js";

// SE UTILIZA EN LA VISTA:
// ADMINISTRAR GRÚAS > REGISTRAR GRÚA
export const RegistrarGrua = async (req, res) => {
  const { CookieConToken, NombreGrua, ActivaGrua } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM gruas WHERE NombreGrua = ?`;
    CONEXION.query(sql, [NombreGrua], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        res
          .status(409)
          .json(
            `¡Oops! Parece que la grúa ${NombreGrua.toUpperCase()} ya existe, por favor intente con otro nombre de grúa.`
          );
      } else {
        const sql = `INSERT INTO gruas (NombreGrua, ActivaGrua, FechaCreacionGrua, HoraCreacionGrua) VALUES (?,?,CURDATE(),'${ObtenerHoraActual()}')`;
        CONEXION.query(
          sql,
          [NombreGrua || "N/A", ActivaGrua || "Si"],
          (error, result) => {
            if (error) throw error;
            res
              .status(200)
              .json(
                `¡La grúa ${NombreGrua.toUpperCase()} ha sido registrada con éxito!`
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
// ADMINISTRAR GRÚAS > LISTA DE GRUAS
export const ObtenerGruasPorFiltro = async (req, res) => {
  const { CookieConToken, filtro } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql =
      filtro === ""
        ? `SELECT * FROM gruas WHERE idGrua != 1 ORDER BY idGrua DESC`
        : `SELECT * FROM gruas WHERE NombreGrua LIKE ? AND idGrua != 1 ORDER BY NombreGrua DESC`;
    CONEXION.query(sql, [`%${filtro}%`], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// SE UTILIZA EN LA VISTA:
// ADMINISTRAR GRÚAS > LISTA DE GRUAS
export const ActivarDesactivarGrua = async (req, res) => {
  const { idGrua, EstadoGrua, CookieConToken } = req.body;

  const TEXTO_ESTADO = EstadoGrua === "Si" ? "ACTIVADA" : "DESACTIVADA";

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `UPDATE gruas SET ActivaGrua = ? WHERE idGrua = ?`;
    CONEXION.query(sql, [EstadoGrua, idGrua], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(`¡La grúa ha sido ${TEXTO_ESTADO} con éxito!`);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// SE UTILIZA EN LA VISTA:
// ADMINISTRAR GRÚAS > LISTA DE GRUAS
export const ActualizarGrua = async (req, res) => {
  const { idGrua, NombreGrua, ActivaGrua, CookieConToken } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM gruas WHERE NombreGrua = ? AND idGrua != ?`;
    CONEXION.query(sql, [NombreGrua, idGrua], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        res
          .status(409)
          .json(
            `¡Oops! Parece que la grúa ${NombreGrua.toUpperCase()} ya existe, por favor intente con otro nombre de grúa.`
          );
      } else {
        const sql = `UPDATE gruas SET NombreGrua = ?, ActivaGrua = ? WHERE idGrua = ?`;
        CONEXION.query(
          sql,
          [NombreGrua, ActivaGrua, idGrua],
          (error, result) => {
            if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
            res.status(200).json(`¡La grúa ha sido actualizada con éxito!`);
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
// CREAR INFRACCIÓN > SELECCIONAR GRÚA
export const ObtenerGruasActivasPorFiltro = async (req, res) => {
  const { CookieConToken, filtro } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql =
      filtro === ""
        ? `SELECT * FROM gruas WHERE ActivaGrua = "Si" ORDER BY idGrua ASC`
        : `SELECT * FROM gruas WHERE NombreGrua LIKE ? AND ActivaGrua = "Si" ORDER BY NombreGrua DESC`;
    CONEXION.query(sql, [`%${filtro}%`], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
