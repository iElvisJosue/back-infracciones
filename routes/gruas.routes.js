// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  RegistrarGrua,
  ObtenerGruasPorFiltro,
  ActivarDesactivarGrua,
  ActualizarGrua,
  ObtenerGruasActivasPorFiltro,
} from "../controllers/gruas.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA REGISTRAR UNA GRÚA
router.post("/RegistrarGrua", RegistrarGrua);
// RUTA PARA OBTENER GRÚAS POR FILTRO
router.post("/ObtenerGruasPorFiltro", ObtenerGruasPorFiltro);
// RUTA PARA ACTIVAR O DESACTIVAR UNA GRÚA
router.post("/ActivarDesactivarGrua", ActivarDesactivarGrua);
// RUTA PARA ACTUALIZAR UNA GRÚA
router.put("/ActualizarGrua", ActualizarGrua);
// RUTA PARA OBTENER GRÚAS ACTIVAS POR FILTRO
router.post("/ObtenerGruasActivasPorFiltro", ObtenerGruasActivasPorFiltro);

// EXPORTAMOS EL ENRUTADOR
export default router;
