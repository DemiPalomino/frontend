import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { 
  BarChart3, 
  Download, 
  Filter,
  CalendarIcon,
  Clock,
  TrendingUp,
  Users
} from 'lucide-react';
import { personas, asistenciasHoy, areasTrabajo } from '../../data/mockData';

export function Reportes() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

  // Mock data para reportes
  const reportData = [
    { fecha: '2024-09-02', asistencias: 8, tardanzas: 1, faltas: 0 },
    { fecha: '2024-09-03', asistencias: 7, tardanzas: 2, faltas: 1 },
    { fecha: '2024-09-04', asistencias: 8, tardanzas: 0, faltas: 0 },
    { fecha: '2024-09-05', asistencias: 6, tardanzas: 3, faltas: 2 },
    { fecha: '2024-09-06', asistencias: 8, tardanzas: 1, faltas: 0 },
    { fecha: '2024-09-07', asistencias: 7, tardanzas: 1, faltas: 1 },
    { fecha: '2024-09-08', asistencias: 3, tardanzas: 1, faltas: 0 }
  ];

  const getPersonaById = (id: number) => personas.find(p => p.id_persona === id);
  const getAreaById = (id: number) => areasTrabajo.find(a => a.id_area === id);

  const totalAsistencias = reportData.reduce((sum, day) => sum + day.asistencias, 0);
  const totalTardanzas = reportData.reduce((sum, day) => sum + day.tardanzas, 0);
  const totalFaltas = reportData.reduce((sum, day) => sum + day.faltas, 0);
  const promedioAsistencia = (totalAsistencias / (totalAsistencias + totalFaltas) * 100).toFixed(1);

  const exportReport = () => {
    // Simular exportación a CSV
    alert('Reporte exportado exitosamente a CSV');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reportes de Asistencia</h1>
          <p className="text-gray-600">Analiza los patrones de asistencia y genera reportes detallados</p>
        </div>
        <Button onClick={exportReport}>
          <Download className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Fecha</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate?.toLocaleDateString('es-ES') || 'Seleccionar fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Área</label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las áreas</SelectItem>
                  {areasTrabajo.map((area) => (
                    <SelectItem key={area.id_area} value={area.id_area.toString()}>
                      {area.nombre_area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Empleado</label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los empleados</SelectItem>
                  {personas.map((persona) => (
                    <SelectItem key={persona.id_persona} value={persona.id_persona.toString()}>
                      {persona.nombres} {persona.apellidos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                Generar Reporte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Asistencias</p>
                <p className="text-2xl font-semibold text-blue-600">{totalAsistencias}</p>
                <p className="text-xs text-gray-500">Última semana</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tardanzas</p>
                <p className="text-2xl font-semibold text-orange-600">{totalTardanzas}</p>
                <p className="text-xs text-gray-500">Última semana</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Faltas</p>
                <p className="text-2xl font-semibold text-red-600">{totalFaltas}</p>
                <p className="text-xs text-gray-500">Última semana</p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">% Asistencia</p>
                <p className="text-2xl font-semibold text-green-600">{promedioAsistencia}%</p>
                <p className="text-xs text-gray-500">Promedio semanal</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Report */}
        <Card>
          <CardHeader>
            <CardTitle>Reporte Diario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Fecha</th>
                    <th className="text-left py-2">Asistencias</th>
                    <th className="text-left py-2">Tardanzas</th>
                    <th className="text-left py-2">Faltas</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((day, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3">
                        {new Date(day.fecha).toLocaleDateString('es-ES', { 
                          weekday: 'short', 
                          day: '2-digit', 
                          month: 'short' 
                        })}
                      </td>
                      <td className="py-3">
                        <Badge variant="secondary">{day.asistencias}</Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={day.tardanzas > 0 ? "destructive" : "secondary"}>
                          {day.tardanzas}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={day.faltas > 0 ? "destructive" : "secondary"}>
                          {day.faltas}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Employee Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Empleado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {personas.slice(0, 4).map((empleado) => {
                const area = getAreaById(empleado.id_area_trabajo);
                // Simular métricas de rendimiento
                const asistencia = Math.floor(Math.random() * 10) + 85; // 85-95%
                const tardanzas = Math.floor(Math.random() * 5); // 0-4 tardanzas
                
                return (
                  <div key={empleado.id_persona} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={empleado.imagen} 
                        alt={empleado.nombres}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{empleado.nombres} {empleado.apellidos}</p>
                        <p className="text-sm text-gray-500">{area?.nombre_area}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{asistencia}%</Badge>
                        {tardanzas > 0 && (
                          <Badge variant="outline" className="text-orange-600">
                            {tardanzas} tardanzas
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
      </div>

      {/* Detailed Attendance Log */}
      <Card>
        <CardHeader>
          <CardTitle>Registro Detallado de Hoy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3">Empleado</th>
                  <th className="text-left py-3">Hora Entrada</th>
                  <th className="text-left py-3">Hora Salida</th>
                  <th className="text-left py-3">Método</th>
                  <th className="text-left py-3">Tardanza</th>
                  <th className="text-left py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {asistenciasHoy.map((asistencia) => {
                  const persona = getPersonaById(asistencia.id_persona);
                  const area = getAreaById(persona?.id_area_trabajo || 0);
                  
                  return (
                    <tr key={asistencia.id_asistencia} className="border-b border-gray-100">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={persona?.imagen} 
                            alt={persona?.nombres}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">{persona?.nombres} {persona?.apellidos}</p>
                            <p className="text-sm text-gray-500">{area?.nombre_area}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">{asistencia.hora_entrada}</td>
                      <td className="py-4">{asistencia.hora_salida || 'En oficina'}</td>
                      <td className="py-4">
                        <Badge variant={asistencia.metodo_registro === 'reconocimientoFacial' ? 'default' : 'secondary'}>
                          {asistencia.metodo_registro === 'reconocimientoFacial' ? 'Facial' : 'Manual'}
                        </Badge>
                      </td>
                      <td className="py-4">
                        {asistencia.miniTardanza > 0 ? (
                          <Badge variant="destructive">+{asistencia.miniTardanza} min</Badge>
                        ) : (
                          <Badge variant="secondary">A tiempo</Badge>
                        )}
                      </td>
                      <td className="py-4">
                        <Badge variant={asistencia.hora_salida ? 'outline' : 'secondary'}>
                          {asistencia.hora_salida ? 'Completado' : 'Presente'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}