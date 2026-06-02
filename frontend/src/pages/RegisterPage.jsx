import { RegisterForm } from '../components/organisms/RegisterForm';

export const RegisterPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Crea tu Cuenta</h2>
          <p className="mt-2 text-sm text-gray-500">Regístrate para obtener acceso al sistema LMS</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};
