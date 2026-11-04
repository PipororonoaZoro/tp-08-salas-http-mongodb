function crearMiddlewareValidarReserva(servicioReservas) {
  return function validarReserva(req, res, next) {
    const { estudiante, email, sala, fecha, turno, personas } = req.body;

    const estudianteLimpio = estudiante ? estudiante.trim() : "";
    const emailLimpio = email ? email.trim() : "";

    const valores = {
      estudiante: estudianteLimpio,
      email: emailLimpio,
      sala,
      fecha,
      turno,
      personas,
    };

    const salasPermitidas = servicioReservas.obtenerSalasPermitidas();
    const turnosPermitidos = servicioReservas.obtenerTurnosPermitidos();

    if (
      !estudianteLimpio ||
      !emailLimpio ||
      !sala ||
      !fecha ||
      !turno ||
      personas === undefined ||
      personas === null ||
      personas === ""
    ) {
      return res.status(400).render("reservas/nueva", {
        titulo: "Nueva Reserva",
        error: "Todos los campos son obligatorios",
        valores,
        salasPermitidas,
        turnosPermitidos,
      });
    }

    // Guarda estricta de tipos para el campo personas (evitar booleanos, arreglos o no numéricos)
    if (
      typeof personas === "boolean" ||
      Array.isArray(personas) ||
      isNaN(Number(personas))
    ) {
      return res.status(400).render("reservas/nueva", {
        titulo: "Nueva Reserva",
        error: "El campo personas debe ser un número válido.",
        valores,
        salasPermitidas,
        turnosPermitidos,
      });
    }

    const numPersonas = Number(personas);

    // Validación de rango (entero entre 1 y 6 según rúbrica)
    if (!Number.isInteger(numPersonas) || numPersonas < 1 || numPersonas > 6) {
      return res.status(400).render("reservas/nueva", {
        titulo: "Nueva Reserva",
        error: "La cantidad de personas debe ser un número entero entre 1 y 6.",
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