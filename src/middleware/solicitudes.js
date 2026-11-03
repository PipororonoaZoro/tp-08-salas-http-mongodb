let contadorSolicitudes = 0;

function identificarSolicitud(req, res, next) {
  contadorSolicitudes++;
  const idFormateado = `BIB-${String(contadorSolicitudes).padStart(4, "0")}`;
  res.locals.solicitudId = idFormateado;
  next();
}

function medirDuracion(req, res, next) {
  const inicio = Date.now();

  res.on("finish", () => {
    const duracion = Date.now() - inicio;
    console.log(
      `[MEDICION] ID: ${res.locals.solicitudId} | Método: ${req.method} | URL: ${req.originalUrl} | Estado: ${res.statusCode} | Duración: ${duracion}ms`,
    );
  });

  next();
}

module.exports = {
  identificarSolicitud,
  medirDuracion,
};
