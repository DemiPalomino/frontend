// CORREGIDO - registroAsistencia.service.ts
import { apiFetch } from "../../../app/service/api";

export interface ResultadoReconocimiento {
  tipo: 'entrada' | 'salida';
  id_asistencia: number;
  fecha_ingreso?: string;
  fecha_salida?: string;
  miniTardanza?: number;
  mensaje: string;
  persona?: {
    id_persona: number;
    nombres: string;
    apellidos: string;
    dni: string;
  };
}

export interface EmpleadoConDescriptor {
  id_persona: number;
  nombres: string;
  apellidos: string;
  dni: string;
  descriptor: number[];
}

export const registroAsistenciaService = {
  registrarAsistenciaFacial: async (id_persona: number): Promise<ResultadoReconocimiento> => {
    try {
      // apiFetch ahora retorna directamente los datos parseados
      const data = await apiFetch("/asistencias/facial", {
        method: "POST",
        body: JSON.stringify({ id_persona }),
      });
      return data;
    } catch (error: any) {
      console.error('Error en registrarAsistenciaFacial:', error);
      throw new Error(error.message || 'Error al registrar asistencia');
    }
  },

  obtenerEmpleadosConDescriptores: async (): Promise<EmpleadoConDescriptor[]> => {
    try {
      console.log('Obteniendo empleados con descriptores...');
      
      // apiFetch ahora retorna directamente los datos parseados
      const data = await apiFetch("/personas/descriptores", {
        method: "GET",
      });
      
      console.log(`Empleados obtenidos: ${data.length}`);
      return data;
      
    } catch (error: any) {
      console.error('❌ Error completo en obtenerEmpleadosConDescriptores:', error);
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
      }
      
      throw new Error(error.message || 'No se pudo obtener la lista de empleados');
    }
  },

  registrarDescriptorFacial: async (id_persona: number, descriptor: number[]): Promise<void> => {
    try {
      await apiFetch(`/personas/${id_persona}/descriptor`, {
        method: "POST",
        body: JSON.stringify({ descriptor }),
      });
    } catch (error: any) {
      console.error('Error en registrarDescriptorFacial:', error);
      throw new Error(error.message || 'Error al registrar descriptor facial');
    }
  }
};