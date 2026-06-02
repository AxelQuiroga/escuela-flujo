import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    role: 'DIRECTOR' // Lo hardcodeo a DIRECTOR para que puedan probar todo el sistema
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.register(formData);
      
      const token = response.token || response.data?.token; 
      
      if (token) {
        localStorage.setItem('token', token);
        navigate('/courses');
      } else {
        setError('Respuesta inválida del servidor (No se encontró el token).');
      }
    } catch (err) {
      console.error('Register error:', err);
      const backendMsg = err.response?.data?.message || err.response?.data?.error;
      setError(backendMsg || 'Error al registrar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">{error}</div>}
      
      <div className="grid grid-cols-2 gap-4">
        <Input 
          id="name" 
          type="text" 
          label="Nombre" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="Juan" 
          required 
        />
        <Input 
          id="lastName" 
          type="text" 
          label="Apellido" 
          value={formData.lastName} 
          onChange={handleChange} 
          placeholder="Pérez" 
        />
      </div>
      
      <Input 
        id="email" 
        type="email" 
        label="Correo Electrónico" 
        value={formData.email} 
        onChange={handleChange} 
        placeholder="juan@escuela.com" 
        required 
      />
      
      <Input 
        id="password" 
        type="password" 
        label="Contraseña" 
        value={formData.password} 
        onChange={handleChange} 
        placeholder="••••••••" 
        required 
      />
      
      <Button type="submit" className="w-full mt-2" variant="primary">
        {loading ? 'Registrando...' : 'Crear Cuenta'}
      </Button>

      <div className="text-center mt-4 text-sm text-gray-600">
        ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-600 hover:underline font-semibold">Inicia Sesión</Link>
      </div>
    </form>
  );
};
