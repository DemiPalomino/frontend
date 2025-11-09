import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { 
  Settings, 
  Building, 
  Camera,
  Bell,
  Shield,
  Database,
  Save,
  RefreshCw
} from 'lucide-react';
import { datosEmpresa } from '../../data/mockData';

export function Configuracion() {
  const [companyData, setCompanyData] = useState(datosEmpresa);
  const [faceRecognitionEnabled, setFaceRecognitionEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [tardanzasLimit, setTardanzasLimit] = useState(15);

  const handleSaveSettings = () => {
    alert('Configuración guardada exitosamente');
  };

  const handleTestCamera = () => {
    alert('Prueba de cámara iniciada - Sistema funcionando correctamente');
  };

  const handleBackupNow = () => {
    alert('Respaldo iniciado - Se notificará cuando esté completo');
  };

  const handleResetSettings = () => {
    if (confirm('¿Estás seguro de que deseas restablecer toda la configuración?')) {
      alert('Configuración restablecida a valores por defecto');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Configuración del Sistema</h1>
        <p className="text-gray-600">Ajusta los parámetros generales del sistema de control de asistencia</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Información de la Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company-name">Nombre de la Empresa</Label>
              <Input 
                id="company-name"
                value={companyData.nombre_empresa}
                onChange={(e) => setCompanyData({...companyData, nombre_empresa: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="company-ruc">RUC</Label>
              <Input 
                id="company-ruc"
                value={companyData.ruc}
                onChange={(e) => setCompanyData({...companyData, ruc: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="company-address">Dirección</Label>
              <Textarea 
                id="company-address"
                value={companyData.direccion}
                onChange={(e) => setCompanyData({...companyData, direccion: e.target.value})}
                rows={3}
              />
            </div>

            <Button onClick={handleSaveSettings} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Guardar Información
            </Button>
          </CardContent>
        </Card>

        {/* Face Recognition Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Reconocimiento Facial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Habilitar Reconocimiento Facial</Label>
                <p className="text-sm text-gray-600">Permite el registro automático de asistencia</p>
              </div>
              <Switch 
                checked={faceRecognitionEnabled}
                onCheckedChange={setFaceRecognitionEnabled}
              />
            </div>

            <Separator />

            <div>
              <Label htmlFor="confidence">Nivel de Confianza (%)</Label>
              <Input 
                id="confidence"
                type="number"
                defaultValue="85"
                min="50"
                max="100"
              />
              <p className="text-sm text-gray-600 mt-1">
                Nivel mínimo de confianza para reconocimiento exitoso
              </p>
            </div>

            <div>
              <Label htmlFor="retry-attempts">Intentos de Reconocimiento</Label>
              <Input 
                id="retry-attempts"
                type="number"
                defaultValue="3"
                min="1"
                max="10"
              />
            </div>

            <Button onClick={handleTestCamera} variant="outline" className="w-full">
              <Camera className="w-4 h-4 mr-2" />
              Probar Cámara
            </Button>
          </CardContent>
        </Card>

        {/* Attendance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuración de Asistencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tardanza-limit">Tiempo de Gracia (minutos)</Label>
              <Input 
                id="tardanza-limit"
                type="number"
                value={tardanzasLimit}
                onChange={(e) => setTardanzasLimit(parseInt(e.target.value))}
                min="0"
                max="60"
              />
              <p className="text-sm text-gray-600 mt-1">
                Minutos de tolerancia antes de marcar tardanza
              </p>
            </div>

            <div>
              <Label htmlFor="break-duration">Duración de Descanso (minutos)</Label>
              <Input 
                id="break-duration"
                type="number"
                defaultValue="60"
                min="30"
                max="120"
              />
            </div>

            <div>
              <Label htmlFor="overtime-threshold">Umbral de Horas Extra (horas)</Label>
              <Input 
                id="overtime-threshold"
                type="number"
                defaultValue="8"
                min="6"
                max="12"
                step="0.5"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Registro Autom��tico de Salida</Label>
                <p className="text-sm text-gray-600">Registrar salida automáticamente al final de la jornada</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notifications & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificaciones y Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificaciones por Email</Label>
                <p className="text-sm text-gray-600">Enviar resúmenes diarios por email</p>
              </div>
              <Switch 
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Respaldo Automático</Label>
                <p className="text-sm text-gray-600">Respaldar datos diariamente</p>
              </div>
              <Switch 
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
              />
            </div>

            <div>
              <Label htmlFor="backup-time">Hora de Respaldo</Label>
              <Input 
                id="backup-time"
                type="time"
                defaultValue="02:00"
              />
            </div>

            <div>
              <Label htmlFor="session-timeout">Tiempo de Sesión (minutos)</Label>
              <Input 
                id="session-timeout"
                type="number"
                defaultValue="60"
                min="15"
                max="480"
              />
            </div>

            <Button onClick={handleBackupNow} variant="outline" className="w-full">
              <Database className="w-4 h-4 mr-2" />
              Respaldar Ahora
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Estado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Base de Datos</p>
              <p className="font-semibold text-green-600">Conectada</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Camera className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Cámara</p>
              <p className="font-semibold text-green-600">Operativa</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Último Respaldo</p>
              <p className="font-semibold text-blue-600">Hace 2 horas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleResetSettings}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Restablecer Configuración
        </Button>
        
        <div className="space-x-2">
          <Button variant="outline">
            Cancelar
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="w-4 h-4 mr-2" />
            Guardar Todos los Cambios
          </Button>
        </div>
      </div>
    </div>
  );
}