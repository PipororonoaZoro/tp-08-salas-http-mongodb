# TP 08 - Endpoints Persistentes de Reservas de Salas (MongoDB)

Trabajo práctico individual de desarrollo back-end con Node.js, Express y MongoDB Atlas. Migración del almacenamiento en memoria del TP 07 hacia una base de datos persistente mediante Mongoose.

---

## 1. Características Principales y Origen
* **Origen de la copia:** Basado en el proyecto funcional individual del TP 07.
* **Persistencia:** Conexión asincrónica a MongoDB Atlas Free Tier (`reservas_salas_u8`, colección `reservas`) utilizando Mongoose.
* **Dualidad de Vistas:** Mantiene la compatibilidad con el sitio web tradicional (vistas EJS renderizadas desde el servidor) y expone una API RESTful en formato JSON.

---

## 2. Requisitos y Entorno
* **Node.js** (Versión recomendada: v18 o superior).
* **MongoDB Atlas** (URI de conexión configurada mediante variables de entorno).

### Variables de Entorno (`.env`)
Crear un archivo `.env` en la raíz del proyecto basándose en la plantilla `.env.example`:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/reservas_salas_u8?retryWrites=true&w=majority
```
*(Nota: El archivo `.env` no se incluye en el control de versiones por seguridad).*

---

## 3. Comando de Inicio
Para iniciar el servidor en entorno de desarrollo utilizando la carga nativa de variables de entorno de Node.js:
```bash
node --env-file=.env src/index.js
```

---

## 4. Estructura del Proyecto por Capas
* `src/config/`: Configuración de la conexión a la base de datos.
* `src/modelos/`: Esquemas y modelos de Mongoose (`reserva.js`).
* `src/servicios/`: Lógica de negocio y operaciones asincrónicas contra MongoDB.
* `src/controladores/`: Manejadores de peticiones tanto para la API JSON como para las vistas EJS.
* `src/rutas/`: Separación entre routers de la API (`/api/reservas`) y rutas web tradicionales (`/reservas`).
* `src/middleware/`: Manejo centralizado de errores y validaciones.

---

## 5. Tabla de Endpoints (API REST)

| Método | Endpoint | Descripción | Respuesta Exitosa |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/reservas` | Obtiene el listado completo de reservas. | `200 OK` (Arreglo JSON) |
| **GET** | `/api/reservas/:id` | Consulta una reserva específica por su ID. | `200 OK` (Objeto JSON) |
| **POST** | `/api/reservas` | Crea una nueva reserva (estado por defecto: `pendiente`). | `201 Created` (Cabecera `Location`) |
| **GET** | `/api/reservas?sala=X` | Filtra las reservas de forma exacta por nombre de sala. | `200 OK` (Arreglo filtrado) |
| **GET** | `/estado` | Obtiene el conteo total de reservas desde la base de datos. | `200 OK` |

---

## 6. Instrucciones para Pruebas en Postman

1. **Listar Reservas:** Realizar una solicitud `GET` a `http://localhost:3000/api/reservas` (sin cuerpo).
2. **Crear Reserva:** Realizar un `POST` a `http://localhost:3000/api/reservas` seleccionando Body -> raw -> JSON:
   ```json
   {
     "estudiante": "Ana Ejemplo",
     "email": "ana@example.com",
     "sala": "Sala Norte",
     "fecha": "2026-10-21",
     "turno": "Mañana",
     "personas": 2
   }
   ```
3. **Consultar por ID / Location:** Copiar el ID o la URL recibida en la cabecera `Location` de la respuesta anterior y realizar un `GET` a dicha dirección.

---

## 7. Matriz de Resultados Mínimos

| Caso de Prueba | Resultado Esperado | Estado Actual |
| :--- | :--- | :--- |
| Listado con base vacía o con datos | `200 OK` y arreglo JSON | ✅ Validado |
| Creación válida | `201 Created` y cabecera `Location` | ✅ Validado |
| Consulta por ID existente | `200 OK` y recurso correspondiente | ✅ Validado |
| Consulta tras reiniciar el servidor | `200 OK` (Persistencia comprobada) | ✅ Validado |
| ID mal formado (`/1`) | `400 Bad Request` | ✅ Validado |
| ID válido inexistente (`000...`) | `404 Not Found` | ✅ Validado |
| Creación inválida (campos vacíos / sin `@`) | `400 Bad Request` (Sin escrituras) | ✅ Validado |
| Filtro exacto por sala | Coincidencias exactas o `[]` | ✅ Validado |
| Sitio web tradicional y vistas EJS | Conteo persistente y renderizado correcto | ✅ Validado |