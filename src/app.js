const express = require("express");
const path = require("node:path");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");

const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");
const { crearMiddlewareValidarReserva } = require("./middleware/reservas");
const { crearControladorReservas } = require("./controladores/reservas");
const { crearRouterReservas } = require("./rutas/reservas");

const { crearApiReservasRouter } = require("./rutas/api-reservas"); 

function crearApp(servicioReservas, configuracion) {
  const app = express();

  // Configuración de vistas EJS
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));
  app.use(expressLayouts);
  app.set("layout", "layouts/main");

  // Middlewares globales y registro
  const formatoMorgan = configuracion.esProduccion ? "combined" : "dev";
  app.use(morgan(formatoMorgan));

  app.use(identificarSolicitud);
  app.use(medirDuracion);

  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Rutas base
  app.get("/", (req, res) => {
    res.render("inicio", { titulo: "Inicio" });
  });

  // Ruta /estado adaptada para consultar la base de datos de forma asincrónica
  app.get("/estado", async (req, res, next) => {
    try {
      const cantidad = await servicioReservas.obtenerCantidad();
      return res.json({
        servicio: "activo",
        reservas: cantidad,
        solicitudId: res.locals.solicitudId,
      });
    } catch (error) {
      next(error);
    }
  });

  // 2. Router del sitio web HTML tradicional
  const controladorReservas = crearControladorReservas(servicioReservas);
  const middlewareValidar = crearMiddlewareValidarReserva(servicioReservas);
  const routerReservas = crearRouterReservas(
    controladorReservas,
    middlewareValidar,
  );

  app.use("/reservas", routerReservas);

  // 3. Router de la API RESTful (CORREGIDO)
  const apiReservasRouter = crearApiReservasRouter(servicioReservas);
  app.use("/api/reservas", apiReservasRouter);

  // Manejo de 404 (para rutas HTML o desconocidas)
  app.use((req, res) => {
    if (req.originalUrl.startsWith("/api/")) {
      return res.status(404).json({ error: "Endpoint de API no encontrado." });
    }
    
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "La dirección solicitada no existe.",
    });
  });

  // 4. Middleware global de manejo de errores (4 parámetros obligatorios)
  app.use((err, req, res, next) => {
    void next;

    console.error("Error interno capturado:", err.message);
    
    if (req.originalUrl.startsWith("/api/")) {
      return res.status(500).json({ error: "Fallo interno en la operación." });
    }

    res.status(500).send("Ocurrió un error inesperado en el servidor.");
  });

  return app;
}

module.exports = { crearApp };