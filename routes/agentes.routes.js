// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  RegistrarAgente,
  ObtenerAgentesPorFiltro,
  ActivarDesactivarAgente,
  ActualizarAgente,
} from "../controllers/agentes.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA REGISTRAR UN AGENTE
router.post("/RegistrarAgente", RegistrarAgente);
// RUTA PARA OBTENER AGENTES POR FILTRO
router.post("/ObtenerAgentesPorFiltro", ObtenerAgentesPorFiltro);
// RUTA PARA ACTIVAR O DESACTIVAR UN AGENTE
router.post("/ActivarDesactivarAgente", ActivarDesactivarAgente);
// RUTA PARA ACTUALIZAR UN AGENTE
router.put("/ActualizarAgente", ActualizarAgente);

// EXPORTAMOS EL ENRUTADOR
export default router;
