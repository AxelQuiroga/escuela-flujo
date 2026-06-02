export const CourseCard = ({ title, description, capacity }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2 h-12">{description || 'Sin descripción'}</p>
      <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-3">
        <span className="text-gray-500 font-medium">Capacidad: {capacity || 'N/A'}</span>
        <button className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer">Ver más →</button>
      </div>
    </div>
  );
};
