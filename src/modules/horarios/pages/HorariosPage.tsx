import React, { useState } from 'react';
import { useHorario } from '../controllers/useHorario';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Switch } from '../../../components/ui/switch';
import { 
  Clock, 
  Plus, 
  Edit,
  Settings,
  Users,
  Calendar
} from 'lucide-react';

export const HorariosPage: React.FC = () => {
  const { 
    horarios, 
    loading, 
    error,
    crearHorario,
    actualizarHorario,
    toggleEstadoHorario 
  } = useHorario();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [nuevoHorario, setNuevoHorario] = useState({
    nombre_horario: '',
    fecha_inicio: '08:00',
    fecha_fin: '17:00',
    id_area_trabajo: 0,
    estado: 1
  });

  const handleCreateSchedule = async () => {
    try {
      if (!nuevoHorario.nombre_horario || !nuevoHorario.id_area_trabajo) {
        alert('Por favor complete todos los campos obligatorios');
        return;
      }

      await crearHorario(nuevoHorario);
      setShowCreateDialog(false);
      resetHorarioForm();
    } catch (error) {
      alert('Error al crear el horario');
    }
  };

  const handleEditSchedule = (horario: any) => {
    setSelectedSchedule(horario);
    setNuevoHorario({
      nombre_horario: horario.nombre_horario,
      fecha_inicio: horario.fecha_inicio,
      fecha_fin: horario.fecha_fin,
      id_area_trabajo: horario.id_area_trabajo,
      estado: horario.estado
    });
    setShowEditDialog(true);
  };

  const handleUpdateSchedule = async () => {
    try {
      if (!selectedSchedule) return;

      await actualizarHorario(selectedSchedule.id_horario, nuevoHorario);
      setShowEditDialog(false);
      resetHorarioForm();
    } catch (error) {
      alert('Error al actualizar el horario');
    }
  };

  const handleToggleStatus = async (horarioId: number, estadoActual: number) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await toggleEstadoHorario(horarioId, nuevoEstado);
    } catch (error) {
      alert('Error al cambiar el estado del horario');
    }
  };

  const resetHorarioForm = () => {
    setNuevoHorario({
      nombre_horario: '',
      fecha_inicio: '08:00',
      fecha_fin: '17:00',
      id_area_trabajo: 0,
      estado: 1
    });
    setSelectedSchedule(null);
  };

  const getAreaName = (areaId: number) => {
    const areas = {
      1: 'Desarrollo',
      2: 'Marketing', 
      3: 'Recursos Humanos',
      4: 'Administración'
    };
    return areas[areaId as keyof typeof areas] || 'Sin área';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando horarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-2">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

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
            <Button onClick={resetHorarioForm}>
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
                <Input 
                  id="schedule-name" 
                  value={nuevoHorario.nombre_horario}
                  onChange={(e) => setNuevoHorario({...nuevoHorario, nombre_horario: e.target.value})}
                  placeholder="Ej: Horario Matutino" 
                />
              </div>

              <div>
                <Label htmlFor="area">Área de Trabajo</Label>
                <Select 
                  value={nuevoHorario.id_area_trabajo.toString()} 
                  onValueChange={(value: string) => setNuevoHorario({...nuevoHorario, id_area_trabajo: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Desarrollo</SelectItem>
                    <SelectItem value="2">Marketing</SelectItem>
                    <SelectItem value="3">Recursos Humanos</SelectItem>
                    <SelectItem value="4">Administración</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-time">Hora de Inicio</Label>
                  <Input 
                    id="start-time" 
                    type="time" 
                    value={nuevoHorario.fecha_inicio}
                    onChange={(e) => setNuevoHorario({...nuevoHorario, fecha_inicio: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="end-time">Hora de Fin</Label>
                  <Input 
                    id="end-time" 
                    type="time" 
                    value={nuevoHorario.fecha_fin}
                    onChange={(e) => setNuevoHorario({...nuevoHorario, fecha_fin: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="active" 
                  checked={nuevoHorario.estado === 1}
                  onCheckedChange={(checked) => setNuevoHorario({...nuevoHorario, estado: checked ? 1 : 0})}
                />
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
                <p className="text-2xl font-semibold text-purple-600">4</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {horarios.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No hay horarios configurados.</p>
            <Button onClick={() => setShowCreateDialog(true)} className="mt-4">
              Crear Primer Horario
            </Button>
          </div>
        ) : (
          horarios.map((horario) => (
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
                      {Math.floor(Math.random() * 5) + 1} empleados
                    </Badge>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Estado del horario:</span>
                      <Switch 
                        checked={horario.estado === 1}
                        onCheckedChange={() => handleToggleStatus(horario.id_horario, horario.estado)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

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
                  value={nuevoHorario.nombre_horario}
                  onChange={(e) => setNuevoHorario({...nuevoHorario, nombre_horario: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="edit-area">Área de Trabajo</Label>
                <Select 
                  value={nuevoHorario.id_area_trabajo.toString()} 
                  onValueChange={(value: string) => setNuevoHorario({...nuevoHorario, id_area_trabajo: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Desarrollo</SelectItem>
                    <SelectItem value="2">Marketing</SelectItem>
                    <SelectItem value="3">Recursos Humanos</SelectItem>
                    <SelectItem value="4">Administración</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-start-time">Hora de Inicio</Label>
                  <Input 
                    id="edit-start-time" 
                    type="time" 
                    value={nuevoHorario.fecha_inicio}
                    onChange={(e) => setNuevoHorario({...nuevoHorario, fecha_inicio: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-end-time">Hora de Fin</Label>
                  <Input 
                    id="edit-end-time" 
                    type="time" 
                    value={nuevoHorario.fecha_fin}
                    onChange={(e) => setNuevoHorario({...nuevoHorario, fecha_fin: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-active" 
                  checked={nuevoHorario.estado === 1}
                  onCheckedChange={(checked) => setNuevoHorario({...nuevoHorario, estado: checked ? 1 : 0})}
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
};
export default HorariosPage;