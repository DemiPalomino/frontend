import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { 
  Clock, 
  Plus, 
  Edit,
  Settings,
  Users,
  Calendar
} from 'lucide-react';
import { horarios, areasTrabajo, personas } from '../../data/mockData';

export function Horarios() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const getAreaName = (areaId: number) => {
    const area = areasTrabajo.find(a => a.id_area === areaId);
    return area ? area.nombre_area : 'Sin área';
  };

  const getEmployeesInArea = (areaId: number) => {
    return personas.filter(p => p.id_area_trabajo === areaId && p.activo).length;
  };

  const handleCreateSchedule = () => {
    alert('Horario creado exitosamente');
    setShowCreateDialog(false);
  };

  const handleEditSchedule = (schedule: any) => {
    setSelectedSchedule(schedule);
    setShowEditDialog(true);
  };

  const handleUpdateSchedule = () => {
    alert('Horario actualizado exitosamente');
    setShowEditDialog(false);
    setSelectedSchedule(null);
  };

  const toggleScheduleStatus = (scheduleId: number) => {
    alert(`Estado del horario ${scheduleId} cambiado`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gestión de Horarios</h1>
          <p className="text-gray-600">Configura los horarios de trabajo para cada área de la empresa</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Horario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Horario</DialogTitle>
              <DialogDescription>
                Configura un nuevo horario de trabajo para asignar a un área específica.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="schedule-name">Nombre del Horario</Label>
                <Input id="schedule-name" placeholder="Ej: Horario Matutino" />
              </div>

              <div>
                <Label htmlFor="area">Área de Trabajo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un área" />
                  </SelectTrigger>
                  <SelectContent>
                    {areasTrabajo.map((area) => (
                      <SelectItem key={area.id_area} value={area.id_area.toString()}>
                        {area.nombre_area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-time">Hora de Inicio</Label>
                  <Input id="start-time" type="time" defaultValue="08:00" />
                </div>
                <div>
                  <Label htmlFor="end-time">Hora de Fin</Label>
                  <Input id="end-time" type="time" defaultValue="17:00" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="active" defaultChecked />
                <Label htmlFor="active">Horario activo</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateSchedule}>
                  Crear Horario
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Horarios Activos</p>
                <p className="text-2xl font-semibold text-green-600">
                  {horarios.filter(h => h.estado === 1).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Horarios</p>
                <p className="text-2xl font-semibold text-blue-600">{horarios.length}</p>
              </div>
              <Settings className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Áreas Cubiertas</p>
                <p className="text-2xl font-semibold text-purple-600">{areasTrabajo.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {horarios.map((horario) => (
          <Card key={horario.id_horario}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg">{horario.nombre_horario}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={horario.estado === 1 ? "secondary" : "outline"}>
                  {horario.estado === 1 ? 'Activo' : 'Inactivo'}
                </Badge>
                <Button size="sm" variant="outline" onClick={() => handleEditSchedule(horario)}>
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Horario:</span>
                  </div>
                  <span className="font-medium">{horario.fecha_inicio} - {horario.fecha_fin}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Área:</span>
                  </div>
                  <span className="font-medium">{getAreaName(horario.id_area_trabajo)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Empleados:</span>
                  </div>
                  <Badge variant="outline">
                    {getEmployeesInArea(horario.id_area_trabajo)} empleados
                  </Badge>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estado del horario:</span>
                    <Switch 
                      checked={horario.estado === 1}
                      onCheckedChange={() => toggleScheduleStatus(horario.id_horario)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Area Schedules Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen por Área</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3">Área</th>
                  <th className="text-left py-3">Empleados</th>
                  <th className="text-left py-3">Horario Asignado</th>
                  <th className="text-left py-3">Horario de Trabajo</th>
                  <th className="text-left py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {areasTrabajo.map((area) => {
                  const areaSchedule = horarios.find(h => h.id_area_trabajo === area.id_area);
                  const employeeCount = getEmployeesInArea(area.id_area);
                  
                  return (
                    <tr key={area.id_area} className="border-b border-gray-100">
                      <td className="py-4">
                        <div>
                          <p className="font-medium">{area.nombre_area}</p>
                          <p className="text-sm text-gray-500">{area.descripcion}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge variant="outline">{employeeCount} empleados</Badge>
                      </td>
                      <td className="py-4">
                        {areaSchedule ? (
                          <span className="font-medium">{areaSchedule.nombre_horario}</span>
                        ) : (
                          <span className="text-gray-500">Sin horario asignado</span>
                        )}
                      </td>
                      <td className="py-4">
                        {areaSchedule ? (
                          <span className="text-sm">
                            {areaSchedule.fecha_inicio} - {areaSchedule.fecha_fin}
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-4">
                        {areaSchedule ? (
                          <Badge variant={areaSchedule.estado === 1 ? "secondary" : "outline"}>
                            {areaSchedule.estado === 1 ? 'Activo' : 'Inactivo'}
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Sin configurar</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Schedule Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Horario</DialogTitle>
            <DialogDescription>
              Modifica los detalles del horario seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedSchedule && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-schedule-name">Nombre del Horario</Label>
                <Input 
                  id="edit-schedule-name" 
                  defaultValue={selectedSchedule.nombre_horario}
                />
              </div>

              <div>
                <Label htmlFor="edit-area">Área de Trabajo</Label>
                <Select defaultValue={selectedSchedule.id_area_trabajo.toString()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {areasTrabajo.map((area) => (
                      <SelectItem key={area.id_area} value={area.id_area.toString()}>
                        {area.nombre_area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-start-time">Hora de Inicio</Label>
                  <Input 
                    id="edit-start-time" 
                    type="time" 
                    defaultValue={selectedSchedule.fecha_inicio}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-end-time">Hora de Fin</Label>
                  <Input 
                    id="edit-end-time" 
                    type="time" 
                    defaultValue={selectedSchedule.fecha_fin}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-active" 
                  defaultChecked={selectedSchedule.estado === 1}
                />
                <Label htmlFor="edit-active">Horario activo</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateSchedule}>
                  Actualizar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}