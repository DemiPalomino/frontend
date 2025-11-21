import { useState, useEffect } from 'react';
import { dashboardService, Estadisticas, ReporteAsistencia, EstadisticasEmpleado } from '../services/dashboard.service';
import { useAuth } from "../../../modules/auth/hooks/useAuth";

export const useDashboard = () => {
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [estadisticasEmpleado, setEstadisticasEmpleado] = useState<EstadisticasEmpleado | null>(null);
  const [reporteAsistencias, setReporteAsistencias] = useState<ReporteAsistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const isAdmin = user?.role === 1;

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAdmin) {
        const data = await dashboardService.getEstadisticas();
        setEstadisticas(data);
      } else {
        const data = await dashboardService.getEstadisticasEmpleado();
        setEstadisticasEmpleado(data);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar estadísticas');
      console.error('Error en useDashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarReporteAsistencias = async (fecha_inicio?: string, fecha_fin?: string, id_area?: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getReporteAsistencias(fecha_inicio, fecha_fin, id_area);
      setReporteAsistencias(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar reporte');
      console.error('Error en useDashboard - reporte:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, [isAdmin]);

  return {
    estadisticas,
    estadisticasEmpleado,
    reporteAsistencias,
    loading,
    error,
    isAdmin,
    cargarReporteAsistencias,
    recargarEstadisticas: cargarEstadisticas,
  };
};