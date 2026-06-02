import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { CoursesPage } from './pages/CoursesPage';
import { UsersPage } from './pages/UsersPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function App() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6 items-baseline">
            <h1 className="text-2xl font-bold tracking-tight">LMS Manager</h1>
            <nav className="flex gap-4 text-blue-100 font-medium">
              <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
              <Link to="/courses" className="hover:text-white transition-colors">Cursos</Link>
              <Link to="/users" className="hover:text-white transition-colors">Usuarios</Link>
            </nav>
          </div>
          <div>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-sm bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded cursor-pointer transition-colors">Cerrar Sesión</button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="text-sm text-blue-100 hover:text-white px-2 py-1 transition-colors font-medium">Iniciar Sesión</Link>
                <Link to="/register" className="text-sm bg-white text-blue-600 hover:bg-gray-100 px-3 py-1 rounded transition-colors font-semibold">Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <Routes>
          <Route path="/" element={<div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-800">Bienvenido al Dashboard</h2><p className="text-gray-500 mt-2">Selecciona una opción en el menú</p></div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/grades" element={<h2 className="text-xl font-semibold">Notas (WIP)</h2>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
