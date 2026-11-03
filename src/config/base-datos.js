const dns = require("node:dns");
const mongoose = require("mongoose");
const { obtenerConfiguracion } = require("./entorno");

// configurar resolutores autorizados para evitar problemas SRV/TXT en redes locales
dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function conectarBaseDatos() {
  const { mongoUri } = obtenerConfiguracion();

  if (!mongoUri || !mongoUri.startsWith("mongodb")) {
    throw new Error(
      "[DB] MONGODB_URI no esta definida correctamente en las variables de entorno.",
    );
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("[DB] Conexion exitosa a MongoDB Atlas.");
  } catch (error) {
    console.error("[DB] Error al conectar a la base de datos:", error.message);
  }
}

async function desconectarBaseDatos() {
  await mongoose.disconnect();
}

module.exports = { conectarBaseDatos, desconectarBaseDatos };
