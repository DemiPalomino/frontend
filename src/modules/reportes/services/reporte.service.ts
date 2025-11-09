import { apiFetch } from "../../../app/service/api";

export interface ReporteAsistencia {
  id_asistencia: number;
  id_persona: number;
  fecha_ingreso: string;
  metodo_registro: string;
  fecha_salida?: string;
  miniTardanza: number;
  hora_entrada: string;
  hora_salida?: string;
  nombres: string;
  apellidos: string;
  dni: string;
  nombre_area: string;
}

export interface FiltrosReporte {
  fecha_inicio?: string;
  fecha_fin?: string;
  id_area?: number;
  id_persona?: number;
}

export const reporteService = {
  generarReporteAsistencias: async (filtros: FiltrosReporte): Promise<ReporteAsistencia[]> => {
    const params = new URLSearchParams();
    if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
    if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
    if (filtros.id_area) params.append('id_area', filtros.id_area.toString());
    if (filtros.id_persona) params.append('id_persona', filtros.id_persona.toString());

    return apiFetch(`/reporte-asistencias?${params.toString()}`);
  },

  exportarPDF: async (filtros: FiltrosReporte): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
    if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
    if (filtros.id_area) params.append('id_area', filtros.id_area.toString());

    const response = await fetch(`http://localhost:4000/api/exportar-pdf?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('Token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al exportar PDF');
    }
    
    return response.blob();
  },
};