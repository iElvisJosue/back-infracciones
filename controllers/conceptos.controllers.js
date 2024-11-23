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
// ADMINISTRAR CONCEPTOS > REGISTRAR CONCEPTO
export const RegistrarConcepto = async (req, res) => {
  const { CookieConToken, NombreConcepto, ImporteConcepto, ActivoConcepto } =
    req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM listaconceptos WHERE NombreConcepto = ?`;
    CONEXION.query(sql, [NombreConcepto], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        res
          .status(409)
          .json(
            `¡Oops! Parece que el concepto ${NombreConcepto.toUpperCase()} ya existe, por favor intente con otro nombre de concepto.`
          );
      } else {
        const sql = `INSERT INTO listaconceptos (NombreConcepto, ImporteConcepto, ActivoConcepto, FechaCreacionConcepto, HoraCreacionConcepto) VALUES (?,?,?,CURDATE(),'${ObtenerHoraActual()}')`;
        CONEXION.query(
          sql,
          [
            NombreConcepto || "N/A",
            ImporteConcepto || 0,
            ActivoConcepto || "Activo",
          ],
          (error, result) => {
            if (error) throw error;
            res
              .status(200)
              .json(
                `¡El concepto ${NombreConcepto.toUpperCase()} ha sido registrado con éxito!`
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
// ADMINISTRAR CONCEPTOS > LISTA DE CONCEPTOS
export const ObtenerConceptosPorFiltro = async (req, res) => {
  const { CookieConToken, filtro } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql =
      filtro === ""
        ? `SELECT * FROM listaconceptos WHERE idListaConcepto != 1 ORDER BY idListaConcepto DESC`
        : `SELECT * FROM listaconceptos WHERE NombreConcepto LIKE ? AND idListaConcepto != 1 ORDER BY NombreConcepto DESC`;
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
// ADMINISTRAR CONCEPTOS > LISTA DE CONCEPTOS
export const ActivarDesactivarConcepto = async (req, res) => {
  const { idListaConcepto, EstadoConcepto, CookieConToken } = req.body;

  const TEXTO_ESTADO = EstadoConcepto === "Activo" ? "ACTIVADO" : "DESACTIVADO";

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `UPDATE listaconceptos SET ActivoConcepto = ? WHERE idListaConcepto = ?`;
    CONEXION.query(sql, [EstadoConcepto, idListaConcepto], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(`¡El concepto ha sido ${TEXTO_ESTADO} con éxito!`);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// SE UTILIZA EN LA VISTA:
// ADMINISTRAR CONCEPTOS > EDITAR CONCEPTO
export const ActualizarConcepto = async (req, res) => {
  const {
    idListaConcepto,
    NombreConcepto,
    ImporteConcepto,
    ActivoConcepto,
    CookieConToken,
  } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM listaconceptos WHERE NombreConcepto = ? AND idListaConcepto != ?`;
    CONEXION.query(sql, [NombreConcepto, idListaConcepto], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        res
          .status(409)
          .json(
            `¡Oops! Parece que el concepto ${NombreConcepto.toUpperCase()} ya existe, por favor intente con otro nombre de concepto.`
          );
      } else {
        const sql = `UPDATE listaconceptos SET NombreConcepto = ?, ImporteConcepto = ?, ActivoConcepto = ? WHERE idListaConcepto = ?`;
        CONEXION.query(
          sql,
          [NombreConcepto, ImporteConcepto, ActivoConcepto, idListaConcepto],
          (error, result) => {
            if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
            res.status(200).json(`¡El concepto ha sido actualizado con éxito!`);
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
// CREAR INFRACCIÓN > SELECCIONAR CONCEPTO
export const ObtenerConceptosActivos = async (req, res) => {
  const { CookieConToken } = req.params;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM listaconceptos WHERE ActivoConcepto = "Activo" ORDER BY idListaConcepto ASC`;
    CONEXION.query(sql, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
