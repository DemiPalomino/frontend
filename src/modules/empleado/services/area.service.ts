import { apiFetch } from "../../../app/service/api";

export interface AreaTrabajo {
  id_area: number;
  nombre_area: string;
  descripcion: string;
  id_sucursal: number;
  nombre_sucursal?: string;
}

export const areaService = {
  getAreas: async (): Promise<AreaTrabajo[]> => {
    try {
      return await apiFetch("/areas");
    } catch (error) {
      console.error('Error en areas:', error);
      throw new Error('No se pudieron cargar las áreas de trabajo');
    }
  },

  getAreaById: async (id: number): Promise<AreaTrabajo> => {
    try {
      return await apiFetch(`/areas/${id}`);
    } catch (error) {
      console.error(`Error en area ${id}:`, error);
      throw new Error('No se pudo cargar el área de trabajo');
    }
  }
};