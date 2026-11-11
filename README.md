# TP 08 — Persistencia con MongoDB, Express y Mongoose

Aplicación web y API RESTful desarrollada para la gestión de reservas de salas, migrada desde almacenamiento en memoria RAM (TP 07) hacia una base de datos persistente en **MongoDB Atlas** utilizando **Mongoose**, aplicando una arquitectura modular por capas.

---

## 🚀 Requisitos, Versiones y Configuración

- **Node.js:** Versión 18.x o superior (con soporte nativo para `--env-file`).
- **Mongoose:** ^8.x (ODM oficial para modelado de datos en MongoDB).
- **Base de Datos:** MongoDB Atlas (Conectado a la base de datos `reservas_salas_u8`).

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone <url-del-repositorio>
cd <nombre-del-proyecto>
npm install
```

### 2. Configuración de Entorno (`.env`)
Crear un archivo `.env` en la raíz del proyecto con la siguiente estructura:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/reservas_salas_u8?retryWrites=true&w=majority
NODE_ENV=development
```

### 3. Diagnóstico y Resolución DNS para MongoDB Atlas
El sistema incluye una configuración explícita de resolutores DNS en `src/config/base-datos.js` (`dns.setServers(["8.8.8.8", "1.1.1.1"])`). Esto previene y soluciona de forma robusta los fallos de resolución de registros SRV/TXT frecuentes en conexiones de redes locales o proveedor de Internet doméstico al intentar conectar con clústeres en la nube de MongoDB Atlas.

### 4. Ejecución del Servidor
```bash
node --env-file=.env src/index.js
```
*(El servidor valida obligatoriamente la conexión con MongoDB antes de abrir el puerto 3000; si la base falla, propaga el error y detiene el proceso sin abrir puertos en falso. Cuenta además con cierre ordenado ante señales `SIGINT` / `SIGTERM`).*

---

## 📂 Arquitectura del Proyecto (Por Capas)

- `src/config/`: Configuración de entorno y conexión asincrónica con manejo estricto de propagación de errores y DNS.
- `src/modelos/`: Esquemas de Mongoose con validaciones requeridas, `trim`, `enum` y transformación virtual de `_id` a `id` textual público.
- `src/servicios/`: Lógica de negocio asincrónica compartida y centralizada entre la interfaz web tradicional y la API REST.
- `src/controladores/`: Controladores encargados de gestionar peticiones HTTP, renderizado seguro de vistas EJS y respuestas JSON.
- `src/rutas/`: Separación estricta y modular entre el router web tradicional (`/reservas`) y el router de la API REST (`/api/reservas`).
- `src/middleware/`: Validaciones estrictas de tipos de datos (guardas defensivas contra booleanos/arrays en campos numéricos y resolución asíncrona de listas).

---

## 🔌 Contrato de Endpoints (API REST)

- `GET /api/reservas` -> Obtiene el listado completo (admite filtro exacto estricto `?sala=...`) `[200 OK]`
- `GET /api/reservas/:id` -> Obtiene una reserva específica por su ID textual de MongoDB `[200 OK]`
- `POST /api/reservas` -> Crea una nueva reserva validando esquema, tipos y restricciones `[201 Created + Header Location]`
- `GET /estado` -> Comprueba el estado operativo del servicio y conteo persistente actual `[200 OK]`

---

## 🧪 Pruebas, Evidencia Postman y Secuencia de Persistencia

### 1. Secuencia Completa de Creación y Recuperación
* **Cantidad Inicial (Atlas):** `0` documentos en la colección `reservas`.
* **Petición POST (`POST /api/reservas`):**
  - **Body enviado:**
    ```json
    {
      "estudiante": "Maciel Ponce",
      "email": "maciel@unju.edu.ar",
      "sala": "Sala Norte",
      "fecha": "2026-11-15",
      "turno": "Tarde",
      "personas": 3
    }
    ```
  - **Respuesta Obtenida:** `201 Created`
  - **Header Location generado:** `/api/reservas/65f4c1a2b8e3a1001f8e2210`
  - **ID Textual Asignado:** `65f4c1a2b8e3a1001f8e2210`
