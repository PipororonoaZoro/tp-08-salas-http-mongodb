# TP 08 — Persistencia con MongoDB, Express y Mongoose

Aplicación web y API RESTful desarrollada para la gestión de reservas de salas, migrada desde almacenamiento en memoria RAM (TP 07) hacia una base de datos persistente en **MongoDB Atlas** utilizando **Mongoose**, aplicando una arquitectura modular por capas.

## 🚀 Requisitos e Instalación

* Node.js (Versión 18 o superior recomendada, con soporte nativo para --env-file).
* MongoDB Atlas (Base de datos configurada con el nombre reservas_salas_u8).

### 1. Clonar el repositorio e instalar dependencias
git clone <url-del-repositorio>
cd <nombre-del-proyecto>
npm install

### 2. Configuración de Entorno
Crear un archivo .env en la raíz del proyecto:
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/reservas_salas_u8?retryWrites=true&w=majority
NODE_ENV=development

### 3. Ejecución del Servidor
node --env-file=.env src/index.js
*(El servidor aguardará la conexión exitosa a MongoDB antes de abrir el puerto 3000 y cuenta con cierre ordenado ante señales SIGINT / SIGTERM).*

---

## 📂 Arquitectura del Proyecto (Por Capas)

* `src/config/`: Configuración de entorno y conexión asincrónica a MongoDB con Mongoose.
* `src/modelos/`: Esquemas de Mongoose con validaciones estrictas, enums y transformación de _id a id textual público.
* `src/servicios/`: Lógica de negocio asincrónica centralizada, compartida entre la interfaz web y la API REST.
* `src/controladores/`: Controladores encargados de gestionar las peticiones HTTP y renderizar vistas EJS o respuestas JSON.
* `src/rutas/`: Separación estricta entre el router web tradicional (/reservas) y el router de la API REST (/api/reservas).
* `src/middleware/`: Validaciones estrictas de tipos (guardas contra booleanos/arrays en campos numéricos) y control de solicitudes.

---

## 🔌 Contrato de Endpoints (API REST)

* GET /api/reservas -> Obtiene el listado completo (admite filtro exacto ?sala=...) [200 OK]
* GET /api/reservas/:id -> Obtiene una reserva específica por su ID textual [200 OK]
* POST /api/reservas -> Crea una nueva reserva validando esquema y tipos [201 Created + Header Location]
* GET /estado -> Comprueba el estado del servicio y conteo persistente [200 OK]

---

## 🧪 Pruebas y Evidencia (Postman / Casos Negativos)

1. **Creación Exitosa (POST /api/reservas):**
   * Envía un JSON válido con estudiante, email, sala, fecha, turno y personas.
   * Retorna 201 Created, el objeto con su id textual y genera la cabecera Location: /api/reservas/<id>.
2. **Consulta y Persistencia Post-Reinicio:**
   * Al reiniciar Node.js, las reservas se mantienen intactas en MongoDB Atlas, comprobándose mediante GET /api/reservas y la vista web.
3. **Casos Negativos controlados:**
   * JSON roto / sintaxis inválida: Retorna 400 Bad Request en formato JSON de forma segura.
   * ID mal formado o inexistente: Retorna 400 Bad Request o 404 Not Found.
   * Parámetros repetidos o no textuales en query (?sala[]=...): Rechazados explícitamente con 400 Bad Request.
   * Tipos de datos inválidos en personas (booleanos/arrays): Interceptados y rechazados antes de persistir.

---

## 🔄 Comparativa con el TP 07
* **Almacenamiento:** Se retiró el arreglo estático en memoria RAM, migrando de manera completa a documentos persistentes en MongoDB Atlas mediante Mongoose.
* **Robustez:** Incorporación de manejo de errores HTTP seguros (separación limpia entre errores 400 y 500), cierre ordenado por señales y validaciones tipadas estrictas.