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

export const registroAsistenciaService = {
  registrarAsistenciaFacial: async (id_persona: number): Promise<ResultadoReconocimiento> => {
    try {
      return await apiFetch("/asistencias/facial", {
        method: "POST",
        body: JSON.stringify({ id_persona, metodo_registro: 'facial' }),
      });
    } catch (error) {
      console.error('Error registrando asistencia facial:', error);
      throw new Error('No se pudo registrar la asistencia facial');
    }
  },

  registrarAsistenciaManual: async (id_persona: number): Promise<ResultadoReconocimiento> => {
    try {
      return await apiFetch("/asistencias/manual", {
        method: "POST",
        body: JSON.stringify({ id_persona, metodo_registro: 'manual' }),
      });
    } catch (error) {
      console.error('Error registrando asistencia manual:', error);
      throw new Error('No se pudo registrar la asistencia manual');
    }
  },

  obtenerDescriptoresEmpleados: async (): Promise<DescriptorEmpleado[]> => {
    try {
      console.log('📥 Obteniendo descriptores de empleados...');
      // Por ahora, retornar datos de prueba
      return [
        {
          id_persona: 1,
          descriptor: Array.from({length: 128}, () => Math.random()),
          nombres: "Admin",
          apellidos: "Sistema", 
          dni: "12345678"
        },
        {
          id_persona: 2,
          descriptor: Array.from({length: 128}, () => Math.random()),
          nombres: "Juan Carlos",
          apellidos: "Pérez López",
          dni: "87654321"
        },
        {
          id_persona: 3,
          descriptor: Array.from({length: 128}, () => Math.random()),
          nombres: "María Elena", 
          apellidos: "García Torres",
          dni: "11223344"
        }
      ];
    } catch (error) {
      console.error('❌ Error obteniendo descriptores:', error);
      throw new Error('No se pudieron cargar los descriptores de empleados');
    }
  },
 /*  obtenerDescriptoresEmpleados: async (): Promise<{id_persona: number, descriptor: number[]}[]> => {
    try {
      return await apiFetch("/personas/descriptores");
    } catch (error) {
      console.error('Error obteniendo descriptores:', error);
      return [];
    }
  }, */

  registrarDescriptorFacial: async (id_persona: number, descriptor: number[]): Promise<any> => {
    try {
      return await apiFetch(`/persona/${id_persona}/descriptor`, {
        method: "POST",
        body: JSON.stringify({ descriptor }),
      });
    } catch (error) {
      console.error('Error registrando descriptor:', error);
      throw new Error('No se pudo registrar el descriptor facial');
    }
  },

  verificarRostro: async (descriptor: number[]): Promise<{id_persona: number, similitud: number} | null> => {
    try {
      return await apiFetch("/verificar-rostro", {
        method: "POST",
        body: JSON.stringify({ descriptor }),
      });
    } catch (error) {
      console.error('Error verificando rostro:', error);
      return null;
    }
  },
};