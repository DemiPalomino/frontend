import { useState, useEffect } from 'react';
import { 
  configuracionService, 
  ConfiguracionEmpresa, 
  ConfiguracionAsistencia
} from '../services/configuracion.service';

export const useConfiguracion = () => {
  const [empresa, setEmpresa] = useState<ConfiguracionEmpresa | null>(null);
  const [asistencia, setAsistencia] = useState<ConfiguracionAsistencia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const cargarConfiguracion = async () => {
    try {
      setLoading(true);
      const [empresaData, asistenciaData] = await Promise.all([
        configuracionService.getConfiguracionEmpresa(),
        configuracionService.getConfiguracionAsistencia()
      ]);
      setEmpresa(empresaData);
      setAsistencia(asistenciaData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const actualizarConfiguracionEmpresa = async (configuracion: Partial<ConfiguracionEmpresa>) => {
    try {
      setSaving(true);
      const actualizado = await configuracionService.updateConfiguracionEmpresa(configuracion);
      setEmpresa(actualizado);
      return actualizado;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const actualizarConfiguracionAsistencia = async (configuracion: Partial<ConfiguracionAsistencia>) => {
    try {
      setSaving(true);
      const actualizado = await configuracionService.updateConfiguracionAsistencia(configuracion);
      setAsistencia(actualizado);
      return actualizado;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  };
  

  const guardarTodasLasConfiguraciones = async (
    empresaConfig: Partial<ConfiguracionEmpresa>,
    asistenciaConfig: Partial<ConfiguracionAsistencia>
  ) => {
    try {
      setSaving(true);
      await Promise.all([
        actualizarConfiguracionEmpresa(empresaConfig),
        actualizarConfiguracionAsistencia(asistenciaConfig)
      ]);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  return {
    empresa,
    asistencia,    
    loading,
    saving,
    error,
    actualizarConfiguracionEmpresa,
    actualizarConfiguracionAsistencia,    
    guardarTodasLasConfiguraciones,
    recargarConfiguracion: cargarConfiguracion,
  };
};