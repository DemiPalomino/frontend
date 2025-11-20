// src/modules/sucursales/services/sucursal.service.ts - CORREGIDO
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
  id_sucursal: number;
  
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

}

export const sucursalService = {

  getSucursales: async (): Promise<Sucursal[]> => {
    try {
      return await apiFetch("/sucursales");  
    } catch (error) {
      console.error('Error en sucursales:', error);
      throw new Error('No se pudieron cargar las sucursales');
    }
  },

  getSucursalById: async (id: number): Promise<Sucursal> => {
    try {
      return await apiFetch(`/sucursales/${id}`); 
    } catch (error) {
      console.error(`Error en sucursal ${id}:`, error);
      throw new Error('No se pudo cargar la sucursal');
    }
  },

  createSucursal: async (sucursal: CreateSucursalDTO): Promise<Sucursal> => {
    try {
      return await apiFetch("/sucursales", { 
        method: "POST",
        body: JSON.stringify(sucursal),
      });
    } catch (error) {
      console.error('Error al crear sucursal:', error);
      throw new Error('No se pudo crear la sucursal');
    }
  },

  updateSucursal: async (id: number, sucursal: Partial<Sucursal>): Promise<Sucursal> => {
    try {
      return await apiFetch(`/sucursales/${id}`, { 
        method: "PUT",
        body: JSON.stringify(sucursal),
      });
    } catch (error) {
      console.error(`Error al actualizar sucursal ${id}:`, error);
      throw new Error('No se pudo actualizar la sucursal');
    }
  },

  deleteSucursal: async (id: number): Promise<void> => {
    try {
      await apiFetch(`/sucursales/${id}`, { 
        method: "DELETE",
      });
    } catch (error) {
      console.error(`Error al eliminar sucursal ${id}:`, error);
      throw new Error('No se pudo eliminar la sucursal');
    }
  },


  getAreas: async (): Promise<AreaTrabajo[]> => {
    try {
      return await apiFetch("/areas"); 
    } catch (error) {
      console.error('Error en areas:', error);
      throw new Error('No se pudieron cargar las áreas');
    }
  },

  getAreaById: async (id: number): Promise<AreaTrabajo> => {
    try {
      return await apiFetch(`/areas/${id}`);  
    } catch (error) {
      console.error(`Error en area ${id}:`, error);
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
      console.error('Error al crear area:', error);
      throw new Error('No se pudo crear el área');
    }
  },

  updateArea: async (id: number, area: Partial<AreaTrabajo>): Promise<AreaTrabajo> => {
    try {
      return await apiFetch(`/areas/${id}`, {  
        method: "PUT",
        body: JSON.stringify(area),
      });
    } catch (error) {
      console.error(`Error al actualizar area ${id}:`, error);
      throw new Error('No se pudo actualizar el área');
    }
  },

  deleteArea: async (id: number): Promise<void> => {
    try {
      await apiFetch(`/areas/${id}`, {  
        method: "DELETE",
      });
    } catch (error) {
      console.error(`Error al eliminar area ${id}:`, error);
      throw new Error('No se pudo eliminar el área');
    }
  },
};