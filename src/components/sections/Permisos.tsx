import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
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
import { permisosJustificaciones, personas } from '../../data/mockData';
import { PermisoJustificacion } from '../../types/database';

export function Permisos() {
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date>();
  const [selectedEndDate, setSelectedEndDate] = useState<Date>();
  const [requestType, setRequestType] = useState<'enfermedad' | 'vacaciones' | 'falta' | 'personal'>('personal');
  const [justification, setJustification] = useState('');

  const getPersonaById = (id: number) => personas.find(p => p.id_persona === id);

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

  const handleSubmitRequest = () => {
    // Simular envío de solicitud
    alert('Solicitud de permiso enviada exitosamente');
    setShowRequestDialog(false);
    setSelectedStartDate(undefined);
    setSelectedEndDate(undefined);
    setJustification('');
  };

  const approveRequest = (id: number) => {
    alert(`Solicitud ${id} aprobada`);
  };

  const rejectRequest = (id: number) => {
    alert(`Solicitud ${id} rechazada`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Permisos y Justificaciones</h1>
          <p className="text-gray-600">Gestiona las solicitudes de permisos y ausencias del personal</p>
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
                <Label htmlFor="employee">Empleado</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    {personas.map((persona) => (
                      <SelectItem key={persona.id_persona} value={persona.id_persona.toString()}>
                        {persona.nombres} {persona.apellidos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Solicitudes</p>
                <p className="text-2xl font-semibold">{permisosJustificaciones.length}</p>
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
                  {permisosJustificaciones.filter(p => p.estado === 'pendiente').length}
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
                  {permisosJustificaciones.filter(p => p.estado === 'aprobado').length}
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
                  {permisosJustificaciones.filter(p => p.estado === 'rechazado').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes de Permisos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {permisosJustificaciones.map((permiso) => {
              const persona = getPersonaById(permiso.id_persona);
              const StatusIcon = getStatusIcon(permiso.estado);
              
              return (
                <div key={permiso.id_permiso} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={persona?.imagen} 
                        alt={persona?.nombres}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{persona?.nombres} {persona?.apellidos}</h3>
                        <p className="text-sm text-gray-600">{persona?.email}</p>
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
                  
                  {permiso.estado === 'pendiente' && (
                    <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => rejectRequest(permiso.id_permiso)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rechazar
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => approveRequest(permiso.id_permiso)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Aprobar
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}