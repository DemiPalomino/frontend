import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { useDashboard } from '../controllers/useDashboard';
import { Users, Clock, CheckCircle, AlertTriangle, Building2 } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { estadisticas, loading, error } = useDashboard();

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
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Bienvenido, Juan Carlos
        </h1>
        <p className="text-gray-600">
          Panel de Administración - {new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Stats Cards */}
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
              <h3 className="font-semibold text-lg">TechCorp Solutions</h3>
              <p className="text-gray-600">RUC: 20123456789</p>
              <p className="text-gray-600">Av. Principal 123, Lima</p>
            </div>
            
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};