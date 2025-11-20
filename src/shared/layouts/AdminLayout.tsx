import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Separator } from '../../components/ui/separator';
import { 
  LogOut, 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Building, 
  BarChart3, 
  Clock, 
  Settings 
} from "lucide-react";
import { useAuth } from "../../modules/auth/hooks/useAuth";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error durante logout:', error);
    }
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: [1, 2] },
    { path: "/registro", label: "Registro Asistencia", icon: ClipboardList, roles: [1, 2] },
    { path: "/empleados", label: "Empleados", icon: Users, roles: [1] },
    { path: "/sucursales", label: "Sucursales y Áreas", icon: Building, roles: [1] },
    { path: "/reportes", label: "Reportes", icon: BarChart3, roles: [1] },
    { path: "/permisos", label: "Permisos", icon: Clock, roles: [1, 2] },
    { path: "/horarios", label: "Horarios", icon: Clock, roles: [1] },
    { path: "/configuracion", label: "Configuración", icon: Settings, roles: [1] },
  ];

    // Filtrar menú según el rol del usuario
  const userRole = user?.id_tipo_usuario || user?.role;
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole || 2)
  );

  // Función para obtener el nombre del rol
  const getRoleName = () => {
    const role = user?.id_tipo_usuario || user?.role;
    
    if (role === 1) return 'Administrador';
    if (role === 2) return 'Empleado';
    
    return 'Usuario';
  };

    return (
    <div className="flex h-screen">
      {/* Panel lateral */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Cabecera */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">
            Control de Asistencia
          </h1>
        </div>

        {/* Perfil del usuario */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {user?.nombres?.charAt(0)}{user?.apellidos?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.nombres} {user?.apellidos}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {getRoleName()}
              </p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`flex items-center gap-3 py-3 px-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-blue-50 text-blue-600 border border-blue-200" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className={`w-5 h-5 flex items-center justify-center ${
                      isActive ? "text-blue-600" : "text-gray-400"
                    }`}>
                      {isActive ? (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Separator />

        {/* Botón de cerrar sesión */}
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full justify-start text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
            onClick={handleLogout}
          >
            <div className="w-5 h-5 flex items-center justify-center mr-3">
              <LogOut className="w-4 h-4" />
            </div>
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Área de contenido principal */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
}