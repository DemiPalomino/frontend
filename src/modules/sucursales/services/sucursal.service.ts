import { apiFetch } from "../../../app/service/api";

export interface Sucursal {
  id_sucursal: number;
  nombre_sucursal: string;
  direccion: string;
  telefono?: string;
  activo: boolean;
  id_area_trabajo?: number;
  nombre_area?: string;
}

export interface AreaTrabajo {
  id_area: number;
  nombre_area: string;
  descripcion: string;
  id_sucursal?: number;
}

export interface CreateSucursalDTO {
  nombre_sucursal: string;
  direccion: string;
  telefono?: string;
  id_area_trabajo?: number;
}

export interface CreateAreaDTO {
  nombre_area: string;
  descripcion: string;
  id_sucursal?: number;
}

export const sucursalService = {
  // Sucursales
  getSucursales: async (): Promise<Sucursal[]> => {
    try {
      return await apiFetch("/sucursals");
    } catch (error) {
      console.error('Error fetching sucursales:', error);
      throw new Error('No se pudieron cargar las sucursales');
    }
  },

  getSucursalById: async (id: number): Promise<Sucursal> => {
    try {
      return await apiFetch(`/sucursal/${id}`);
    } catch (error) {
      console.error(`Error fetching sucursal ${id}:`, error);
      throw new Error('No se pudo cargar la sucursal');
    }
  },

  createSucursal: async (sucursal: CreateSucursalDTO): Promise<Sucursal> => {
    try {
      return await apiFetch("/sucursals", {
        method: "POST",
        body: JSON.stringify(sucursal),
      });
    } catch (error) {
      console.error('Error creating sucursal:', error);
      throw new Error('No se pudo crear la sucursal');
    }
  },

  updateSucursal: async (id: number, sucursal: Partial<Sucursal>): Promise<Sucursal> => {
    try {
      return await apiFetch(`/sucursal/${id}`, {
        method: "PUT",
        body: JSON.stringify(sucursal),
      });
    } catch (error) {
      console.error(`Error updating sucursal ${id}:`, error);
      throw new Error('No se pudo actualizar la sucursal');
    }
  },

  deleteSucursal: async (id: number): Promise<void> => {
    try {
      await apiFetch(`/sucursal/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(`Error deleting sucursal ${id}:`, error);
      throw new Error('No se pudo eliminar la sucursal');
    }
  },

  // Áreas de Trabajo
  getAreas: async (): Promise<AreaTrabajo[]> => {
    try {
      return await apiFetch("/areas");
    } catch (error) {
      console.error('Error fetching areas:', error);
      throw new Error('No se pudieron cargar las áreas');
    }
  },

  getAreaById: async (id: number): Promise<AreaTrabajo> => {
    try {
      return await apiFetch(`/area/${id}`);
    } catch (error) {
      console.error(`Error fetching area ${id}:`, error);
      throw new Error('No se pudo cargar el área');
    }
  },

  createArea: async (area: CreateAreaDTO): Promise<AreaTrabajo> => {
    try {
      return await apiFetch("/areas", {
        method: "POST",
        body: JSON.stringify(area),
      });
    } catch (error) {
      console.error('Error creating area:', error);
      throw new Error('No se pudo crear el área');
    }
  },

  updateArea: async (id: number, area: Partial<AreaTrabajo>): Promise<AreaTrabajo> => {
    try {
      return await apiFetch(`/area/${id}`, {
        method: "PUT",
        body: JSON.stringify(area),
      });
    } catch (error) {
      console.error(`Error updating area ${id}:`, error);
      throw new Error('No se pudo actualizar el área');
    }
  },

  deleteArea: async (id: number): Promise<void> => {
    try {
      await apiFetch(`/area/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(`Error deleting area ${id}:`, error);
      throw new Error('No se pudo eliminar el área');
    }
  },
};