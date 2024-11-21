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
// CREAR INFRACCIÓN > SELECCIONAR CONCEPTO
export const ObtenerConceptosActivos = async (req, res) => {
  const { CookieConToken } = req.params;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM conceptos WHERE ActivoConcepto = "Activo" ORDER BY NombreConcepto ASC`;
    CONEXION.query(sql, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
