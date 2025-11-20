import { apiFetch } from "../../../app/service/api";

export interface Horario {
  id_horario: number;
  nombre_horario: string;
  hora_entrada: string; 
  hora_salida: string;  
  id_area_trabajo: number;
  estado: number;
  nombre_area?: string;
}

export interface CreateHorarioDTO {
  nombre_horario: string;
  hora_entrada: string;  
  hora_salida: string;   
  id_area_trabajo: number;
  estado?: number;
}

export const horarioService = {
  getAll: async (): Promise<Horario[]> => {
    try {
      return await apiFetch("/horarios");
    } catch (error) {
      console.error('Error en horarios:', error);
      throw new Error('No se pudieron cargar los horarios');
    }
  },

  getById: async (id: number): Promise<Horario> => {
    try {
      return await apiFetch(`/horarios/${id}`);
    } catch (error) {
      console.error(`Error en horario ${id}:`, error);
      throw new Error('No se pudo cargar el horario');
    }
  },

  create: async (horario: CreateHorarioDTO): Promise<Horario> => {
    try {
      return await apiFetch("/horarios", {
        method: "POST",
        body: JSON.stringify(horario),
      });
    } catch (error) {
      console.error('Error al crear horario:', error);
      throw new Error('No se pudo crear el horario');
    }
  },

  update: async (id: number, horario: Partial<Horario>): Promise<Horario> => {
    try {
      return await apiFetch(`/horarios/${id}`, {
        method: "PUT",
        body: JSON.stringify(horario),
      });
    } catch (error) {
      console.error(`Error al actualizar horario ${id}:`, error);
      throw new Error('No se pudo actualizar el horario');
    }
  },

  remove: async (id: number): Promise<void> => {
    try {
      await apiFetch(`/horarios/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(`Error al eliminar horario ${id}:`, error);
      throw new Error('No se pudo eliminar el horario');
    }
  },
};