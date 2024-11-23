// IMPORTAMOS JWT
import jwt from "jsonwebtoken";
// IMPORTAMOS EL ENCRIPTADO
import bcrypt from "bcrypt";
// IMPORTAMOS EL TOKEN CREADO
import { CrearTokenDeAcceso } from "../libs/jwt.js";
import { TOKEN_SECRETO } from "../initial/config.js";
// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_ERROR_CONSULTA_SQL,
  MENSAJE_DE_ERROR,
} from "../helpers/MensajesDeError.js";

export const IniciarSesion = (req, res) => {
  try {
    const { ClaveInternaAgente, ContraseñaAgente } = req.body;
    const sql = `SELECT * FROM agentes WHERE ClaveInternaAgente = ? AND EstatusAgente = 'Alta'`;
    CONEXION.query(sql, [ClaveInternaAgente], async (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      // COMPARAMOS LAS CONTRASEÑAS
      const SonIguales = await bcrypt.compare(
        ContraseñaAgente,
        result[0].ContraseñaAgente
      );
      if (SonIguales) {
        // CREAMOS EL ID EN UN TOKEN
        const TOKEN_ACCESO_INFRACCIONES = await CrearTokenDeAcceso({
          idAgente: result[0].idAgente,
          ClaveInternaAgente: result[0].ClaveInternaAgente,
          NombreAgente: `${result[0].NombreAgente} ${result[0].ApellidosAgente}`,
          TipoPerfilAgente: result[0].TipoPerfilAgente,
        });
        // ALMACENAMOS EL TOKEN EN UN COOKIE
        // res.cookie("TOKEN_ACCESO_INFRACCIONES", TOKEN_ACCESO_INFRACCIONES);
        res.cookie("TOKEN_ACCESO_INFRACCIONES", TOKEN_ACCESO_INFRACCIONES, {
          secure: true,
          sameSite: "none",
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        });
        const InformacionDelAgente = {
          idAgente: result[0].idAgente,
          ClaveInternaAgente: result[0].ClaveInternaAgente,
          NombreAgente: `${result[0].NombreAgente} ${result[0].ApellidosAgente}`,
          TipoPerfilAgente: result[0].TipoPerfilAgente,
          TOKEN_ACCESO_INFRACCIONES,
        };
        // ENVIAMOS EL TOKEN AL CLIENTE
        res.status(200).json(InformacionDelAgente);
      } else {
        res
          .status(401)
          .json(
            "¡Oops! Parece que la clave y/o contraseña son incorrectos, por favor verifique e intente de nuevo."
          );
      }
    });
  } catch (error) {
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
export const VerificarToken = async (req, res) => {
  const { cookie } = req.body;

  jwt.verify(cookie, TOKEN_SECRETO, async (err, InformacionDelToken) => {
    if (err) {
      console.log("HUBO UN ERROR Y ES:", err);
      return res.status(400).json(["TU TOKEN NO ESTA AUTORIZADO"]);
    }
    return res.json(InformacionDelToken);
  });
};
export const CerrarSesion = async (req, res) => {
  try {
    res.cookie("TOKEN_ACCESO_INFRACCIONES", "", {
      expires: new Date(0),
    });
    res.send("SESIÓN FINALIZADA");
  } catch (error) {
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
