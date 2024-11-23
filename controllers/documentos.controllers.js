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
// ADMINISTRAR DOCUMENTOS > REGISTRAR DOCUMENTO
export const RegistrarDocumento = async (req, res) => {
  const { CookieConToken, NombreDocumento, ActivoDocumento } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM listadocumentos WHERE NombreDocumento = ?`;
    CONEXION.query(sql, [NombreDocumento], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        res
          .status(409)
          .json(
            `¡Oops! Parece que el documento ${NombreDocumento.toUpperCase()} ya existe, por favor intente con otro nombre de documento.`
          );
      } else {
        const sql = `INSERT INTO listadocumentos (NombreDocumento, ActivoDocumento, FechaCreacionDocumento, HoraCreacionDocumento) VALUES (?,?,CURDATE(),'${ObtenerHoraActual()}')`;
        CONEXION.query(
          sql,
          [NombreDocumento || "N/A", ActivoDocumento || "Si"],
          (error, result) => {
            if (error) throw error;
            res
              .status(200)
              .json(
                `¡El documento ${NombreDocumento.toUpperCase()} ha sido registrado con éxito!`
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
// ADMINISTRAR DOCUMENTOS > LISTA DE DOCUMENTOS
export const ObtenerDocumentosPorFiltro = async (req, res) => {
  const { CookieConToken, filtro } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql =
      filtro === ""
        ? `SELECT * FROM listadocumentos WHERE idListaDocumento != 1 ORDER BY idListaDocumento DESC`
        : `SELECT * FROM listadocumentos WHERE NombreDocumento LIKE ? AND idListaDocumento != 1 ORDER BY NombreDocumento DESC`;
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
// ADMINISTRAR DOCUMENTOS > LISTA DE DOCUMENTOS
export const ActivarDesactivarDocumento = async (req, res) => {
  const { idListaDocumento, EstadoDocumento, CookieConToken } = req.body;

  const TEXTO_ESTADO =
    EstadoDocumento === "Activo" ? "ACTIVADO" : "DESACTIVADO";

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `UPDATE listadocumentos SET ActivoDocumento = ? WHERE idListaDocumento = ?`;
    CONEXION.query(
      sql,
      [EstadoDocumento, idListaDocumento],
      (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        res
          .status(200)
          .json(`¡El documento ha sido ${TEXTO_ESTADO} con éxito!`);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// SE UTILIZA EN LA VISTA:
// ADMINISTRAR DOCUMENTOS > EDITAR DOCUMENTO
export const ActualizarDocumento = async (req, res) => {
  const { idListaDocumento, NombreDocumento, ActivoDocumento, CookieConToken } =
    req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM listadocumentos WHERE NombreDocumento = ? AND idListaDocumento != ?`;
    CONEXION.query(
      sql,
      [NombreDocumento, idListaDocumento],
      (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        if (result.length > 0) {
          res
            .status(409)
            .json(
              `¡Oops! Parece que el documento ${NombreDocumento.toUpperCase()} ya existe, por favor intente con otro nombre de documento.`
            );
        } else {
          const sql = `UPDATE listadocumentos SET NombreDocumento = ?, ActivoDocumento = ? WHERE idListaDocumento = ?`;
          CONEXION.query(
            sql,
            [NombreDocumento, ActivoDocumento, idListaDocumento],
            (error, result) => {
              if (error)
                return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
              res
                .status(200)
                .json(`¡El documento ha sido actualizado con éxito!`);
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
// CREAR INFRACCIÓN > SELECCIONAR DOCUMENTO
export const ObtenerDocumentosActivos = async (req, res) => {
  const { CookieConToken } = req.params;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM listadocumentos WHERE ActivoDocumento = "Activo" ORDER BY idListaDocumento ASC`;
    CONEXION.query(sql, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
