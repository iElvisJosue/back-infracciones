// IMPORTAMOS CONFIGURACIÓN DE VARIABLES DE ENTORNO
import "dotenv/config";
// IMPORTAMOS EXPRESS
import express from "express";
// IMPORTAMOS POLÍTICAS DE CORS
import cors from "cors";
// IMPORTAMOS COOKIE PARSER
import cookieParser from "cookie-parser";
// IMPORTAMOS LAS RUTAS PARA PROCESOS GLOBALES
import globalRoutes from "../routes/global.routes.js";
// IMPORTAMOS LAS RUTAS DE LAS INFRACCIONES
import infraccionesRoutes from "../routes/infracciones.routes.js";
// IMPORTAMOS LAS RUTAS DE LOS AGENTES
import agentesRoutes from "../routes/agentes.routes.js";
// IMPORTAMOS LAS RUTAS DE LOS GRUAS
import gruasRoutes from "../routes/gruas.routes.js";
// IMPORTAMOS LAS RUTAS DE LAS PERSONAS
import personasRoutes from "../routes/personas.routes.js";
// IMPORTAMOS LAS RUTAS DE LOS CONCEPTOS
import conceptosRoutes from "../routes/conceptos.routes.js";
// IMPORTAMOS LAS RUTAS DE LOS DOCUMENTOS
import documentosRoutes from "../routes/documentos.routes.js";

// IMPORTAMOS LA CONFIGURACIÓN DE MULTER
import { multerConfig } from "../middlewares/multer.js";

// CONFIGURAMOS EL PATH
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://infracciones.vercel.app",
];

// APLICAMOS CORS
app.use(cors({ origin: allowedOrigins, credentials: true }));

// DEFINIMOS LA RUTA DE NUESTRAS IMÁGENES
app.set("public", path.join(__dirname, "public"));
// DEFINIMOS LA RUTA PARA SER ACCESIBLE DESDE EL NAVEGADOR
app.use(express.static(path.join(__dirname, "../public")));

// Middleware para analizar solicitudes con cuerpo JSON
app.use(express.json());

// APLICAMOS EL VISUALIZADO DE COOKIES
app.use(cookieParser());

// APLICAMOS MULTER
app.use(multerConfig);

app.use("/api/global", globalRoutes);
app.use("/api/infracciones", infraccionesRoutes);
app.use("/api/agentes", agentesRoutes);
app.use("/api/gruas", gruasRoutes);
app.use("/api/personas", personasRoutes);
app.use("/api/conceptos", conceptosRoutes);
app.use("/api/documentos", documentosRoutes);

export default app;
