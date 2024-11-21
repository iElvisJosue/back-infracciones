// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import { ObtenerConceptosActivos } from "../controllers/conceptos.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA OBTENER LOS DATOS DEL USUARIO
router.get("/ObtenerConceptosActivos/:CookieConToken", ObtenerConceptosActivos);

// EXPORTAMOS EL ENRUTADOR
export default router;
