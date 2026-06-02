import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      
      // Ajustá esto dependiendo de cómo devuelva el backend el token. Asumimos { token: '...' }
      const token = response.token || response.data?.token; 
      
      if (token) {
        localStorage.setItem('token', token);
        navigate('/courses');
      } else {
        setError('Respuesta inválida del servidor (No se encontró el token).');
      }
    } catch (err) {
      console.error('Login error:', err);
      const backendMsg = err.response?.data?.message || err.response?.data?.error;
      setError(backendMsg || 'Credenciales inválidas o error de red.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">{error}</div>}
      
      <Input 
        id="email" 
        type="email" 
        label="Correo Electrónico" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="admin@escuela.com" 
        required 
      />
      
      <Input 
        id="password" 
        type="password" 
        label="Contraseña" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="••••••••" 
        required 
      />
      
      <Button type="submit" className="w-full mt-2" variant="primary">
        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
};
