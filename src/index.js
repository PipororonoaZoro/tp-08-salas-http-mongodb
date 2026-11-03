const { obtenerConfiguracion } = require("./config/entorno");
const { conectarBaseDatos } = require("./config/base-datos");
const { crearServicioReservas } = require("./servicios/reservas");
const { crearApp } = require("./app");

async function iniciarSistema() {
  try {
    const configuracion = obtenerConfiguracion();

    // 1. Conectamos primero a MongoDB Atlas
    await conectarBaseDatos();

    // 2. Inicializamos servicios y la app de Express
    const servicioReservas = crearServicioReservas();
    const app = crearApp(servicioReservas, configuracion);

    // 3. Definimos el puerto con respaldo por si viene con otro nombre
    const puertoApp = configuracion.puerto || configuracion.port || 3000;

    // 4. Levantamos el servidor
    app.listen(puertoApp, () => {
      console.log(`Servidor escuchando en http://localhost:${puertoApp}`);
    });
  } catch (error) {
    console.error(`Error al iniciar el servidor: ${error.message}`);
    process.exit(1);
  }
}

iniciarSistema();
