import React, { useState } from 'react';
import { usePermiso } from '../controllers/usePermiso';
import { useAuth } from "../../../modules/auth/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Textarea } from '../../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Calendar } from '../../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import {
  FileText,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User
} from 'lucide-react';

export const PermisoEmpleadoPage: React.FC = () => {
  const { user } = useAuth();
  const {
    permisos,
    loading,
    error,
    crearPermiso,
  } = usePermiso({ idPersona: user?.id_persona });

  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date>();
  const [selectedEndDate, setSelectedEndDate] = useState<Date>();
  const [requestType, setRequestType] = useState<'enfermedad' | 'vacaciones' | 'falta' | 'personal'>('personal');
  const [justification, setJustification] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprobado': return 'secondary';
      case 'rechazado': return 'destructive';
      case 'pendiente': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprobado': return CheckCircle;
      case 'rechazado': return XCircle;
      case 'pendiente': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vacaciones': return 'bg-blue-100 text-blue-800';
      case 'enfermedad': return 'bg-red-100 text-red-800';
      case 'personal': return 'bg-yellow-100 text-yellow-800';
      case 'falta': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitRequest = async () => {
    try {
      if (!selectedStartDate || !selectedEndDate || !justification) {
        alert('Por favor complete todos los campos obligatorios');
        return;
      }

      if (!user?.id_persona) {
        alert('Error: No se pudo identificar al empleado');
        return;
      }

      const fechaInicio = new Date(selectedStartDate);
      fechaInicio.setHours(8, 0, 0, 0); 

      const fechaFin = new Date(selectedEndDate);
      fechaFin.setHours(17, 0, 0, 0); 

      await crearPermiso({
        fecha_solicitud: new Date().toISOString(), 
        fecha_inicio_ausencia: fechaInicio.toISOString(),
        fecha_fin_ausencia: fechaFin.toISOString(),
        tipo_permiso: requestType,
        justificacion: justification,
        estado: 'pendiente',
        id_persona: user.id_persona,
      });

      alert('Solicitud de permiso enviada exitosamente');
      setShowRequestDialog(false);
      setSelectedStartDate(undefined);
      setSelectedEndDate(undefined);
      setJustification('');
      setRequestType('personal');
    } catch (error: any) {
      console.error('Error al enviar solicitud:', error);
      alert('Error al enviar la solicitud: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando mis permisos...</p>
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
      {/* Cabecera */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Mis Permisos y Justificaciones</h1>
          <p className="text-gray-600">Gestiona tus solicitudes de permisos y ausencias</p>
        </div>
        <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Solicitud
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva Solicitud de Permiso</DialogTitle>
              <DialogDescription>
                Completa el formulario para solicitar un permiso o justificación de ausencia.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">Tipo de Permiso</Label>
                <Select value={requestType} onValueChange={(value: any) => setRequestType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="enfermedad">Enfermedad</SelectItem>
                    <SelectItem value="vacaciones">Vacaciones</SelectItem>
                    <SelectItem value="falta">Falta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fecha Inicio</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedStartDate?.toLocaleDateString('es-ES') || 'Seleccionar'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedStartDate}
                        onSelect={setSelectedStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Fecha Fin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedEndDate?.toLocaleDateString('es-ES') || 'Seleccionar'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedEndDate}
                        onSelect={setSelectedEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label htmlFor="justification">Justificación</Label>
                <Textarea
                  id="justification"
                  placeholder="Describe el motivo de tu solicitud..."
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmitRequest}>
                  Enviar Solicitud
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas personales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Solicitudes</p>
                <p className="text-2xl font-semibold">{permisos.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-semibold text-yellow-600">
                  {permisos.filter(p => p.estado === 'pendiente').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aprobadas</p>
                <p className="text-2xl font-semibold text-green-600">
                  {permisos.filter(p => p.estado === 'aprobado').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rechazadas</p>
                <p className="text-2xl font-semibold text-red-600">
                  {permisos.filter(p => p.estado === 'rechazado').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de permisos del empleado */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Solicitudes de Permisos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {permisos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No has realizado ninguna solicitud de permiso.</p>
                <p className="text-sm">Haz clic en "Nueva Solicitud" para crear una.</p>
              </div>
            ) : (
              permisos.map((permiso) => {
                const StatusIcon = getStatusIcon(permiso.estado);

                return (
                  <div key={permiso.id_permiso} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Solicitud #{permiso.id_permiso}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(permiso.tipo_permiso)}`}>
                              {permiso.tipo_permiso.charAt(0).toUpperCase() + permiso.tipo_permiso.slice(1)}
                            </span>
                            <Badge variant={getStatusColor(permiso.estado)}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {permiso.estado.charAt(0).toUpperCase() + permiso.estado.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-600">Solicitud: {new Date(permiso.fecha_solicitud).toLocaleDateString('es-ES')}</p>
                        <p className="text-sm">
                          <strong>Del:</strong> {new Date(permiso.fecha_inicio_ausencia).toLocaleDateString('es-ES')}
                        </p>
                        <p className="text-sm">
                          <strong>Al:</strong> {new Date(permiso.fecha_fin_ausencia).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2"><strong>Justificación:</strong></p>
                      <p className="text-sm bg-gray-50 p-3 rounded border">{permiso.justificacion}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermisoEmpleadoPage;