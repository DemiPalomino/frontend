import { useState, useEffect } from 'react';
import { 
  configuracionService, 
  ConfiguracionEmpresa, 
  ConfiguracionAsistencia, 
  ConfiguracionFacial, 
  ConfiguracionNotificaciones,
  EstadoSistema 
} from '../services/configuracion.service';

export const useConfiguracion = () => {
  const [empresa, setEmpresa] = useState<ConfiguracionEmpresa | null>(null);
  const [asistencia, setAsistencia] = useState<ConfiguracionAsistencia | null>(null);
  const [facial, setFacial] = useState<ConfiguracionFacial | null>(null);
  const [notificaciones, setNotificaciones] = useState<ConfiguracionNotificaciones | null>(null);
  const [estadoSistema, setEstadoSistema] = useState<EstadoSistema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const cargarConfiguracion = async () => {
    try {
      setLoading(true);
      const [empresaData, asistenciaData, facialData, notificacionesData, estadoData] = await Promise.all([
        configuracionService.getConfiguracionEmpresa(),
        configuracionService.getConfiguracionAsistencia(),
        configuracionService.getConfiguracionFacial(),
        configuracionService.getConfiguracionNotificaciones(),
        configuracionService.getEstadoSistema()
      ]);
      setEmpresa(empresaData);
      setAsistencia(asistenciaData);
      setFacial(facialData);
      setNotificaciones(notificacionesData);
      setEstadoSistema(estadoData);
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

  const actualizarConfiguracionFacial = async (configuracion: Partial<ConfiguracionFacial>) => {
    try {
      setSaving(true);
      const actualizado = await configuracionService.updateConfiguracionFacial(configuracion);
      setFacial(actualizado);
      return actualizado;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const actualizarConfiguracionNotificaciones = async (configuracion: Partial<ConfiguracionNotificaciones>) => {
    try {
      setSaving(true);
      const actualizado = await configuracionService.updateConfiguracionNotificaciones(configuracion);
      setNotificaciones(actualizado);
      return actualizado;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const realizarBackup = async () => {
    try {
      setSaving(true);
      await configuracionService.realizarBackup();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const probarCamara = async () => {
    try {
      setSaving(true);
      const resultado = await configuracionService.probarCamara();
      return resultado;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const guardarTodasLasConfiguraciones = async (
    empresaConfig: Partial<ConfiguracionEmpresa>,
    asistenciaConfig: Partial<ConfiguracionAsistencia>,
    facialConfig: Partial<ConfiguracionFacial>,
    notificacionesConfig: Partial<ConfiguracionNotificaciones>
  ) => {
    try {
      setSaving(true);
      await Promise.all([
        actualizarConfiguracionEmpresa(empresaConfig),
        actualizarConfiguracionAsistencia(asistenciaConfig),
        actualizarConfiguracionFacial(facialConfig),
        actualizarConfiguracionNotificaciones(notificacionesConfig)
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
    guardarTodasLasConfiguraciones,
    recargarConfiguracion: cargarConfiguracion,
  };
};