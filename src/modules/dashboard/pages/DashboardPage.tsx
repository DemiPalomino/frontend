import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { useDashboard } from '../controllers/useDashboard';
import { Users, Clock, CheckCircle, AlertTriangle, Building2, Calendar, UserCheck } from 'lucide-react';
import { useAuth } from "../../../modules/auth/hooks/useAuth";
import { useConfiguracion } from "../../configuracion/controllers/useConfiguracion";

export const DashboardPage: React.FC = () => {
  const { estadisticas, estadisticasEmpleado, loading, error, isAdmin } = useDashboard();
  const { user } = useAuth();
  const { empresa } = useConfiguracion();

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Cabecera */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Bienvenido, {user?.nombres} {user?.apellidos}
        </h1>
        <p className="text-gray-600">
          {isAdmin ? 'Panel de Administración' : 'Mi Panel Personal'} - {new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Stats Cards */}
      {isAdmin ? (
        // Dashboard Administrador
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empleados Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas?.totalEmpleados || 0}</div>
              <p className="text-xs text-muted-foreground">Total en la empresa</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Presentes Hoy</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{estadisticas?.asistenciasHoy || 0}</div>
              <p className="text-xs text-muted-foreground">Empleados en la oficina</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asistencias Hoy</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{estadisticas?.asistenciasHoy || 0}</div>
              <p className="text-xs text-muted-foreground">Registros del día</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tardanzas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{estadisticas?.tardanzasHoy || 0}</div>
              <p className="text-xs text-muted-foreground">Empleados con tardanza</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Dashboard Empleado
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asistencia Hoy</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {estadisticasEmpleado?.asistenciaHoy ? 'Registrada' : 'Pendiente'}
              </div>
              <p className="text-xs text-muted-foreground">
                {estadisticasEmpleado?.asistenciaHoy ? 
                  `Hora: ${new Date(estadisticasEmpleado.asistenciaHoy.fecha_ingreso).toLocaleTimeString()}` : 
                  'Aún no registras asistencia'
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asistencias del Mes</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{estadisticasEmpleado?.asistenciasMes || 0}</div>
              <p className="text-xs text-muted-foreground">Días trabajados este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tardanzas del Mes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{estadisticasEmpleado?.tardanzasMes || 0}</div>
              <p className="text-xs text-muted-foreground">Tardanzas este mes</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Información de la Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Información de la Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{empresa?.nombre_empresa}</h3>
              <p className="text-gray-600">RUC: {empresa?.ruc}</p>
              <p className="text-gray-600">{empresa?.direccion}</p>
            </div>
            
            {isAdmin && (
              <div>
                <h4 className="font-medium mb-2">Áreas de Trabajo</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">Desarrollo</p>
                      <p className="text-sm text-gray-500">Área de desarrollo de software</p>
                    </div>
                    <Badge variant="secondary">2 empleados</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">Marketing</p>
                      <p className="text-sm text-gray-500">Área de marketing y ventas</p>
                    </div>
                    <Badge variant="secondary">1 empleados</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">Recursos Humanos</p>
                      <p className="text-sm text-gray-500">Gestión de personal y recursos humanos</p>
                    </div>
                    <Badge variant="secondary">1 empleados</Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Información adicional para empleados */}
      {!isAdmin && estadisticasEmpleado?.asistenciaHoy && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Detalle de Asistencia Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Hora de Ingreso</p>
                <p className="text-lg">
                  {new Date(estadisticasEmpleado.asistenciaHoy.fecha_ingreso).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Método de Registro</p>
                <p className="text-lg capitalize">{estadisticasEmpleado.asistenciaHoy.metodo_registro}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Tardanza</p>
                <p className="text-lg">
                  {estadisticasEmpleado.asistenciaHoy.miniTardanza > 0 ? 
                    `${estadisticasEmpleado.asistenciaHoy.miniTardanza} min` : 
                    'Sin tardanza'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};