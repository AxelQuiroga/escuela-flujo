import { LoginForm } from '../components/organisms/LoginForm';

export const LoginPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Acceso Restringido</h2>
          <p className="mt-2 text-sm text-gray-500">Ingresa tus credenciales para administrar el sistema</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};
