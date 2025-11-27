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

export const configuracionService = {
  getConfiguracionEmpresa: async (): Promise<ConfiguracionEmpresa> => {
    try {
      const companies = await apiFetch("/companies");
      
      const companyData = companies[0];
      
      if (!companyData) {
        console.warn('No se encontró información de empresa, usando valores por defecto');
        return {
          id_empresa: 1,
          nombre_empresa: 'Computekk prueba',
          ruc: '201212121212',
          direccion: 'Jr. Colonosss'
        };
      }
      
      return {
        id_empresa: companyData.id_empresa || 1,
        nombre_empresa: companyData.nombre_empresa || 'Computekk prueba',
        ruc: companyData.ruc || '201212121212',
        direccion: companyData.direccion || 'Jr. Colonosss'
      };
    } catch (error) {
      console.error('Error obteniendo configuración de empresa:', error);
      // En caso de error, devuelve valores por defecto
      return {
        id_empresa: 1,
        nombre_empresa: 'Computekk prueba',
        ruc: '201212121212',
        direccion: 'Jr. Colonosss'
      };
    }
  },

  updateConfiguracionEmpresa: async (configuracion: Partial<ConfiguracionEmpresa>): Promise<ConfiguracionEmpresa> => {
    try {
      console.log('Enviando datos de empresa:', configuracion);
      
      const updatedData = await apiFetch("/companies/1", {
        method: "PUT",
        body: JSON.stringify(configuracion),
      });
      
      console.log('Datos actualizados recibidos:', updatedData);
      
      return {
        id_empresa: updatedData.id_empresa || 1,
        nombre_empresa: updatedData.nombre_empresa || configuracion.nombre_empresa || '',
        ruc: updatedData.ruc || configuracion.ruc || '',
        direccion: updatedData.direccion || configuracion.direccion || ''
      };
    } catch (error) {
      console.error('Error actualizando configuración de empresa:', error);
      throw new Error('No se pudo actualizar la configuración de la empresa');
    }
  },

  // Configuración de Asistencia (simulada por ahora)
  getConfiguracionAsistencia: async (): Promise<ConfiguracionAsistencia> => {
    try {
      return {
        tiempo_gracia: 15,
        duracion_descanso: 60,
        umbral_horas_extra: 8,
        registro_automatico_salida: true
      };
    } catch (error) {
      console.error('Error obteniendo configuración de asistencia:', error);
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
      // Simular actualización - cuando implementes el backend, reemplaza esto con una llamada real
      const current = await configuracionService.getConfiguracionAsistencia();
      const updated = {
        ...current,
        ...configuracion
      };
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return updated;
    } catch (error) {
      console.error('Error actualizando configuración de asistencia:', error);
      throw new Error('No se pudo actualizar la configuración de asistencia');
    }
  }
};