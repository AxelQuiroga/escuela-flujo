import { UserTable } from '../components/organisms/UserTable';
import { Button } from '../components/atoms/Button';

export const UsersPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-500 mt-1 text-sm">Administra alumnos, profesores y administradores.</p>
        </div>
        <Button variant="primary">+ Nuevo Usuario</Button>
      </div>
      
      <section>
        <UserTable />
      </section>
    </div>
  );
};
