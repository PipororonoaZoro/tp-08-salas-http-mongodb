const Reserva = require("../modelos/reserva");

function crearServicioReservas() {
  // Obtener todas las reservas (con soporte opcional para filtro exacto de sala)
  async function obtenerReservas(filtroSala = null) {
    const query = filtroSala ? { sala: filtroSala } : {};
    return await Reserva.find(query);
  }

  // Obtener una reserva por su ID de MongoDB
  async function obtenerReservaPorId(id) {
    return await Reserva.findById(id);
  }

  // Crear una nueva reserva (extrayendo únicamente los campos permitidos)
  async function crearReserva(datosCliente) {
    const nuevaReserva = new Reserva({
      estudiante: datosCliente.estudiante,
      email: datosCliente.email,
      sala: datosCliente.sala,
      fecha: datosCliente.fecha,
      turno: datosCliente.turno,
      personas: datosCliente.personas,
    });

    return await nuevaReserva.save();
  }

  // Obtener la cantidad total de reservas (requerido para /estado)
  async function obtenerCantidad() {
    return await Reserva.countDocuments();
  }

  // Obtener las salas permitidas (requerido por el formulario web tradicional)
  async function obtenerSalasPermitidas() {
    // Retornamos las salas fijas o un listado distintivo desde la base de datos
    return ["Sala A", "Sala B", "Sala Sur", "Sala Norte"];
  }

  return {
    obtenerReservas,
    obtenerReservaPorId,
    crearReserva,
    obtenerCantidad,
    obtenerSalasPermitidas,
    // Alias para compatibilidad total con el controlador web tradicional:
    obtenerTodas: obtenerReservas,
  };
}

module.exports = { crearServicioReservas };