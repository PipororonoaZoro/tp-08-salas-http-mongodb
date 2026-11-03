const express = require("express");

function crearRouterReservas(controladorReservas, middlewareValidarReserva) {
  const router = express.Router();

  router.use((req, res, next) => {
    res.locals.seccion = "Reservas de salas";
    next();
  });

  router.get("/", controladorReservas.listar);
  router.get("/nueva", controladorReservas.mostrarFormulario);
  router.get("/:id", controladorReservas.mostrarDetalle);

  // OJO ACÁ: 'middlewareValidarReserva' ya tiene que ser la función ejecutable
  router.post("/", middlewareValidarReserva, controladorReservas.crear);

  return router; // <-- IMPORTANTE: no olvides retornar el router
}

module.exports = { crearRouterReservas };
