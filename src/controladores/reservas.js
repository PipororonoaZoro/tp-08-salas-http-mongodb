function crearControladorReservas(servicioReservas) {
  return {
    listar: async (req, res, next) => {
      try {
        const reservas = await servicioReservas.obtenerReservas();
        res.render("reservas/lista", {
          titulo: "Listado de reservas",
          reservas,
        });
      } catch (error) {
        next(error);
      }
    },

    mostrarFormulario: async (req, res, next) => {
      try {
        const salasPermitidas = await servicioReservas.obtenerSalasPermitidas();
        res.render("reservas/nueva", {
          titulo: "Nueva reserva",
          error: null,
          valores: {},
          salasPermitidas,
          turnosPermitidos: ["Mañana", "Tarde", "Noche"],
        });
      } catch (error) {
        next(error);
      }
    },

    mostrarDetalle: async (req, res, next) => {
      try {
        const reserva = await servicioReservas.obtenerReservaPorId(req.params.id);

        if (!reserva) {
          return res.status(404).render("no-encontrado", {
            titulo: "Reserva No Encontrada",
            mensaje: `No existe ninguna reserva con el identificador #${req.params.id}.`,
          });
        }

        res.render("reservas/detalle", {
          titulo: `Detalle de Reserva #${reserva._id}`,
          reserva,
        });
      } catch (error) {
        next(error);
      }
    },

    crear: async (req, res, next) => {
      try {
        await servicioReservas.crearReserva(req.reservaValida);
        res.redirect("/reservas");
      } catch (error) {
        next(error);
      }
    },
  };
}

module.exports = { crearControladorReservas };