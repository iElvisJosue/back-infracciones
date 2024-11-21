// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  RegistrarPersona,
  ObtenerPersonasPorFiltro,
  ActivarDesactivarPersona,
  ActualizarPersona,
  ObtenerPersonasActivasPorFiltro,
} from "../controllers/personas.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA REGISTRAR UNA PERSONA
router.post("/RegistrarPersona", RegistrarPersona);
// RUTA PARA OBTENER PERSONAS POR FILTRO
router.post("/ObtenerPersonasPorFiltro", ObtenerPersonasPorFiltro);
// RUTA PARA ACTIVAR O DESACTIVAR UNA PERSONA
router.post("/ActivarDesactivarPersona", ActivarDesactivarPersona);
// RUTA PARA ACTUALIZAR UNA PERSONA
router.put("/ActualizarPersona", ActualizarPersona);
// RUTA PARA OBTENER PERSONAS ACTIVAS POR FILTRO
router.post(
  "/ObtenerPersonasActivasPorFiltro",
  ObtenerPersonasActivasPorFiltro
);

// EXPORTAMOS EL ENRUTADOR
export default router;
