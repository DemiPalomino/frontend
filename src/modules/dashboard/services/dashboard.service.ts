import { apiFetch } from "../../../app/service/api";

export interface Estadisticas {
  totalEmpleados: number;
  asistenciasHoy: number;
  ausentesHoy: number;
  tardanzasHoy: number;
}

export interface EstadisticasEmpleado {
  asistenciaHoy: any;
  tardanzasMes: number;
  asistenciasMes: number;
  fechaConsulta: string;
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
      return await apiFetch("/dashboard/estadisticas");
    } catch (error) {
      console.error('Error en estadísticas:', error);
      return {
        totalEmpleados: 0,
        asistenciasHoy: 0,
        ausentesHoy: 0,
        tardanzasHoy: 0
      };
    }
  },

  getEstadisticasEmpleado: async (): Promise<EstadisticasEmpleado> => {
    try {
      return await apiFetch("/dashboard/estadisticas/empleado");
    } catch (error) {
      console.error('Error en estadísticas empleado:', error);
      return {
        asistenciaHoy: null,
        tardanzasMes: 0,
        asistenciasMes: 0,
        fechaConsulta: new Date().toISOString()
      };
    }
  },

  getReporteAsistencias: async (fecha_inicio?: string, fecha_fin?: string, id_area?: number): Promise<ReporteAsistencia[]> => {
    const params = new URLSearchParams();
    if (fecha_inicio) params.append('fecha_inicio', fecha_inicio);
    if (fecha_fin) params.append('fecha_fin', fecha_fin);
    if (id_area) params.append('id_area', id_area.toString());

    try {
      return await apiFetch(`/dashboard/reportes/asistencias?${params.toString()}`);
    } catch (error) {
      console.error('Error en reporte asistencias:', error);
      return [];
    }
  },

  getTardanzasDelDia: async (): Promise<any[]> => {
    try {
      return await apiFetch("/dashboard/tardanzas-hoy");
    } catch (error) {
      console.error('Error en tardanzas:', error);
      return [];
    }
  }
};