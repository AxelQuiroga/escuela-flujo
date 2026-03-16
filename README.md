# School Management Backend

Backend API para gestionar **alumnos, profesores, directores, cursos y notas**.
Construido con Node.js, Express y MongoDB usando arquitectura por capas.

---

## Tecnologías utilizadas

* Node.js
* Express
* MongoDB
* Mongoose
* CORS
* dotenv
* Nodemon

---

## Arquitectura del proyecto

El proyecto sigue una arquitectura profesional separada por capas:

```
src
│
├── config
│   └── db.js
│
├── models
│   ├── user.model.js
│   ├── course.model.js
│   └── grade.model.js
│
├── repositories
│   ├── user.repository.js
│   ├── course.repository.js
│   └── grade.repository.js
│
├── services
│   ├── user.service.js
│   ├── course.service.js
│   └── grade.service.js
│
├── controllers
│   ├── user.controller.js
│   ├── course.controller.js
│   └── grade.controller.js
│
├── routes
│   ├── user.routes.js
│   ├── course.routes.js
│   └── grade.routes.js
│
├── middleware
│   └── error.middleware.js
│
├── app.js
└── server.js
```

Flujo de una petición:

```
Request
 → Route
 → Middleware
 → Controller
 → Service
 → Repository
 → Database
```

---

## Modelos principales

### User

Representa usuarios del sistema.

Roles posibles:

* DIRECTOR
* PROFESOR
* ALUMNO

Campos principales:

* name
* email
* password
* role

---

### Course

Representa un curso escolar.

Campos:

* name
* division
* profesor (referencia a User)
* alumnos (array de referencias a User)

---

### Grade

Representa una nota de un alumno.

Campos:

* alumno (User)
* curso (Course)
* titulo
* nota (1–10)

---

## Reglas del sistema

### Director

Puede:

* ver cursos
* ver alumnos
* eliminar alumnos
* editar alumnos
* ver notas

No puede:

* modificar notas

---

### Profesor

Puede:

* ver alumnos de su curso
* crear notas
* editar notas de su curso

No puede:

* modificar cursos de otros profesores

---

### Alumno

Puede:

* ver únicamente sus notas

---

## Instalación

Clonar el repositorio:

```
git clone <repo-url>
```

Entrar en el proyecto:

```
cd project
```

Instalar dependencias:

```
npm install
```

---

## Variables de entorno

Crear archivo `.env`:

```
PORT=asignar
MONGO_URI=mongodb://localhost:27017/tuuser
```

---

## Ejecutar el proyecto

Modo desarrollo:

```
npm run dev
```

Servidor:

```
http://localhost:8067
```

---

## Endpoints principales

### Users

```
GET /users
GET /users/:id
POST /users
PUT /users/:id
DELETE /users/:id
```

---

### Courses

```
GET /courses
GET /courses/:id
POST /courses
PUT /courses/:id
DELETE /courses/:id
```

---

### Grades

```
GET /grades
GET /grades/:id
GET /grades/alumno/:id
POST /grades
PUT /grades/:id
DELETE /grades/:id
```

---

## Mejoras futuras

* Autenticación con JWT
* Middleware de autorización por roles
* Validación con Zod o Joi
* Tests con Jest
* Dockerización del proyecto

---

## Autor

Sebastián Quiroga
