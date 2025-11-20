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
      const response = await apiFetch("/asistencias/facial", {
        method: "POST",
        body: JSON.stringify({ 
          id_persona, 
          metodo_registro: 'reconocimientoFacial' 
        }),
      });
      return response;
    } catch (error) {
      console.error('Error registrando asistencia facial:', error);
      throw new Error('No se pudo registrar la asistencia facial');
    }
  },

};