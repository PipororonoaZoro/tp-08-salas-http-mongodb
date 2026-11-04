const { obtenerConfiguracion } = require("./config/entorno");
const { conectarBaseDatos } = require("./config/base-datos");
const { crearServicioReservas } = require("./servicios/reservas");
const { crearApp } = require("./app");
const mongoose = require("mongoose");

async function iniciarSistema() {
  try {
    const configuracion = obtenerConfiguracion();

    // 1. Conectamos primero a MongoDB Atlas (si falla, propaga el error y no abre el puerto)
    await conectarBaseDatos();

    // 2. Inicializamos servicios y la app de Express
    const servicioReservas = crearServicioReservas();
    const app = crearApp(servicioReservas, configuracion);

    // 3. Definimos el puerto con respaldo por si viene con otro nombre
    const puertoApp = configuracion.puerto || configuracion.port || 3000;

    // 4. Levantamos el servidor y guardamos la referencia
    const servidor = app.listen(puertoApp, () => {
      console.log(`Servidor escuchando en http://localhost:${puertoApp}`);
    });

    // 5. Cierre ordenado ante señales del sistema (SIGINT / SIGTERM)
    const cerrarSistemaOrdenado = async (senal) => {
      console.log(`\n[${senal}] Recibida señal de interrupción. Cerrando servidor HTTP y base de datos...`);
      servidor.close(async () => {
        try {
          await mongoose.connection.close();
          console.log('Conexión a MongoDB cerrada de forma limpia.');
          process.exit(0);
        } catch (error) {
          console.error('Error al cerrar la conexión de la base de datos:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGINT', () => cerrarSistemaOrdenado('SIGINT'));
    process.on('SIGTERM', () => cerrarSistemaOrdenado('SIGTERM'));

  } catch (error) {
    console.error(`Error al iniciar el servidor: ${error.message}`);
    process.exit(1);
  }
}

iniciarSistema();