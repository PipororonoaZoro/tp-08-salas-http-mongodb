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

  // Obtener las salas permitidas (alineadas con el enum del modelo Mongoose)
  async function obtenerSalasPermitidas() {
    return ["Sala Norte", "Sala Sur", "Sala Multimedia"];
  }

  // Obtener los turnos permitidos (requerido por el formulario web tradicional)
  async function obtenerTurnosPermitidos() {
    return ["Mañana", "Tarde", "Noche"];
  }

  return {
    obtenerReservas,
    obtenerReservaPorId,
    crearReserva,
    obtenerCantidad,
    obtenerSalasPermitidas,
    obtenerTurnosPermitidos,
    // Alias para compatibilidad total con el controlador web tradicional:
    obtenerTodas: obtenerReservas,
  };
}

module.exports = { crearServicioReservas };