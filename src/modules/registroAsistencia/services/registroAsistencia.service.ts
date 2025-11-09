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

  obtenerDescriptoresEmpleados: async (): Promise<{id_persona: number, descriptor: number[]}[]> => {
    try {
      return await apiFetch("/personas/descriptores");
    } catch (error) {
      console.error('Error obteniendo descriptores:', error);
      return [];
    }
  },

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