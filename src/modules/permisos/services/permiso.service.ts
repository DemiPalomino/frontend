import { apiFetch } from "../../../app/service/api";

export interface Permiso {
  id_permiso: number;
  fecha_solicitud: string;
  fecha_inicio_ausencia: string;
  fecha_fin_ausencia: string;
  tipo_permiso: string;
  justificacion: string;
  estado: string;
  id_persona: number;
  nombres?: string;
  apellidos?: string;
  dni?: string;
}

export interface CreatePermisoDTO {
  fecha_solicitud: string;
  fecha_inicio_ausencia: string;
  fecha_fin_ausencia: string;
  tipo_permiso: string;
  justificacion: string;
  estado: string;
  id_persona: number;
}

export const permisoService = {
  getAll: async (): Promise<Permiso[]> => {
    try {
      return await apiFetch("/permisos");
    } catch (error) {
      console.error('Error en permisos:', error);
      throw new Error('No se pudieron cargar los permisos');
    }
  },

  getById: async (id: number): Promise<Permiso> => {
    try {
      return await apiFetch(`/permisos/${id}`);  
    } catch (error) {
      console.error(`Error en permiso ${id}:`, error);
      throw new Error('No se pudo cargar el permiso');
    }
  },

  create: async (permiso: CreatePermisoDTO): Promise<Permiso> => {
    try {
      return await apiFetch("/permisos", {
        method: "POST",
        body: JSON.stringify(permiso),
      });
    } catch (error) {
      console.error('Error al crear permiso:', error);
      throw new Error('No se pudo crear el permiso');
    }
  },

  update: async (id: number, permiso: Partial<Permiso>): Promise<Permiso> => {
    try {
      return await apiFetch(`/permisos/${id}`, { 
        method: "PUT",
        body: JSON.stringify(permiso),
      });
    } catch (error) {
      console.error(`Error al actualizar permiso ${id}:`, error);
      throw new Error('No se pudo actualizar el permiso');
    }
  },

  remove: async (id: number): Promise<void> => {
    try {
      await apiFetch(`/permisos/${id}`, {  
        method: "DELETE",
      });
    } catch (error) {
      console.error(`Error al elimianr permiso ${id}:`, error);
      throw new Error('No se pudo eliminar el permiso');
    }
  },
};