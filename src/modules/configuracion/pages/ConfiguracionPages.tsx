import React, { useState, useEffect } from 'react';
import { useConfiguracion } from '../controllers/useConfiguracion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { Textarea } from '../../../components/ui/textarea';
import { Separator } from '../../../components/ui/separator';
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

export const ConfiguracionPages: React.FC = () => {
  const { 
    empresa, 
    asistencia, 
    facial, 
    notificaciones, 
    estadoSistema,
    loading, 
    saving, 
    error,
    actualizarConfiguracionEmpresa,
    actualizarConfiguracionAsistencia,
    actualizarConfiguracionFacial,
    actualizarConfiguracionNotificaciones,
    realizarBackup,
    probarCamara,
    guardarTodasLasConfiguraciones
  } = useConfiguracion();

  const [empresaForm, setEmpresaForm] = useState({
    nombre_empresa: '',
    ruc: '',
    direccion: ''
  });

  const [asistenciaForm, setAsistenciaForm] = useState({
    tiempo_gracia: 15,
    duracion_descanso: 60,
    umbral_horas_extra: 8,
    registro_automatico_salida: true
  });

  const [facialForm, setFacialForm] = useState({
    habilitar_reconocimiento_facial: true,
    nivel_confianza: 85,
    intentos_reconocimiento: 3
  });

  const [notificacionesForm, setNotificacionesForm] = useState({
    notificaciones_email: true,
    respaldo_automatico: true,
    hora_respaldo: '02:00',
    tiempo_sesion: 60
  });

  // Cargar los datos en los formularios cuando se cargue la configuración
  useEffect(() => {
    if (empresa) {
      setEmpresaForm({
        nombre_empresa: empresa.nombre_empresa,
        ruc: empresa.ruc,
        direccion: empresa.direccion
      });
    }
    if (asistencia) {
      setAsistenciaForm({
        tiempo_gracia: asistencia.tiempo_gracia,
        duracion_descanso: asistencia.duracion_descanso,
        umbral_horas_extra: asistencia.umbral_horas_extra,
        registro_automatico_salida: asistencia.registro_automatico_salida
      });
    }
    if (facial) {
      setFacialForm({
        habilitar_reconocimiento_facial: facial.habilitar_reconocimiento_facial,
        nivel_confianza: facial.nivel_confianza,
        intentos_reconocimiento: facial.intentos_reconocimiento
      });
    }
    if (notificaciones) {
      setNotificacionesForm({
        notificaciones_email: notificaciones.notificaciones_email,
        respaldo_automatico: notificaciones.respaldo_automatico,
        hora_respaldo: notificaciones.hora_respaldo,
        tiempo_sesion: notificaciones.tiempo_sesion
      });
    }
  }, [empresa, asistencia, facial, notificaciones]);

  const handleSaveEmpresa = async () => {
    try {
      await actualizarConfiguracionEmpresa(empresaForm);
      alert('Configuración de empresa guardada exitosamente');
    } catch (error) {
      alert('Error al guardar la configuración de empresa');
    }
  };

  const handleSaveAsistencia = async () => {
    try {
      await actualizarConfiguracionAsistencia(asistenciaForm);
      alert('Configuración de asistencia guardada exitosamente');
    } catch (error) {
      alert('Error al guardar la configuración de asistencia');
    }
  };

  const handleSaveFacial = async () => {
    try {
      await actualizarConfiguracionFacial(facialForm);
      alert('Configuración de reconocimiento facial guardada exitosamente');
    } catch (error) {
      alert('Error al guardar la configuración de reconocimiento facial');
    }
  };

  const handleSaveNotificaciones = async () => {
    try {
      await actualizarConfiguracionNotificaciones(notificacionesForm);
      alert('Configuración de notificaciones guardada exitosamente');
    } catch (error) {
      alert('Error al guardar la configuración de notificaciones');
    }
  };

  const handleBackupNow = async () => {
    try {
      await realizarBackup();
      alert('Respaldo realizado exitosamente');
    } catch (error) {
      alert('Error al realizar el respaldo');
    }
  };

  const handleTestCamera = async () => {
    try {
      const resultado = await probarCamara();
      if (resultado) {
        alert('Prueba de cámara exitosa - Sistema funcionando correctamente');
      } else {
        alert('Error en la prueba de cámara');
      }
    } catch (error) {
      alert('Error al probar la cámara');
    }
  };

  const handleSaveAll = async () => {
    try {
      await guardarTodasLasConfiguraciones(
        empresaForm,
        asistenciaForm,
        facialForm,
        notificacionesForm
      );
      alert('Todas las configuraciones guardadas exitosamente');
    } catch (error) {
      alert('Error al guardar las configuraciones');
    }
  };

  const handleResetSettings = () => {
    if (confirm('¿Estás seguro de que deseas restablecer toda la configuración?')) {
      // Recargar la configuración desde el servidor
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando configuración...</p>
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
                value={empresaForm.nombre_empresa}
                onChange={(e) => setEmpresaForm({...empresaForm, nombre_empresa: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="company-ruc">RUC</Label>
              <Input 
                id="company-ruc"
                value={empresaForm.ruc}
                onChange={(e) => setEmpresaForm({...empresaForm, ruc: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="company-address">Dirección</Label>
              <Textarea 
                id="company-address"
                value={empresaForm.direccion}
                onChange={(e) => setEmpresaForm({...empresaForm, direccion: e.target.value})}
                rows={3}
              />
            </div>

            <Button onClick={handleSaveEmpresa} disabled={saving} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Guardando...' : 'Guardar Información'}
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
                checked={facialForm.habilitar_reconocimiento_facial}
                onCheckedChange={(checked) => setFacialForm({...facialForm, habilitar_reconocimiento_facial: checked})}
              />
            </div>

            <Separator />

            <div>
              <Label htmlFor="confidence">Nivel de Confianza (%)</Label>
              <Input 
                id="confidence"
                type="number"
                value={facialForm.nivel_confianza}
                onChange={(e) => setFacialForm({...facialForm, nivel_confianza: parseInt(e.target.value)})}
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
                value={facialForm.intentos_reconocimiento}
                onChange={(e) => setFacialForm({...facialForm, intentos_reconocimiento: parseInt(e.target.value)})}
                min="1"
                max="10"
              />
            </div>

            <Button onClick={handleTestCamera} disabled={saving} variant="outline" className="w-full">
              <Camera className="w-4 h-4 mr-2" />
              Probar Cámara
            </Button>

            <Button onClick={handleSaveFacial} disabled={saving} variant="outline" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Guardando...' : 'Guardar Configuración Facial'}
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
                value={asistenciaForm.tiempo_gracia}
                onChange={(e) => setAsistenciaForm({...asistenciaForm, tiempo_gracia: parseInt(e.target.value)})}
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
                value={asistenciaForm.duracion_descanso}
                onChange={(e) => setAsistenciaForm({...asistenciaForm, duracion_descanso: parseInt(e.target.value)})}
                min="30"
                max="120"
              />
            </div>

            <div>
              <Label htmlFor="overtime-threshold">Umbral de Horas Extra (horas)</Label>
              <Input 
                id="overtime-threshold"
                type="number"
                value={asistenciaForm.umbral_horas_extra}
                onChange={(e) => setAsistenciaForm({...asistenciaForm, umbral_horas_extra: parseInt(e.target.value)})}
                min="6"
                max="12"
                step="0.5"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Registro Automático de Salida</Label>
                <p className="text-sm text-gray-600">Registrar salida automáticamente al final de la jornada</p>
              </div>
              <Switch 
                checked={asistenciaForm.registro_automatico_salida}
                onCheckedChange={(checked) => setAsistenciaForm({...asistenciaForm, registro_automatico_salida: checked})}
              />
            </div>

            <Button onClick={handleSaveAsistencia} disabled={saving} variant="outline" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Guardando...' : 'Guardar Configuración de Asistencia'}
            </Button>
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
                checked={notificacionesForm.notificaciones_email}
                onCheckedChange={(checked) => setNotificacionesForm({...notificacionesForm, notificaciones_email: checked})}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Respaldo Automático</Label>
                <p className="text-sm text-gray-600">Respaldar datos diariamente</p>
              </div>
              <Switch 
                checked={notificacionesForm.respaldo_automatico}
                onCheckedChange={(checked) => setNotificacionesForm({...notificacionesForm, respaldo_automatico: checked})}
              />
            </div>

            <div>
              <Label htmlFor="backup-time">Hora de Respaldo</Label>
              <Input 
                id="backup-time"
                type="time"
                value={notificacionesForm.hora_respaldo}
                onChange={(e) => setNotificacionesForm({...notificacionesForm, hora_respaldo: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="session-timeout">Tiempo de Sesión (minutos)</Label>
              <Input 
                id="session-timeout"
                type="number"
                value={notificacionesForm.tiempo_sesion}
                onChange={(e) => setNotificacionesForm({...notificacionesForm, tiempo_sesion: parseInt(e.target.value)})}
                min="15"
                max="480"
              />
            </div>

            <Button onClick={handleBackupNow} disabled={saving} variant="outline" className="w-full">
              <Database className="w-4 h-4 mr-2" />
              {saving ? 'Respaldando...' : 'Respaldar Ahora'}
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
          {estadoSistema ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Database className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Base de Datos</p>
                <p className="font-semibold text-green-600">{estadoSistema.base_datos}</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Cámara</p>
                <p className="font-semibold text-green-600">{estadoSistema.camara}</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Último Respaldo</p>
                <p className="font-semibold text-blue-600">{estadoSistema.ultimo_respaldo}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>No se pudo cargar el estado del sistema</p>
            </div>
          )}
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
          <Button onClick={handleSaveAll} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Todos los Cambios'}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ConfiguracionPages;