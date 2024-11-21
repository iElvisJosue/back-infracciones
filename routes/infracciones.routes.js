// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  RegistrarInfraccion,
  GuardarImagenDeEvidencia,
  BuscarInfraccionesPorFiltro,
  BuscarInfraccionesPorFecha,
  BuscarConceptosDocumentosEvidencias,
  BuscarInfraccionesPorAgenteYFiltro,
  BuscarInfraccionesPorAgenteYFecha,
} from "../controllers/infracciones.controllers.js";
// IMPORTAMOS MULTER
import { multerConfig } from "../middlewares/multer.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA REGISTRAR UNA INFRACCION
router.post("/RegistrarInfraccion", RegistrarInfraccion);
// RUTA PARA GUARDAR IMAGEN DE EVIDENCIA
router.post(
  "/GuardarImagenDeEvidencia",
  multerConfig,
  GuardarImagenDeEvidencia
);
// RUTA PARA BUSCAR INFRACCIONES POR FILTRO
router.post("/BuscarInfraccionesPorFiltro", BuscarInfraccionesPorFiltro);
// RUTA PARA BUSCAR INFRACCIONES POR FECHA
router.post("/BuscarInfraccionesPorFecha", BuscarInfraccionesPorFecha);
// RUTA PARA BUSCAR CONCEPTOS DOCUMENTOS EVIDENCIAS
router.get(
  "/BuscarConceptosDocumentosEvidencias/:CookieConToken/:idInfraccion",
  BuscarConceptosDocumentosEvidencias
);
// RUTA PARA BUSCAR INFRACCIONES POR AGENTE Y FILTRO
router.post(
  "/BuscarInfraccionesPorAgenteYFiltro",
  BuscarInfraccionesPorAgenteYFiltro
);
// RUTA PARA BUSCAR INFRACCIONES POR AGENTE Y FECHA
router.post(
  "/BuscarInfraccionesPorAgenteYFecha",
  BuscarInfraccionesPorAgenteYFecha
);

// EXPORTAMOS EL ENRUTADOR
export default router;
