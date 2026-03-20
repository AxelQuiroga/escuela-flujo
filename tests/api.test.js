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
    // Conexión a MongoDB de prueba
    mongoConnection = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test_school_management');
  }, 30000);

  afterAll(async () => {
    // Cerrar conexión
    if (mongoConnection) {
      await mongoose.connection.close();
    }
  }, 30000);

  beforeEach(async () => {
    // Limpiar base de datos
    await User.deleteMany({});
    await Course.deleteMany({});
    await Grade.deleteMany({});

    // Hashear contraseñas
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
      name: 'Matemáticas',
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

    test('POST /auth/login - Credenciales inválidas', async () => {
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
      expect(response.body).toHaveLength(3);
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

      expect(response.status).toBe(200);
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
      expect(response.body).toHaveLength(1);
    });

    test('GET /course - Profesor puede ver cursos', async () => {
      const response = await request(app)
        .get('/course')
        .set('Authorization', `Bearer ${profesorToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
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
      const updateData = { name: 'Matemáticas Avanzadas' };

      const response = await request(app)
        .put(`/course/${courseId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Matemáticas Avanzadas');
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
      expect(response.body).toHaveLength(1);
    });

    test('GET /grade - Profesor puede ver todas las notas', async () => {
      const response = await request(app)
        .get('/grade')
        .set('Authorization', `Bearer ${profesorToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
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

    test('POST /grade - Validación de rango de nota (1-10)', async () => {
      const newGrade = {
        alumno: alumnoId,
        curso: courseId,
        titulo: 'Paracial 3',
        nota: 11 // Nota inválida
      };

      const response = await request(app)
        .post('/grade')
        .set('Authorization', `Bearer ${profesorToken}`)
        .send(newGrade);

      expect(response.status).toBe(400);
    });

    test('POST /grade - Validación de campos requeridos', async () => {
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
  });

  describe('Middleware Tests', () => {
    test('Acceso sin token - debería retornar 401', async () => {
      const response = await request(app)
        .get('/user');

      expect(response.status).toBe(401);
    });

    test('Token inválido - debería retornar 401', async () => {
      const response = await request(app)
        .get('/user')
        .set('Authorization', 'Bearer invalidtoken');

      expect(response.status).toBe(401);
    });

    test('Acceso con rol incorrecto - debería retornar 403', async () => {
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
