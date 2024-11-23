// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  RegistrarConcepto,
  ObtenerConceptosPorFiltro,
  ActivarDesactivarConcepto,
  ActualizarConcepto,
  ObtenerConceptosActivos,
} from "../controllers/conceptos.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA REGISTRAR UN CONCEPTO
router.post("/RegistrarConcepto", RegistrarConcepto);
// RUTA PARA OBTENER CONCEPTOS POR FILTRO
router.post("/ObtenerConceptosPorFiltro", ObtenerConceptosPorFiltro);
// RUTA PARA ACTIVAR O DESACTIVAR UN CONCEPTO
router.post("/ActivarDesactivarConcepto", ActivarDesactivarConcepto);
// RUTA PARA ACTUALIZAR UN CONCEPTO
router.put("/ActualizarConcepto", ActualizarConcepto);
// RUTA PARA OBTENER LOS CONCEPTOS ACTIVOS
router.get("/ObtenerConceptosActivos/:CookieConToken", ObtenerConceptosActivos);

// EXPORTAMOS EL ENRUTADOR
export default router;