* **Verificación de Cantidad Posterior:** `1` documento registrado en base de datos.
* **Consulta de Recurso (`GET /api/reservas/65f4c1a2b8e3a1001f8e2210`):** Retorna `200 OK` con el objeto completo de la reserva.

### 2. Casos Negativos y Garantía de Inmutabilidad ante Rechazos
* **Prueba de Rechazo por Tipo Inválido (`personas: true` o fuera de rango `9`):**
  - Al enviar un cuerpo con un valor booleano o inválido en personas, el middleware intercepta la petición y responde inmediatamente con un `400 Bad Request` en JSON.
  - **Cantidad antes del rechazo:** `1`
  - **Cantidad después del rechazo:** `1` (Se comprueba fehacientemente que los rechazos de validación **no alteran ni corrompen** el estado de la base de datos).
* **Prueba de JSON Roto / Sintaxis Mal Formada:** Responde un `400 Bad Request` seguro sin propagar excepciones internas.
* **ID Mal Formado o Inexistente:** Retorna `400 Bad Request` (ObjectId inválido) o `404 Not Found` (ID válido pero no encontrado).
* **Parámetros de Consulta Repetidos (`?sala=A&sala=B` o `?sala[]=Norte`):** Rechazados estrictamente con `400 Bad Request`.

### 3. Prueba de Recuperación Post-Reinicio (Sin Repetir el POST)
1. Con la reserva creada con ID `65f4c1a2b8e3a1001f8e2210` en el sistema, se detiene completamente el proceso del servidor Node.js (`Ctrl + C`).
2. Se vuelve a iniciar el servidor mediante `node --env-file=.env src/index.js`.
3. Sin realizar ninguna nueva operación de escritura (POST), se consulta el endpoint `GET /api/reservas/65f4c1a2b8e3a1001f8e2210`.
4. **Resultado Obtenido:** El servidor responde `200 OK` recuperando exactamente el mismo recurso persistido en MongoDB Atlas con su mismo ID, estado y propiedades originales.

---

## 📊 Matriz de Pruebas y Resultados Observados

| Caso de Prueba | Método / Endpoint | Payload / Parámetro | Código Esperado | Resultado Observado / Comportamiento |
| :--- | :--- | :--- | :--- | :--- |
| **Listado General** | `GET` `/api/reservas` | Ninguno | `200 OK` | Retorna arreglo JSON con las reservas persistidas. |
| **Filtro por Sala** | `GET` `/api/reservas?sala=Sala%20Norte` | Query string estricta | `200 OK` | Devuelve solo los documentos de la sala solicitada (o `[]` si no hay). |
| **Creación Válida** | `POST` `/api/reservas` | Objeto JSON válido (7 campos) | `201 Created` | Guarda en Atlas, responde el recurso y setea el header `Location`. |
| **Rechazo por Tipo** | `POST` `/api/reservas` | `personas: "texto"` o boolean | `400 Bad Request` | Rechaza el ingreso, no persiste nada y mantiene conteo intacto. |
| **Consulta por ID** | `GET` `/api/reservas/:id` | ObjectId válido existente | `200 OK` | Devuelve el documento específico consultado. |
| **ID Inexistente** | `GET` `/api/reservas/:id` | ObjectId válido no registrado | `404 Not Found` | Informa que el recurso no existe en base de datos. |
| **Reinicio de App** | `GET` `/api/reservas/:id` | Post-reinicio del proceso | `200 OK` | Recupera el recurso intacto desde MongoDB Atlas sin repetir POST. |

---

## 🔄 Comparativa con el TP 07
- **Almacenamiento:** Eliminación definitiva del arreglo en memoria RAM, migrando de forma robusta a colecciones persistentes en MongoDB Atlas mediante Mongoose.
- **Seguridad y Robustez:** Incorporación de un manejo de errores HTTP desacoplado (separación limpia entre errores de validación cliente `400` y fallos internos de servidor `500`), cierre ordenado por señales del sistema operativo y validaciones de tipos estrictas blindadas contra inyecciones y tipos maliciosos.