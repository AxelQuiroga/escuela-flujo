# School Management Backend

Backend API para gestionar **alumnos, profesores, directores, cursos y notas**.
Construido con Node.js, Express y MongoDB usando arquitectura por capas.

---

## Tecnologías utilizadas

* Node.js
* Express
* MongoDB
* Mongoose
* bcryptjs
* jsonwebtoken
* dotenv
* Nodemon
* Jest
* Supertest

---

## Arquitectura del proyecto

El proyecto sigue una arquitectura profesional separada por capas:

```
src
│
├── config
│   └── db.js
│
├── constants
│   └── roles.js
│
├── middlewares
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── role.middleware.js
│
├── modules
│   ├── auth
│   │   ├── auth.controller.js
│   │   ├── auth.routes.js
│   │   └── auth.service.js
│   ├── users
│   │   ├── user.controller.js
│   │   ├── user.model.js
│   │   ├── user.repository.js
│   │   ├── user.routes.js
│   │   └── user.service.js
│   ├── courses
│   │   ├── course.controller.js
│   │   ├── course.model.js
│   │   ├── course.repository.js
│   │   ├── course.routes.js
│   │   └── course.service.js
│   └── grades
│       ├── grade.controller.js
│       ├── grade.model.js
│       ├── grade.repository.js
│       ├── grade.routes.js
│       └── grade.service.js
│
├── app.js
└── server.js
```

Flujo de una petición:

```
Request
 → Route
 → Middleware (Auth/Role)
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
* password (hasheado con bcryptjs)
* role

---

### Course

Representa un curso escolar.

Campos:

* name
* division
* profesor (referencia a User)
* alumnos (array de referencias a User)
* cupoMaximo (límite de inscriptos, default: 30)
* prerequisito (referencia a Course, opcional — correlatividad)

---

### Grade

Representa una nota de un alumno.

Campos:

* alumno (User)
* curso (Course)
* titulo
* nota (1–10)

---

## Autenticación y Autorización

### JWT Authentication

* Login con email y password
* Token JWT con expiración de 1 hora
* Middleware de autenticación para rutas protegidas

### Roles y Permisos

#### Director

Puede:

* ver cursos
* ver alumnos
* eliminar alumnos
* editar alumnos
* ver notas
* crear usuarios
* eliminar cursos

No puede:

* modificar notas

#### Profesor

Puede:

* ver alumnos de su curso
* crear notas
* editar notas de su curso
* ver cursos
* crear cursos

No puede:

* modificar cursos de otros profesores
* gestionar usuarios

#### Alumno

Puede:

* ver únicamente sus notas
* ver su curso asignado

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/AxelQuiroga/escuela-flujo.git
cd escuela-flujo
```

Instalar dependencias:

```bash
npm install
```

---

## Variables de entorno

Crear archivo `.env`:

```bash
PORT=8067
MONGO_URI=mongodb://localhost:27017/school_management
JWT_SECRET=your_secret_key_here
```

Para pruebas, usar `.env.test`:

```bash
PORT=8068
MONGO_URI=mongodb://localhost:27017/test_school_management
JWT_SECRET=test_secret_key
```

---

## Ejecutar el proyecto

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

Servidor:

```bash
http://localhost:8067
```

---

## Endpoints

### Autenticación

```bash
POST /auth/login
```

### Usuarios

```bash
GET /user              # Solo DIRECTOR
GET /user/:id          # Director o dueño
POST /user             # Solo DIRECTOR
PUT /user/:id          # Director o dueño
DELETE /user/:id       # Solo DIRECTOR
```

### Cursos

```bash
GET /course                    # Director y PROFESOR
GET /course/:id                # Todos los roles (con validación)
POST /course                   # Director y PROFESOR
PUT /course/:id                # Director y PROFESOR (con ownership)
DELETE /course/:id             # Solo DIRECTOR
POST /course/:id/alumnos       # Director y PROFESOR
DELETE /course/:id/alumnos/:id # Director y PROFESOR
```

### Notas

```bash
GET /grade                           # Director y PROFESOR
GET /grade/:id                       # Todos (con validación)
GET /grade/alumno/:id                # Solo dueño o DIRECTOR
GET /grade/alumno/:id/boletin        # Solo dueño o DIRECTOR — Boletín académico
POST /grade                          # Solo PROFESOR
PUT /grade/:id                       # Solo PROFESOR
DELETE /grade/:id                    # Solo PROFESOR
```

---

## Testing

El proyecto incluye tests completos con Jest y Supertest:

```bash
# Ejecutar todos los tests
npm test

# Ejecutar en modo watch
npm run test:watch
```

### Cobertura de Tests

* **45 tests** cubriendo todos los endpoints y reglas de negocio
* Tests de autenticación y autorización
* Validación de permisos por rol
* Tests de reglas de negocio (cupo, duplicados, prerequisitos, pertenencia al curso)
* Tests del boletín académico
* Base de datos aislada para pruebas

---

## Características Implementadas

✅ **Autenticación JWT** completa  
✅ **Autorización por roles** con middleware  
✅ **Validaciones de negocio** por rol  
✅ **Password hashing** con bcryptjs  
✅ **Manejo de errores** centralizado  
✅ **Tests automatizados** — 45 tests en verde  
✅ **Arquitectura limpia** por capas con Inyección de Dependencias  
✅ **Base de datos relacional** con referencias  
✅ **Cupo máximo** por curso — no permite sobreventa de vacantes  
✅ **Prevención de inscripción duplicada** — un alumno no puede inscribirse dos veces  
✅ **Correlatividades (prerequisitos)** — requiere nota >= 6 para cursos avanzados  
✅ **Consistencia académica** — solo se puede calificar a alumnos inscriptos en el curso  
✅ **Boletín académico** con promedio por materia y estado (APROBADO / EN RIESGO / SIN CALIFICACIONES)  

---

## Mejoras futuras

* Validación de entrada con Zod o Joi
* Sistema de logs
* Rate limiting
* Cache con Redis
* Dockerización del proyecto
* Documentación con Swagger/OpenAPI
* Sistema de notificaciones
* Backup de datos

---

## Autor

Sebastián Quiroga
