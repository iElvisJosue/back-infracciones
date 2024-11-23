// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  RegistrarDocumento,
  ObtenerDocumentosPorFiltro,
  ActivarDesactivarDocumento,
  ActualizarDocumento,
  ObtenerDocumentosActivos,
} from "../controllers/documentos.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA REGISTRAR UN DOCUMENTO
router.post("/RegistrarDocumento", RegistrarDocumento);
// RUTA PARA OBTENER DOCUMENTOS POR FILTRO
router.post("/ObtenerDocumentosPorFiltro", ObtenerDocumentosPorFiltro);
// RUTA PARA ACTIVAR O DESACTIVAR UN DOCUMENTO
router.post("/ActivarDesactivarDocumento", ActivarDesactivarDocumento);
// RUTA PARA ACTUALIZAR UN DOCUMENTO
router.put("/ActualizarDocumento", ActualizarDocumento);
// RUTA PARA OBTENER DOCUMENTOS ACTIVOS
router.get(
  "/ObtenerDocumentosActivos/:CookieConToken",
  ObtenerDocumentosActivos
);

// EXPORTAMOS EL ENRUTADOR
export default router;
