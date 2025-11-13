import { useState } from 'react';
import { reporteService, ReporteAsistencia, FiltrosReporte } from '../services/reporte.service';

export const useReporte = () => {
  const [reporte, setReporte] = useState<ReporteAsistencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generarReporte = async (filtros: FiltrosReporte) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reporteService.generarReporteAsistencias(filtros);
      setReporte(data);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportarPDF = async (filtros: FiltrosReporte) => {
    try {
      setLoading(true);
      const blob = await reporteService.exportarPDF(filtros);
      
  
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `reporte-asistencias-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    reporte,
    loading,
    error,
    generarReporte,
    exportarPDF,
  };
};