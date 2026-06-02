import { CourseList } from '../components/organisms/CourseList';
import { Button } from '../components/atoms/Button';

export const CoursesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Gestión de Cursos</h1>
          <p className="text-gray-500 mt-1 text-sm">Administra los cursos disponibles en el sistema LMS.</p>
        </div>
        <Button variant="primary">+ Nuevo Curso</Button>
      </div>
      
      <section>
        <CourseList />
      </section>
    </div>
  );
};
