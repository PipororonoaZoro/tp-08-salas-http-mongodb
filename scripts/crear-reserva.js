const { conectarBaseDatos, desconectarBaseDatos } = require("../src/config/base-datos");
const Reserva = require("../src/modelos/reserva");

async function ejecutarCreacion() {
    try {
        console.log("[CREATE] Conectando a la base de datos para crear una reserva...");
        await conectarBaseDatos();

        const nuevaReservaData = {
            estudiante: "Estudiante de Prueba",
            email: "estudiante@nodo.com",
            sala: "Sala Norte",
            fecha: "2026-10-15",
            turno: "Mañana",
            personas: 3
        };

        const reserva = new Reserva(nuevaReservaData);
        const reservaGuardada = await reserva.save();

        console.log("[CREATE] ¡Reserva guardada exitosamente!");
        console.log(`[CREATE] ID del documento creado: ${reservaGuardada._id}`);
    }
    catch (error) {
        console.error("[CREATE] Error al intentar guardar la reserva:", error.message);
        process.exitCode = 1;
    }
    finally {
        await desconectarBaseDatos();
        console.log("[CREATE] Conexion cerrada.");
    }
}

ejecutarCreacion();