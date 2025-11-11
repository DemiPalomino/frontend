import { apiFetch } from "../../../app/service/api";

export interface Horario {
  id_horario: number;
  nombre_horario: string;
  hora_entrada: string;  // ✅ CAMBIADO: de fecha_inicio a hora_entrada
  hora_salida: string;   // ✅ CAMBIADO: de fecha_fin a hora_salida
  id_area_trabajo: number;
  estado: number;
  nombre_area?: string;
}

export interface CreateHorarioDTO {
  nombre_horario: string;
  hora_entrada: string;  // ✅ CAMBIADO
  hora_salida: string;   // ✅ CAMBIADO
  id_area_trabajo: number;
  estado?: number;
}

export const horarioService = {
  getAll: async (): Promise<Horario[]> => {
    try {
      return await apiFetch("/horarios");
    } catch (error) {
      console.error('Error fetching horarios:', error);
      throw new Error('No se pudieron cargar los horarios');
    }
  },

  getById: async (id: number): Promise<Horario> => {
    try {
      return await apiFetch(`/horarios/${id}`);
    } catch (error) {
      console.error(`Error fetching horario ${id}:`, error);
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
      console.error('Error creating horario:', error);
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
      console.error(`Error updating horario ${id}:`, error);
      throw new Error('No se pudo actualizar el horario');
    }
  },

  remove: async (id: number): Promise<void> => {
    try {
      await apiFetch(`/horarios/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(`Error deleting horario ${id}:`, error);
      throw new Error('No se pudo eliminar el horario');
    }
  },
};