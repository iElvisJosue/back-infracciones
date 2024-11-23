// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
// IMPORTAMOS MULTER
import multer from "multer";
import { multerConfig } from "../middlewares/multer.js";
// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_ERROR_CONSULTA_SQL,
  MENSAJE_DE_NO_AUTORIZADO,
} from "../helpers/MensajesDeError.js";
import { ValidarTokenParaPeticion } from "../helpers/ValidarToken.js";
import { ObtenerHoraActual } from "../helpers/Funciones.js";

// SE UTILIZA EN LAS VISTAS:
// CREAR INFRACCIÓN > FINALIZAR (PASO 6)
export const RegistrarInfraccion = async (req, res) => {
  const {
    CookieConToken,
    Infraccion,
    idAgente,
    idPersona,
    idGrua,
    Concepto,
    DocumentosRetenidos,
  } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  const idInfraccion = await GuardarDetallesDeLaInfraccion(Infraccion);

  for (const infoDocumentoRetenido of DocumentosRetenidos) {
    await GuardarInfraccionPorDocumentoRetenido(
      idInfraccion,
      infoDocumentoRetenido
    );
  }
  for (const infoConcepto of Concepto) {
    await CrearUnionInfraccionConcepto(
      idInfraccion,
      infoConcepto.idListaConcepto
    );
  }

  await CrearUnionInfraccionPersonaAgenteGrua(
    idInfraccion,
    idPersona,
    idAgente,
    idGrua
  );

  console.log("¡La infracción se ha guardado con éxito!");
  res.status(200).json({ idInfraccion });

  try {
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
const GuardarDetallesDeLaInfraccion = (Infraccion) => {
  const {
    PlacasInfraccion,
    EstadoOrigenInfraccion,
    EstadoInfraccion,
    MunicipioInfraccion,
    LugarInfraccion,
    PorHechosInfraccion,
    ClasificadorInfraccion,
    ManejaOperativoInfraccion,
    ObservacionesInfraccion,
    MotivoInfraccion,
    EstatusSolicitudInfraccion,
  } = Infraccion;

  const sql = `INSERT INTO infracciones (PlacasInfraccion, EstadoOrigenInfraccion, EstadoInfraccion, MunicipioInfraccion, LugarInfraccion, PorHechosInfraccion, ClasificadorInfraccion, ManejaOperativoInfraccion, ObservacionesInfraccion, MotivoInfraccion, EstatusSolicitudInfraccion,  FechaCreacionInfraccion,  HoraCreacionInfraccion) VALUES (?,?,?,?,?,?,?,?,?,?,?,CURDATE(),'${ObtenerHoraActual()}')`;
  return new Promise((resolve, reject) => {
    CONEXION.query(
      sql,
      [
        PlacasInfraccion || "N/A",
        EstadoOrigenInfraccion || "N/A",
        EstadoInfraccion || "N/A",
        MunicipioInfraccion || "N/A",
        LugarInfraccion || "N/A",
        PorHechosInfraccion || "N/A",
        ClasificadorInfraccion || "N/A",
        ManejaOperativoInfraccion || "N/A",
        ObservacionesInfraccion || "N/A",
        MotivoInfraccion || "N/A",
        EstatusSolicitudInfraccion || "N/A",
      ],
      (error, result) => {
        if (error) {
          reject(error); // Si hay error, rechaza la promesa
        } else {
          resolve(result.insertId); // Si todo va bien, resuelve con el insertId
        }
      }
    );
  });
};
const GuardarInfraccionPorDocumentoRetenido = (
  idInfraccion,
  infoDocumentoRetenido
) => {
  return new Promise((resolve, reject) => {
    const sql = `
    INSERT INTO documentos (NombreDocumento, FolioDocumento, ObservacionesDocumento, FechaCreacionDocumento, HoraCreacionDocumento) VALUES (?,?,?, CURDATE(),'${ObtenerHoraActual()}')`;
    CONEXION.query(
      sql,
      [
        infoDocumentoRetenido.NombreDocumento || "N/A",
        infoDocumentoRetenido.FolioDocumento || "N/A",
        infoDocumentoRetenido.ObservacionesDocumento || "N/A",
      ],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        CrearUnionInfraccionDocumentoRetenido(idInfraccion, result.insertId);
        resolve(true);
      }
    );
  });
};
const CrearUnionInfraccionDocumentoRetenido = (idInfraccion, idDocumento) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO union_infraccion_documento (idInfraccion, idDocumento) VALUES (?,?)`;
    CONEXION.query(sql, [idInfraccion, idDocumento], (error, result) => {
      if (error) return reject(error);
      resolve(true);
    });
  });
};
const CrearUnionInfraccionConcepto = (idInfraccion, idListaConcepto) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO union_infraccion_concepto (idInfraccion, idListaConcepto) VALUES (?,?)`;
    CONEXION.query(sql, [idInfraccion, idListaConcepto], (error, result) => {
      if (error) return reject(error);
      resolve(true);
    });
  });
};
const CrearUnionInfraccionPersonaAgenteGrua = (
  idInfraccion,
  idPersona,
  idAgente,
  idGrua
) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT detallesinfraccion (idInfraccion, idPersona, idAgente, idGrua) VALUES (?,?,?,?)`;
    CONEXION.query(
      sql,
      [idInfraccion, idPersona, idAgente, idGrua],
      (error, result) => {
        if (error) return reject(error);
        resolve(true);
      }
    );
  });
};
export const GuardarImagenDeEvidencia = async (req, res) => {
  const { filename, idInfraccion } = req.file;
  multerConfig(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(MENSAJE_DE_ERROR);
    } else if (err) {
      return res.status(500).json(MENSAJE_DE_ERROR);
    }
    if (req.duplicatedFile) {
      // Si el archivo es duplicado, enviar mensaje al front
      return res
        .status(400)
        .json(
          "¡Vaya! Parece que ya existe una imagen con ese nombre, por favor intente con otra imagen o cambiando el nombre de la imagen."
        );
    } else {
      const sql = `INSERT INTO evidencias (NombreEvidencia, FechaCreacionEvidencia, HoraCreacionEvidencia) VALUES (?, CURDATE(), '${ObtenerHoraActual()}')`;
      CONEXION.query(sql, [filename], async (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        await CrearUnionInfraccionEvidencia(idInfraccion, result.insertId);
        res.status(200).json("Imagen guardada exitosamente");
      });
    }
  });
};
const CrearUnionInfraccionEvidencia = (idInfraccion, idEvidencia) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT union_infraccion_evidencia (idInfraccion, idEvidencia) VALUES (?,?)`;
    CONEXION.query(sql, [idInfraccion, idEvidencia], (error, result) => {
      if (error) return reject(error);
      resolve(true);
    });
  });
};
// SE UTILIZA EN LAS VISTAS:
// ADMINISTRAR INFRACCIONES > LISTA DE INFRACCIONES
export const BuscarInfraccionesPorFiltro = async (req, res) => {
  const { filtro, CookieConToken } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);
  try {
    const sql =
      filtro === ""
        ? `SELECT 
            i.*,
            p.*,
            a.*,
            g.*
            FROM 
                detallesinfraccion di
            LEFT JOIN 
                infracciones i ON di.idInfraccion = i.idInfraccion
            LEFT JOIN 
                personas p ON di.idPersona = p.idPersona
            LEFT JOIN 
                agentes a ON di.idAgente = a.idAgente
            LEFT JOIN 
                gruas g ON di.idGrua = g.idGrua
            ORDER BY i.idInfraccion DESC, i.FechaCreacionInfraccion DESC, i.HoraCreacionInfraccion DESC`
        : `SELECT 
            i.*,
            p.*,
            a.*,
            g.*
            FROM 
                detallesinfraccion di
            LEFT JOIN 
                infracciones i ON di.idInfraccion = i.idInfraccion
            LEFT JOIN 
                personas p ON di.idPersona = p.idPersona
            LEFT JOIN 
                agentes a ON di.idAgente = a.idAgente
            LEFT JOIN 
                gruas g ON di.idGrua = g.idGrua
            WHERE 
                i.idInfraccion LIKE ?
                OR p.NombrePersona LIKE ?
                OR a.ClaveInternaAgente LIKE ?
                OR g.NombreGrua LIKE ?
            ORDER BY i.idInfraccion DESC, i.FechaCreacionInfraccion DESC, i.HoraCreacionInfraccion DESC`;
    CONEXION.query(
      sql,
      [`%${filtro}%`, `%${filtro}%`, `%${filtro}%`, `%${filtro}%`],
      (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        res.status(200).json(result);
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// SE UTILIZA EN LAS VISTAS:
// ADMINISTRAR INFRACCIONES > LISTA DE INFRACCIONES
export const BuscarInfraccionesPorFecha = async (req, res) => {
  const { CookieConToken, primeraFecha, segundaFecha } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT 
            i.*,
            p.*,
            a.*,
            g.*
            FROM 
                detallesinfraccion di
            LEFT JOIN 
                infracciones i ON di.idInfraccion = i.idInfraccion
            LEFT JOIN 
                personas p ON di.idPersona = p.idPersona
            LEFT JOIN 
                agentes a ON di.idAgente = a.idAgente
            LEFT JOIN 
                gruas g ON di.idGrua = g.idGrua
              WHERE
                i.FechaCreacionInfraccion BETWEEN ? AND ?
              ORDER BY i.idInfraccion DESC, i.FechaCreacionInfraccion DESC, i.HoraCreacionInfraccion DESC`;
    CONEXION.query(sql, [primeraFecha, segundaFecha], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
export const BuscarConceptosDocumentosEvidencias = async (req, res) => {
  const { CookieConToken, idInfraccion } = req.params;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const Conceptos = await BuscarConceptosPorInfraccion(idInfraccion);
    const DocumentosRetenidos = await BuscarDocumentosRetenidosPorInfraccion(
      idInfraccion
    );
    const Evidencias = await BuscarEvidenciasPorInfraccion(idInfraccion);
    const ConceptosDocumentosEvidencias = {
      Conceptos,
      DocumentosRetenidos,
      Evidencias,
    };
    res.status(200).json(ConceptosDocumentosEvidencias);
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
const BuscarConceptosPorInfraccion = async (idInfraccion) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
                  lc.* 
                  FROM union_infraccion_concepto uic
                  LEFT JOIN 
                  listaconceptos lc ON uic.idListaConcepto = lc.idListaConcepto
                  WHERE uic.idInfraccion = ?`;
    CONEXION.query(sql, [idInfraccion], (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
const BuscarDocumentosRetenidosPorInfraccion = async (idInfraccion) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
                  d.* 
                  FROM union_infraccion_documento uid
                  LEFT JOIN 
                  documentos d ON uid.idDocumento = d.idDocumento
                  WHERE uid.idInfraccion = ?`;
    CONEXION.query(sql, [idInfraccion], (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
const BuscarEvidenciasPorInfraccion = async (idInfraccion) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
                  e.* 
                  FROM union_infraccion_evidencia uie
                  LEFT JOIN 
                  evidencias e ON uie.idEvidencia = e.idEvidencia
                  WHERE uie.idInfraccion = ?`;
    CONEXION.query(sql, [idInfraccion], (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
// SE UTILIZA EN LAS VISTAS:
// MIS INFRACCIONES > LISTA DE INFRACCIONES
export const BuscarInfraccionesPorAgenteYFiltro = async (req, res) => {
  const { idAgente, filtro, CookieConToken } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  // DEFINIMOS ARRAY DE VALORES
  let PARAMETROS_SQL = [idAgente];
  if (filtro !== "") {
    PARAMETROS_SQL.unshift(
      `%${filtro}%`,
      `%${filtro}%`,
      `%${filtro}%`,
      `%${filtro}%`
    );
  }

  try {
    const sql =
      filtro === ""
        ? `SELECT 
            i.*,
            p.*,
            a.*,
            g.*
            FROM 
                detallesinfraccion di
            LEFT JOIN 
                infracciones i ON di.idInfraccion = i.idInfraccion
            LEFT JOIN 
                personas p ON di.idPersona = p.idPersona
            LEFT JOIN 
                agentes a ON di.idAgente = a.idAgente
            LEFT JOIN 
                gruas g ON di.idGrua = g.idGrua
            WHERE 
                di.idAgente = ?
            ORDER BY i.idInfraccion DESC, i.FechaCreacionInfraccion DESC, i.HoraCreacionInfraccion DESC`
        : `SELECT 
            i.*,
            p.*,
            a.*,
            g.*
            FROM 
                detallesinfraccion di
            LEFT JOIN 
                infracciones i ON di.idInfraccion = i.idInfraccion
            LEFT JOIN 
                personas p ON di.idPersona = p.idPersona
            LEFT JOIN 
                agentes a ON di.idAgente = a.idAgente
            LEFT JOIN 
                gruas g ON di.idGrua = g.idGrua
            WHERE 
                (i.idInfraccion LIKE ?
                OR p.NombrePersona LIKE ?
                OR a.ClaveInternaAgente LIKE ?
                OR g.NombreGrua LIKE ?)
                AND di.idAgente = ?
            ORDER BY i.idInfraccion DESC, i.FechaCreacionInfraccion DESC, i.HoraCreacionInfraccion DESC`;
    CONEXION.query(sql, PARAMETROS_SQL, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// SE UTILIZA EN LAS VISTAS:
// MIS INFRACCIONES > LISTA DE INFRACCIONES
export const BuscarInfraccionesPorAgenteYFecha = async (req, res) => {
  const { CookieConToken, idAgente, primeraFecha, segundaFecha } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT 
            i.*,
            p.*,
            a.*,
            g.*
            FROM 
                detallesinfraccion di
            LEFT JOIN 
                infracciones i ON di.idInfraccion = i.idInfraccion
            LEFT JOIN 
                personas p ON di.idPersona = p.idPersona
            LEFT JOIN 
                agentes a ON di.idAgente = a.idAgente
            LEFT JOIN 
                gruas g ON di.idGrua = g.idGrua
              WHERE
                (i.FechaCreacionInfraccion BETWEEN ? AND ?)
                AND di.idAgente = ?
              ORDER BY i.idInfraccion DESC, i.FechaCreacionInfraccion DESC, i.HoraCreacionInfraccion DESC`;
    CONEXION.query(
      sql,
      [primeraFecha, segundaFecha, idAgente],
      (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        res.status(200).json(result);
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
