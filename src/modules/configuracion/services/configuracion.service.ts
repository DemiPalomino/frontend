import { apiFetch } from "../../../app/service/api";

export interface ConfiguracionEmpresa {
  id_empresa: number;
  nombre_empresa: string;
  ruc: string;
  direccion: string;
}

export interface ConfiguracionAsistencia {
  tiempo_gracia: number;
  duracion_descanso: number;
  umbral_horas_extra: number;
  registro_automatico_salida: boolean;
}
//
export const configuracionService = {

getConfiguracionEmpresa: async (): Promise<ConfiguracionEmpresa> => {
  try {
    const companies = await apiFetch("/companies");
    const companyData = companies[0];
    
    return {
      id_empresa: companyData?.id_empresa || 1,
      nombre_empresa: companyData?.nombre_empresa || "Empresa Demo",
      ruc: companyData?.ruc || "20123456789",
      direccion: companyData?.direccion || "Av. Principal 123, Lima"
    };
  } catch (error) {
    console.error('Error fetching empresa config:', error);
    return {
      id_empresa: 1,
      nombre_empresa: "Empresa Demo",
      ruc: "20123456789",
      direccion: "Av. Principal 123, Lima"
    };
  }
},

  updateConfiguracionEmpresa: async (configuracion: Partial<ConfiguracionEmpresa>): Promise<ConfiguracionEmpresa> => {
    try {
      return await apiFetch("/companies/1", {
        method: "PUT",
        body: JSON.stringify(configuracion),
      });
    } catch (error) {
      console.error('Error updating empresa config:', error);
      throw new Error('No se pudo actualizar la configuración de la empresa');
    }
  },

  // Configuración de Asistencia (simulada por ahora)
  getConfiguracionAsistencia: async (): Promise<ConfiguracionAsistencia> => {
    try {
      // Endpoint no existe aún, retornar valores por defecto
      return {
        tiempo_gracia: 15,
        duracion_descanso: 60,
        umbral_horas_extra: 8,
        registro_automatico_salida: true
      };
    } catch (error) {
      console.error('Error fetching asistencia config:', error);
      return {
        tiempo_gracia: 15,
        duracion_descanso: 60,
        umbral_horas_extra: 8,
        registro_automatico_salida: true
      };
    }
  },

  updateConfiguracionAsistencia: async (configuracion: Partial<ConfiguracionAsistencia>): Promise<ConfiguracionAsistencia> => {
    try {
      // Simular actualización
      const current = await configuracionService.getConfiguracionAsistencia();
      return {
        ...current,
        ...configuracion
      };
    } catch (error) {
      console.error('Error updating asistencia config:', error);
      throw new Error('No se pudo actualizar la configuración de asistencia');
    }
  }
};