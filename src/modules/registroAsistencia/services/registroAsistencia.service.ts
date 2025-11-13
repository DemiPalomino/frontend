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

  obtenerDescriptoresEmpleados: async (): Promise<any[]> => {
  try {
    console.log('📥 Obteniendo descriptores reales de empleados...');
    const response = await apiFetch("/personas/descriptores");
    
    if (!response || !Array.isArray(response)) {
      throw new Error('Respuesta inválida del servidor');
    }
    
    console.log('✅ Descriptores obtenidos del backend:', response.length, 'empleados');
    return response;
  } catch (error: any) {
    console.error('❌ Error obteniendo descriptores reales:', error);
    
 
    console.log('🔄 Usando datos de prueba para desarrollo...');
    const datosPrueba = [
      {
        id_persona: 1,
        descriptor: Array.from({length: 128}, () => (Math.random() * 2) - 1), 
        nombres: "Admin",
        apellidos: "Sistema", 
        dni: "12345678"
      },
      {
        id_persona: 2,
        descriptor: Array.from({length: 128}, () => (Math.random() * 2) - 1),
        nombres: "Juan Carlos",
        apellidos: "Pérez López",
        dni: "87654321"
      },
      {
        id_persona: 3,
        descriptor: Array.from({length: 128}, () => (Math.random() * 2) - 1),
        nombres: "María Elena",
        apellidos: "García Torres", 
        dni: "11223344"
      }
    ];
    
    console.log('📋 Datos de prueba generados:', datosPrueba.length, 'empleados');
    return datosPrueba;
  }
},
  
  registrarDescriptorFacial: async (id_persona: number, descriptor: number[]): Promise<any> => {
    try {
     
      return await apiFetch(`/personas/${id_persona}/descriptor`, {
        method: "POST",
        body: JSON.stringify({ descriptor }),
      });
    } catch (error) {
      console.error('Error registrando descriptor:', error);
      throw new Error('No se pudo registrar el descriptor facial');
    }
  }
};