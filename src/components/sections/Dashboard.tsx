import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { personas, asistenciasHoy, areasTrabajo, datosEmpresa } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

export function Dashboard() {
  const { currentPersona, isAdmin } = useAuth();
  const empleadosActivos = personas.filter(p => p.activo).length;
  const asistenciasDelDia = asistenciasHoy.length;
  const empleadosPresentes = asistenciasHoy.filter(a => !a.hora_salida).length;
  const tardanzas = asistenciasHoy.filter(a => a.miniTardanza > 0).length;

  const getPersonaById = (id: number) => personas.find(p => p.id_persona === id);
  const getAreaById = (id: number) => areasTrabajo.find(a => a.id_area === id);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Bienvenido{currentPersona && `, ${currentPersona.nombres}`}
        </h1>
        <p className="text-gray-600">
          {isAdmin() ? 'Panel de Administración - ' : ''}
          {new Date().toLocaleDateString('es-ES', { 
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
            <div className="text-2xl font-bold">{empleadosActivos}</div>
            <p className="text-xs text-muted-foreground">Total en la empresa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presentes Hoy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{empleadosPresentes}</div>
            <p className="text-xs text-muted-foreground">Empleados en la oficina</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asistencias Hoy</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{asistenciasDelDia}</div>
            <p className="text-xs text-muted-foreground">Registros del día</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tardanzas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{tardanzas}</div>
            <p className="text-xs text-muted-foreground">Empleados con tardanza</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Asistencias de Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {asistenciasHoy.map((asistencia) => {
                const persona = getPersonaById(asistencia.id_persona);
                const area = getAreaById(persona?.id_area_trabajo || 0);
                
                return (
                  <div key={asistencia.id_asistencia} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={persona?.imagen} 
                        alt={persona?.nombres}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{persona?.nombres} {persona?.apellidos}</p>
                        <p className="text-sm text-gray-500">{area?.nombre_area}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{asistencia.hora_entrada}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant={asistencia.miniTardanza > 0 ? "destructive" : "secondary"}>
                          {asistencia.metodo_registro === 'reconocimientoFacial' ? 'Facial' : 'Manual'}
                        </Badge>
                        {asistencia.miniTardanza > 0 && (
                          <Badge variant="outline" className="text-orange-600">
                            +{asistencia.miniTardanza}min
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{datosEmpresa.nombre_empresa}</h3>
                <p className="text-gray-600">RUC: {datosEmpresa.ruc}</p>
                <p className="text-gray-600">{datosEmpresa.direccion}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Áreas de Trabajo</h4>
                <div className="space-y-2">
                  {areasTrabajo.map((area) => {
                    const empleadosEnArea = personas.filter(p => p.id_area_trabajo === area.id_area && p.activo).length;
                    return (
                      <div key={area.id_area} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{area.nombre_area}</p>
                          <p className="text-sm text-gray-500">{area.descripcion}</p>
                        </div>
                        <Badge variant="secondary">{empleadosEnArea} empleados</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}