const { conectarBaseDatos, desconectarBaseDatos } = require("../src/config/base-datos");

async function probarConexion() {
    try {
        console.log("[TEST] Iniciando prueba de conexion a MongoDB Atlas...");
        await conectarBaseDatos();
        console.log("[TEST] ¡Conexion verificada exitosamente!");
    }
    catch (error) {
        console.error("[TEST] Fallo la prueba de conexion:", error.message);
        process.exitCode = 1;
    }
    finally {
        await desconectarBaseDatos();
        console.log("[TEST] Recursos cerrados. Finalizando proceso.");
    }
}

probarConexion();