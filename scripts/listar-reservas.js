const { conectarBaseDatos, desconectarBaseDatos } = require("../src/config/base-datos");
const Reserva = require("../src/modelos/reserva");

async function ejecutarListado() {
  try {
    console.log("[LIST] Conectando a la base de datos para listar reservas...");
    await conectarBaseDatos();

    const reservas = await Reserva.find({});
    console.log(`\n[LIST] Total de reservas encontradas: ${reservas.length}`);
    
    if (reservas.length > 0) {
      console.log("--------------------------------------------------");
      reservas.forEach((res, index) => {
        console.log(`[${index + 1}] ID: ${res._id}`);
        console.log(`    Estudiante: ${res.estudiante} (${res.email})`);
        console.log(`    Sala: ${res.sala} | Turno: ${res.turno} | Fecha: ${res.fecha} | Personas: ${res.personas}`);
        console.log("--------------------------------------------------");
      });
    }
  } catch (error) {
    console.error("[LIST] Error al consultar las reservas:", error.message);
    process.exitCode = 1;
  } finally {
    await desconectarBaseDatos();
    console.log("[LIST] Conexión cerrada.");
  }
}

ejecutarListado();