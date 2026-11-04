const { Router } = require("express");
const mongoose = require("mongoose");

function crearApiReservasRouter(servicioReservas) {
  const router = Router();

  // GET /api/reservas (con soporte para filtro exacto de sala y control estricto de tipos/repeticiones)
  router.get("/", async (req, res, next) => {
    try {
      let { sala } = req.query;

      // Si envían parámetros repetidos (array) o un objeto anidado, rechazamos con 400
      if (sala !== undefined) {
        if (Array.isArray(sala) || (typeof sala === "object" && sala !== null)) {
          return res.status(400).json({ error: "Parámetro de sala inválido o repetido." });
        }
        if (typeof sala !== "string") {
          return res.status(400).json({ error: "El parámetro sala debe ser un texto." });
        }
      }

      const reservas = await servicioReservas.obtenerReservas(sala);
      return res.status(200).json(reservas);
    } catch (error) {
      next(error);
    }
  });

  // GET /api/reservas/:id
  router.get("/:id", async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID mal formado." });
      }

      const reserva = await servicioReservas.obtenerReservaPorId(id);
      if (!reserva) {
        return res.status(404).json({ error: "Recurso no encontrado." });
      }

      return res.status(200).json(reserva);
    } catch (error) {
      next(error);
    }
  });

  // POST /api/reservas
  router.post("/", async (req, res) => {
    try {
      const datosCliente = req.body;

      if (!datosCliente || typeof datosCliente !== "object" || Array.isArray(datosCliente)) {
        return res.status(400).json({ error: "Cuerpo de solicitud ausente o inválido." });
      }

      const nuevaReserva = await servicioReservas.crearReserva(datosCliente || datosCliente);
      
      // Usamos el id textual público configurado en Mongoose
      res.setHeader("Location", `/api/reservas/${nuevaReserva.id}`);
      return res.status(201).json(nuevaReserva);
    } catch (error) {
      return res.status(400).json({ error: "Creación inválida.", detalle: error.message });
    }
  });

  return router;
}

module.exports = { crearApiReservasRouter };