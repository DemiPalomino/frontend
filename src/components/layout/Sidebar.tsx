import React from 'react';
import { 
  Home, 
  Users, 
  Clock, 
  Calendar, 
  FileText, 
  Settings,
  Camera,
  BarChart3,
  Building2,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { isAdmin, logout, currentPersona, userType } = useAuth();
  
  // Menú completo para administradores
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'asistencia', label: 'Registro Asistencia', icon: Camera },
    { id: 'empleados', label: 'Empleados', icon: Users },
    { id: 'sucursales', label: 'Sucursales y Áreas', icon: Building2 },
    { id: 'reportes', label: 'Reportes', icon: BarChart3 },
    { id: 'permisos', label: 'Permisos', icon: FileText },
    { id: 'horarios', label: 'Horarios', icon: Clock },
    { id: 'configuracion', label: 'Configuración', icon: Settings }
  ];
  
  // Menú limitado para empleados
  const empleadoMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'asistencia', label: 'Registro Asistencia', icon: Camera }
  ];
  
  const menuItems = isAdmin() ? adminMenuItems : empleadoMenuItems;

  const getInitials = (nombres: string, apellidos: string) => {
    return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">
          Control de Asistencia
        </h1>
      </div>

      {/* Perfil del usuario */}
      {currentPersona && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={currentPersona.imagen} alt={currentPersona.nombres} />
              <AvatarFallback>
                {getInitials(currentPersona.nombres, currentPersona.apellidos)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentPersona.nombres} {currentPersona.apellidos}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {userType?.nombre_tipo}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
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
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}