import { useEffect, useState } from 'react';
import { coursesApi } from '../../api/courses';
import { CourseCard } from '../molecules/CourseCard';

export const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Supongo que el backend devuelve { data: [...] } o [...] directo
        const response = await coursesApi.getAll(); 
        const coursesData = response.data || response;
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('No se pudieron cargar los cursos. Verifica que el backend esté corriendo.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">{error}</div>;
  }

  if (courses.length === 0) {
    return <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">No hay cursos disponibles aún.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard 
          key={course._id || course.id} 
          title={course.title} 
          description={course.description} 
          capacity={course.capacity} 
        />
      ))}
    </div>
  );
};
