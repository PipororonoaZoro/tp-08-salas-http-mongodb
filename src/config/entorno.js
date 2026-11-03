function obtenerConfiguracion() {
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  if (
    Number.isNaN(port) ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    throw new Error(
      `[CONFIG] Puerto invalido en variable PORT: "${process.env.PORT}". Debe ser un numero entero entre 1 y 65535`,
    );
  }

  const nodeEnv = process.env.NODE_ENV || "development";
  const mongoUri = process.env.MONGODB_URI || "";

  return {
    port,
    nodeEnv,
    mongoUri,
  };
}

module.exports = { obtenerConfiguracion };
