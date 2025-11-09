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

export interface ConfiguracionFacial {
  habilitar_reconocimiento_facial: boolean;
  nivel_confianza: number;
  intentos_reconocimiento: number;
}

export interface ConfiguracionNotificaciones {
  notificaciones_email: boolean;
  respaldo_automatico: boolean;
  hora_respaldo: string;
  tiempo_sesion: number;
}

export interface EstadoSistema {
  base_datos: string;
  camara: string;
  ultimo_respaldo: string;
}

export const configuracionService = {
  // Configuración de la Empresa
  getConfiguracionEmpresa: async (): Promise<ConfiguracionEmpresa> => {
    try {
      const companys = await apiFetch("/companys");
      return companys[0] || {
        id_empresa: 1,
        nombre_empresa: "Empresa Demo",
        ruc: "20123456789",
        direccion: "Av. Principal 123, Lima"
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
      return await apiFetch("/company/1", {
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
  },

  // Configuración de Reconocimiento Facial (simulada por ahora)
  getConfiguracionFacial: async (): Promise<ConfiguracionFacial> => {
    try {
      return {
        habilitar_reconocimiento_facial: true,
        nivel_confianza: 85,
        intentos_reconocimiento: 3
      };
    } catch (error) {
      console.error('Error fetching facial config:', error);
      return {
        habilitar_reconocimiento_facial: true,
        nivel_confianza: 85,
        intentos_reconocimiento: 3
      };
    }
  },

  updateConfiguracionFacial: async (configuracion: Partial<ConfiguracionFacial>): Promise<ConfiguracionFacial> => {
    try {
      const current = await configuracionService.getConfiguracionFacial();
      return {
        ...current,
        ...configuracion
      };
    } catch (error) {
      console.error('Error updating facial config:', error);
      throw new Error('No se pudo actualizar la configuración facial');
    }
  },

  // Configuración de Notificaciones (simulada por ahora)
  getConfiguracionNotificaciones: async (): Promise<ConfiguracionNotificaciones> => {
    try {
      return {
        notificaciones_email: true,
        respaldo_automatico: true,
        hora_respaldo: "02:00",
        tiempo_sesion: 60
      };
    } catch (error) {
      console.error('Error fetching notificaciones config:', error);
      return {
        notificaciones_email: true,
        respaldo_automatico: true,
        hora_respaldo: "02:00",
        tiempo_sesion: 60
      };
    }
  },

  updateConfiguracionNotificaciones: async (configuracion: Partial<ConfiguracionNotificaciones>): Promise<ConfiguracionNotificaciones> => {
    try {
      const current = await configuracionService.getConfiguracionNotificaciones();
      return {
        ...current,
        ...configuracion
      };
    } catch (error) {
      console.error('Error updating notificaciones config:', error);
      throw new Error('No se pudo actualizar la configuración de notificaciones');
    }
  },

  // Estado del Sistema (simulado por ahora)
  getEstadoSistema: async (): Promise<EstadoSistema> => {
    try {
      return {
        base_datos: "Conectada",
        camara: "Operativa",
        ultimo_respaldo: "Hace 2 horas"
      };
    } catch (error) {
      console.error('Error fetching sistema status:', error);
      return {
        base_datos: "Conectada",
        camara: "Operativa",
        ultimo_respaldo: "Hace 2 horas"
      };
    }
  },

  // Backup (simulado por ahora)
  realizarBackup: async (): Promise<void> => {
    try {
      // Simular backup
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Backup realizado exitosamente');
    } catch (error) {
      console.error('Error realizando backup:', error);
      throw new Error('No se pudo realizar el backup');
    }
  },

  // Probar Cámara
  probarCamara: async (): Promise<boolean> => {
    try {
      // Simular prueba de cámara
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Error probando cámara:', error);
      return false;
    }
  },
};