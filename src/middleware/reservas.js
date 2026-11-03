function crearMiddlewareValidarReserva(servicioReservas) {
  return function validarReserva(req, res, next) {
    const { estudiante, email, sala, fecha, turno, personas } = req.body;

    const estudianteLimpio = estudiante ? estudiante.trim() : "";
    const emailLimpio = email ? email.trim() : "";
    const numPersonas = Number(personas);

    const salasPermitidas = servicioReservas.obtenerSalasPermitidas();
    const turnosPermitidos = servicioReservas.obtenerTurnosPermitidos();

    const valores = {
      estudiante: estudianteLimpio,
      email: emailLimpio,
      sala,
      fecha,
      turno,
      personas,
    };

    if (
      !estudianteLimpio ||
      !emailLimpio ||
      !sala ||
      !fecha ||
      !turno ||
      !personas
    ) {
      return res.status(400).render("reservas/nueva", {
        titulo: "Nueva Reserva",
        error: "Todos los campos son obligatorios",
        valores,
        salasPermitidas,
        turnosPermitidos,
      });
    }

    if (!emailLimpio.includes("@")) {
      return res.status(400).render("reservas/nueva", {
        titulo: "Nueva Reserva",
        error: "El correo electrónico debe incluir un '@' válido.",
        valores,
        salasPermitidas,
        turnosPermitidos,
      });
    }

    if (!salasPermitidas.includes(sala)) {
      return res.status(400).render("reservas/nueva", {
        titulo: "Nueva Reserva",
        error: "La sala seleccionada no es válida",
        valores,
        salasPermitidas,
        turnosPermitidos,
      });
    }

    req.reservaValida = {
      estudiante: estudianteLimpio,
      email: emailLimpio,
      sala,
      fecha,
      turno,
      personas: numPersonas,
    };

    next();
  };
}

module.exports = { crearMiddlewareValidarReserva };
