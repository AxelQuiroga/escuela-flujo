import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import app from '../src/app.js';
import { User } from '../src/modules/users/user.model.js';
import { Course } from '../src/modules/courses/course.model.js';
import { Grade } from '../src/modules/grades/grade.model.js';

describe('API Endpoints Tests', () => {
  let directorToken, profesorToken, alumnoToken;
  let directorId, profesorId, alumnoId;
  let courseId, gradeId;
  let mongoConnection;

  beforeAll(async () => {
    // ConexiÃ³n a MongoDB de prueba
    mongoConnection = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test_school_management');
  }, 30000);

  afterAll(async () => {
    // Cerrar conexiÃ³n
    if (mongoConnection) {
      await mongoose.connection.close();
    }
  }, 30000);

  beforeEach(async () => {
    // Limpiar base de datos
    await User.deleteMany({});
    await Course.deleteMany({});
    await Grade.deleteMany({});

    // Hashear contraseÃ±as
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Crear usuarios de prueba
    const director = await User.create({
      name: 'Director Test',
      email: 'director@test.com',
      password: hashedPassword,
      role: 'DIRECTOR'
    });

    const profesor = await User.create({
      name: 'Profesor Test',
      email: 'profesor@test.com',
      password: hashedPassword,
      role: 'PROFESOR'
    });

    const alumno = await User.create({
      name: 'Alumno Test',
      email: 'alumno@test.com',
      password: hashedPassword,
      role: 'ALUMNO'
    });

    directorId = director._id.toString();
    profesorId = profesor._id.toString();
    alumnoId = alumno._id.toString();

    // Login y obtener tokens
    const directorLogin = await request(app)
      .post('/auth/login')
      .send({ email: 'director@test.com', password: 'password123' });
    directorToken = directorLogin.body.token;

    const profesorLogin = await request(app)
      .post('/auth/login')
      .send({ email: 'profesor@test.com', password: 'password123' });
    profesorToken = profesorLogin.body.token;

    const alumnoLogin = await request(app)
      .post('/auth/login')
      .send({ email: 'alumno@test.com', password: 'password123' });
    alumnoToken = alumnoLogin.body.token;

    // Crear curso de prueba
    const course = await Course.create({
      name: 'MatemÃ¡ticas',
      division: 'A',
      profesor: profesorId,
      alumnos: [alumnoId]
    });
    courseId = course._id.toString();
  }, 20000);

  describe('AUTH Endpoints', () => {
    test('POST /auth/login - Login exitoso', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'director@test.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    test('POST /auth/login - Credenciales invÃ¡lidas', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'director@test.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
    });

    test('POST /auth/login - Usuario no existe', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'nonexistent@test.com', password: 'password123' });

      expect(response.status).toBe(401);
    });
  });

  describe('USER Endpoints', () => {
    test('GET /user - Director puede ver todos los usuarios', async () => {
      const response = await request(app)
        .get('/user')
        .set('Authorization', `Bearer ${directorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(3);
    });

    test('GET /user - Profesor no puede ver todos los usuarios', async () => {
      const response = await request(app)
        .get('/user')
        .set('Authorization', `Bearer ${profesorToken}`);

      expect(response.status).toBe(403);
    });

    test('GET /user/:id - Director puede ver cualquier usuario', async () => {
      const response = await request(app)
        .get(`/user/${alumnoId}`)
        .set('Authorization', `Bearer ${directorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('alumno@test.com');
    });

    test('GET /user/:id - Usuario puede ver su propio perfil', async () => {
      const response = await request(app)
        .get(`/user/${alumnoId}`)
        .set('Authorization', `Bearer ${alumnoToken}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('alumno@test.com');
    });

    test('POST /user - Director puede crear usuario', async () => {
      const newUser = {
        name: 'Nuevo Alumno',
        email: 'nuevo@test.com',
        password: 'password123',
        role: 'ALUMNO'
      };

      const response = await request(app)
        .post('/user')
        .set('Authorization', `Bearer ${directorToken}`)
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.email).toBe('nuevo@test.com');
    });

    test('POST /user - Profesor no puede crear usuario', async () => {
      const newUser = {
        name: 'Nuevo Alumno',
        email: 'nuevo@test.com',
        password: 'password123',
        role: 'ALUMNO'
      };

      const response = await request(app)
        .post('/user')
        .set('Authorization', `Bearer ${profesorToken}`)
        .send(newUser);

      expect(response.status).toBe(403);
    });

    test('PUT /user/:id - Director puede actualizar usuario', async () => {
      const updateData = { name: 'Alumno Actualizado' };

      const response = await request(app)
        .put(`/user/${alumnoId}`)
        .set('Authorization', `Bearer ${directorToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Alumno Actualizado');
    });

    test('DELETE /user/:id - Director puede eliminar usuario', async () => {
      const response = await request(app)
        .delete(`/user/${alumnoId}`)
        .set('Authorization', `Bearer ${directorToken}`);

      expect(response.status).toBe(204);
    });

    test('DELETE /user/:id - Profesor no puede eliminar usuario', async () => {
      const response = await request(app)
        .delete(`/user/${alumnoId}`)
        .set('Authorization', `Bearer ${profesorToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('COURSE Endpoints', () => {
    test('GET /course - Director puede ver cursos', async () => {
      const response = await request(app)
        .get('/course')
        .set('Authorization', `Bearer ${directorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });

    test('GET /course - Profesor puede ver cursos', async () => {
      const response = await request(app)
        .get('/course')
        .set('Authorization', `Bearer ${profesorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });

    test('GET /course - Alumno no puede ver lista de cursos', async () => {
      const response = await request(app)
        .get('/course')
        .set('Authorization', `Bearer ${alumnoToken}`);

      expect(response.status).toBe(403);
    });

    test('GET /course/:id - Alumno puede ver su curso', async () => {
      const response = await request(app)
        .get(`/course/${courseId}`)
        .set('Authorization', `Bearer ${alumnoToken}`);

      expect(response.status).toBe(200);
    });

    test('POST /course - Director puede crear curso', async () => {
      const newCourse = {
        name: 'Historia',
        division: 'B',
        profesor: profesorId
      };

      const response = await request(app)
        .post('/course')
        .set('Authorization', `Bearer ${directorToken}`)
        .send(newCourse);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Historia');
    });

    test('POST /course - Profesor puede crear curso', async () => {
      const newCourse = {
        name: 'Ciencias',
        division: 'C',
        profesor: profesorId
      };

      const response = await request(app)
        .post('/course')
        .set('Authorization', `Bearer ${profesorToken}`)
        .send(newCourse);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Ciencias');
    });

    test('PUT /course/:id - Profesor puede actualizar su curso', async () => {
      const updateData = { name: 'MatemÃ¡ticas Avanzadas' };

      const response = await request(app)
        .put(`/course/${courseId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('MatemÃ¡ticas Avanzadas');
    });

    test('DELETE /course/:id - Director puede eliminar curso', async () => {
      const response = await request(app)
        .delete(`/course/${courseId}`)
        .set('Authorization', `Bearer ${directorToken}`);

      expect(response.status).toBe(200);
    });

    test('DELETE /course/:id - Profesor no puede eliminar curso', async () => {
      const response = await request(app)
        .delete(`/course/${courseId}`)
        .set('Authorization', `Bearer ${profesorToken}`);

      expect(response.status).toBe(403);
    });

    test('POST /course/:courseId/alumnos - Profesor puede agregar alumno', async () => {
      const newAlumno = await User.create({
        name: 'Otro Alumno',
        email: 'otro@test.com',
        password: 'password123',
        role: 'ALUMNO'
      });

      const response = await request(app)
        .post(`/course/${courseId}/alumnos`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({ alumnoId: newAlumno._id });

      expect(response.status).toBe(200);
    });

    test('DELETE /course/:courseId/alumnos/:alumnoId - Profesor puede remover alumno', async () => {
      const response = await request(app)
        .delete(`/course/${courseId}/alumnos/${alumnoId}`)
        .set('Authorization', `Bearer ${profesorToken}`);

      expect(response.status).toBe(200);
    });

    test('POST /course/:courseId/alumnos - No permite agregar a un alumno que ya estÃ¡ inscrito', async () => {
  // Intentamos agregar a 'alumnoId', que ya forma parte de 'courseId' (creado en el beforeEach)
  const response = await request(app)
    .post(`/course/${courseId}/alumnos`)
    .set('Authorization', `Bearer ${profesorToken}`)
    .send({ alumnoId });

  expect(response.status).toBe(409);
  expect(response.body.error.message).toBe("El alumno ya está inscrito en este curso");
});

  test('POST /course/:courseId/alumnos - No permite agregar alumno si el cupo estÃ¡ lleno', async () => {
  // Creamos un curso con cupoMaximo: 1 que ya tiene a 'alumnoId' inscripto
  const fullCourse = await Course.create({
    name: 'Historia Antigua',
    division: 'B',
    profesor: profesorId,
    alumnos: [alumnoId],
    cupoMaximo: 1
  });

  // Creamos otro alumno nuevo que va a intentar colarse
  const extraAlumno = await User.create({
    name: 'Extra Alumno',
    email: 'extra@test.com',
    password: 'password123',
    role: 'ALUMNO'
  });

  // Intentamos inscribir al extra en el curso que ya no tiene vacantes
  const response = await request(app)
    .post(`/course/${fullCourse._id}/alumnos`)
    .set('Authorization', `Bearer ${profesorToken}`)
    .send({ alumnoId: extraAlumno._id });

  expect(response.status).toBe(409);
  expect(response.body.error.message).toBe("El curso no tiene vacantes disponibles");
});

    test('POST /course/:courseId/alumnos - No permite inscripciÃ³n si el alumno no aprobÃ³ el prerequisito', async () => {
      // Curso prerequisito SIN nota aprobatoria del alumno
      const cursoBase = await Course.create({
        name: 'MatemÃ¡ticas I',
        division: 'A',
        profesor: profesorId,
      });

      // Curso avanzado que requiere haber aprobado cursoBase
      const cursoAvanzado = await Course.create({
        name: 'MatemÃ¡ticas II',
        division: 'A',
        profesor: profesorId,
        prerequisito: cursoBase._id
      });

      // Alumno nuevo sin ninguna nota en cursoBase
      const alumnoSinPrereq = await User.create({
        name: 'Alumno Sin Prereq',
        email: 'sinprereq@test.com',
        password: 'password123',
        role: 'ALUMNO'
      });

      const response = await request(app)
        .post(`/course/${cursoAvanzado._id}/alumnos`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({ alumnoId: alumnoSinPrereq._id });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('El alumno no aprobó el curso prerequisito requerido');
    });

    test('POST /course/:courseId/alumnos - Permite inscripciÃ³n si el alumno aprobÃ³ el prerequisito', async () => {
      // Curso prerequisito
      const cursoBase = await Course.create({
        name: 'Historia I',
        division: 'B',
        profesor: profesorId,
      });

      // Alumno nuevo con nota aprobatoria en cursoBase
      const alumnoAprobado = await User.create({
        name: 'Alumno Aprobado',
        email: 'aprobado@test.com',
        password: 'password123',
        role: 'ALUMNO'
      });

      await Grade.create({
        alumno: alumnoAprobado._id,
        curso: cursoBase._id,
        titulo: 'Final Historia I',
        nota: 7  // >= 6, aprobado âœ…
      });

      // Curso avanzado que requiere cursoBase
      const cursoAvanzado = await Course.create({
        name: 'Historia II',
        division: 'B',
        profesor: profesorId,
        prerequisito: cursoBase._id
      });

      const response = await request(app)
        .post(`/course/${cursoAvanzado._id}/alumnos`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({ alumnoId: alumnoAprobado._id });

      expect(response.status).toBe(200);
    });

  });

  describe('GRADE Endpoints', () => {
    beforeEach(async () => {
      const grade = await Grade.create({
        alumno: alumnoId,
        curso: courseId,
        titulo: 'Parcial 1',
        nota: 8
      });
      gradeId = grade._id.toString();
    });

    test('GET /grade - Director puede ver todas las notas', async () => {
      const response = await request(app)
        .get('/grade')
        .set('Authorization', `Bearer ${directorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });

    test('GET /grade - Profesor puede ver todas las notas', async () => {
      const response = await request(app)
        .get('/grade')
        .set('Authorization', `Bearer ${profesorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });

    test('GET /grade - Alumno no puede ver lista de notas', async () => {
      const response = await request(app)
        .get('/grade')
        .set('Authorization', `Bearer ${alumnoToken}`);

      expect(response.status).toBe(403);
    });

    test('GET /grade/alumno/:alumnoId - Alumno puede ver sus notas', async () => {
      const response = await request(app)
        .get(`/grade/alumno/${alumnoId}`)
        .set('Authorization', `Bearer ${alumnoToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    test('GET /grade/alumno/:alumnoId - Alumno no puede ver notas de otro', async () => {
      const otroAlumno = await User.create({
        name: 'Otro Alumno',
        email: 'otro2@test.com',
        password: 'password123',
        role: 'ALUMNO'
      });

      const response = await request(app)
        .get(`/grade/alumno/${otroAlumno._id}`)
        .set('Authorization', `Bearer ${alumnoToken}`);

      expect(response.status).toBe(403);
    });

    test('POST /grade - Profesor puede crear nota', async () => {
      const newGrade = {
        alumno: alumnoId,
        curso: courseId,
        titulo: 'Parcial 2',
        nota: 9
      };

      const response = await request(app)
        .post('/grade')
        .set('Authorization', `Bearer ${profesorToken}`)
        .send(newGrade);

      expect(response.status).toBe(201);
      expect(response.body.titulo).toBe('Parcial 2');
      expect(response.body.nota).toBe(9);
    });

    test('POST /grade - Director no puede crear nota', async () => {
      const newGrade = {
        alumno: alumnoId,
        curso: courseId,
        titulo: 'Parcial 2',
        nota: 9
      };

      const response = await request(app)
        .post('/grade')
        .set('Authorization', `Bearer ${directorToken}`)
        .send(newGrade);

      expect(response.status).toBe(403);
    });

    test('POST /grade - No permite calificar a un alumno no inscripto en el curso', async () => {
      // Alumno que NO estÃ¡ inscripto en el curso
      const alumnoNoInscripto = await User.create({
        name: 'Alumno Externo',
        email: 'externo@test.com',
        password: 'password123',
        role: 'ALUMNO'
      });

      const newGrade = {
        alumno: alumnoNoInscripto._id,
        curso: courseId,
        titulo: 'Parcial Trampa',
        nota: 7
      };

      const response = await request(app)
        .post('/grade')
        .set('Authorization', `Bearer ${profesorToken}`)
        .send(newGrade);

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('El alumno no pertenece a este curso');
    });

    test('PUT /grade/:id - Profesor puede actualizar nota', async () => {
      const updateData = { nota: 10 };

      const response = await request(app)
        .put(`/grade/${gradeId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.nota).toBe(10);
    });

    test('DELETE /grade/:id - Profesor puede eliminar nota', async () => {
      const response = await request(app)
        .delete(`/grade/${gradeId}`)
        .set('Authorization', `Bearer ${profesorToken}`);

      expect(response.status).toBe(200);
    });

    test('POST /grade - ValidaciÃ³n de rango de nota (1-10)', async () => {
      const newGrade = {
        alumno: alumnoId,
        curso: courseId,
        titulo: 'Paracial 3',
        nota: 11 // Nota invÃ¡lida
      };

      const response = await request(app)
        .post('/grade')
        .set('Authorization', `Bearer ${profesorToken}`)
        .send(newGrade);

      expect(response.status).toBe(400);
    });

    test('POST /grade - ValidaciÃ³n de campos requeridos', async () => {
      const newGrade = {
        alumno: alumnoId,
        // falta curso
        titulo: 'Parcial 4',
        nota: 7
      };

      const response = await request(app)
        .post('/grade')
        .set('Authorization', `Bearer ${profesorToken}`)
        .send(newGrade);

      expect(response.status).toBe(400);
    });

    test('GET /grade/alumno/:alumnoId/boletin - Alumno puede ver su propio boletÃ­n', async () => {
      const response = await request(app)
        .get(`/grade/alumno/${alumnoId}/boletin`)
        .set('Authorization', `Bearer ${alumnoToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('boletin');
      expect(response.body).toHaveProperty('promedioGeneral');
      expect(response.body.boletin).toHaveLength(1);
      expect(response.body.boletin[0]).toHaveProperty('estado', 'APROBADO'); // nota 8 >= 6
      expect(response.body.boletin[0]).toHaveProperty('promedio', 8);
    });

    test('GET /grade/alumno/:alumnoId/boletin - Alumno no puede ver el boletÃ­n de otro', async () => {
      const otroAlumno = await User.create({
        name: 'Otro Alumno Boletin',
        email: 'otro.boletin@test.com',
        password: 'password123',
        role: 'ALUMNO'
      });

      const response = await request(app)
        .get(`/grade/alumno/${otroAlumno._id}/boletin`)
        .set('Authorization', `Bearer ${alumnoToken}`);

      expect(response.status).toBe(403);
    });

    test('GET /grade/alumno/:alumnoId/boletin - Director puede ver el boletÃ­n de cualquier alumno', async () => {
      const response = await request(app)
        .get(`/grade/alumno/${alumnoId}/boletin`)
        .set('Authorization', `Bearer ${directorToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('boletin');
      expect(response.body).toHaveProperty('promedioGeneral');
    });

  });

  describe('COURSE Concurrency', () => {
    test('POST /course/:courseId/alumnos - Concurrencia: 10 alumnos intentan el ÃƒÂºltimo cupo (Promise.all)', async () => {
      // Curso con cupo 1 y sin alumnos inscriptos
      const limitedCourse = await Course.create({
        name: 'Curso Cupo 1',
        division: 'Z',
        profesor: profesorId,
        alumnos: [],
        cupoMaximo: 1
      });

      // Creamos 10 alumnos distintos (distintos IDs, para que $addToSet no los "colapse")
      const alumnos = await Promise.all(
        Array.from({ length: 10 }).map((_, i) =>
          User.create({
            name: `Alumno Concur ${i}`,
            email: `alumno.concur.${i}@test.com`,
            password: 'password123',
            role: 'ALUMNO'
          })
        )
      );

      // Disparamos 10 requests en paralelo intentando "ganarse" el ÃƒÂºnico cupo
      const responses = await Promise.all(
        alumnos.map((a) =>
          request(app)
            .post(`/course/${limitedCourse._id}/alumnos`)
            .set('Authorization', `Bearer ${profesorToken}`)
            .send({ alumnoId: a._id })
        )
      );

      const ok = responses.filter((r) => r.status === 200);
      const fail = responses.filter((r) => r.status !== 200);

      // Con el fix atÃƒÂ³mico: exactamente 1 ÃƒÂ©xito.
      // Con el cÃƒÂ³digo anterior: esto puede fallar (2+ ÃƒÂ©xitos) por race condition.
      expect(ok).toHaveLength(1);

      // Los demÃƒÂ¡s deben fallar por cupo (contrato esperado)
      fail.forEach((r) => {
        expect(r.status).toBe(409);
        expect(r.body.error.message).toBe("El curso no tiene vacantes disponibles");
      });

      // Invariante final: en DB no puede haber mÃƒÂ¡s de 1 inscripto
      const courseAfter = await Course.findById(limitedCourse._id);
      expect(courseAfter.alumnos).toHaveLength(1);
    }, 30000);
  });

  describe('Middleware Tests', () => {
    test('Acceso sin token - deberÃ­a retornar 401', async () => {
      const response = await request(app)
        .get('/user');

      expect(response.status).toBe(401);
    });

    test('Token invÃ¡lido - deberÃ­a retornar 401', async () => {
      const response = await request(app)
        .get('/user')
        .set('Authorization', 'Bearer invalidtoken');

      expect(response.status).toBe(401);
    });

    test('Acceso con rol incorrecto - deberÃ­a retornar 403', async () => {
      const response = await request(app)
        .post('/user')
        .set('Authorization', `Bearer ${alumnoToken}`)
        .send({
          name: 'Test',
          email: 'test@test.com',
          password: 'password123',
          role: 'ALUMNO'
        });

      expect(response.status).toBe(403);
    });
  });
});

