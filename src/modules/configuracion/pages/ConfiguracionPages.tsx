import React, { useState, useEffect } from 'react';
import { useConfiguracion } from '../controllers/useConfiguracion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { Textarea } from '../../../components/ui/textarea';

import {
  Settings,
  Building,  
  Save
} from 'lucide-react';

export const ConfiguracionPages: React.FC = () => {
  const {
    empresa,
    asistencia,    
    loading,
    saving,
    error,
    actualizarConfiguracionEmpresa,
    actualizarConfiguracionAsistencia
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

  useEffect(() => {
    if (empresa) {
      setEmpresaForm({
        nombre_empresa: empresa.nombre_empresa || '',
        ruc: empresa.ruc || '',
        direccion: empresa.direccion || ''
      });
    }
  }, [empresa]);

  useEffect(() => {
    if (asistencia) {
      setAsistenciaForm({
        tiempo_gracia: asistencia.tiempo_gracia || 15,
        duracion_descanso: asistencia.duracion_descanso || 60,
        umbral_horas_extra: asistencia.umbral_horas_extra || 8,
        registro_automatico_salida: asistencia.registro_automatico_salida !== undefined ? asistencia.registro_automatico_salida : true
      });
    }
  }, [asistencia]);
  
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
                onChange={(e) => setEmpresaForm({ ...empresaForm, nombre_empresa: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="company-ruc">RUC</Label>
              <Input
                id="company-ruc"
                value={empresaForm.ruc}
                onChange={(e) => setEmpresaForm({ ...empresaForm, ruc: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="company-address">Dirección</Label>
              <Textarea
                id="company-address"
                value={empresaForm.direccion}
                onChange={(e) => setEmpresaForm({ ...empresaForm, direccion: e.target.value })}
                rows={3}
              />
            </div>

            <Button onClick={handleSaveEmpresa} disabled={saving} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Guardando...' : 'Guardar Información'}
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
                value={asistenciaForm.tiempo_gracia || ''}
                onChange={(e) => setAsistenciaForm({
                  ...asistenciaForm,
                  tiempo_gracia: parseInt(e.target.value) || 0
                })}
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
                onChange={(e) => setAsistenciaForm({ ...asistenciaForm, duracion_descanso: parseInt(e.target.value) })}
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
                onChange={(e) => setAsistenciaForm({ ...asistenciaForm, umbral_horas_extra: parseInt(e.target.value) })}
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
                onCheckedChange={(checked) => setAsistenciaForm({ ...asistenciaForm, registro_automatico_salida: checked })}
              />
            </div>

            <Button onClick={handleSaveAsistencia} disabled={saving} variant="outline" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Guardando...' : 'Guardar Configuración de Asistencia'}
            </Button>
          </CardContent>
        </Card>
      </div>      
    </div>
  );
};
export default ConfiguracionPages;