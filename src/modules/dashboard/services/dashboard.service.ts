import { apiFetch } from "../../../app/service/api";

export interface Estadisticas {
  totalEmpleados: number;
  asistenciasHoy: number;
  ausentesHoy: number;
  tardanzasHoy: number;
}

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

export const dashboardService = {
  getEstadisticas: async (): Promise<Estadisticas> => {
    try {
      return await apiFetch("/estadisticas");
    } catch (error) {
      console.error('Error fetching estadísticas:', error);
      
      return {
        totalEmpleados: 0,
        asistenciasHoy: 0,
        ausentesHoy: 0,
        tardanzasHoy: 0
      };
    }
  },

  getReporteAsistencias: async (fecha_inicio?: string, fecha_fin?: string, id_area?: number): Promise<ReporteAsistencia[]> => {
    const params = new URLSearchParams();
    if (fecha_inicio) params.append('fecha_inicio', fecha_inicio);
    if (fecha_fin) params.append('fecha_fin', fecha_fin);
    if (id_area) params.append('id_area', id_area.toString());

    try {
      return await apiFetch(`/reporte-asistencias?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching reporte asistencias:', error);
      return [];
    }
  },

  getTardanzasDelDia: async (): Promise<any[]> => {
    try {
      return await apiFetch("/tardanzas-hoy");
    } catch (error) {
      console.error('Error fetching tardanzas:', error);
      return [];
    }
  }
};