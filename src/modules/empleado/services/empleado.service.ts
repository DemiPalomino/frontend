import { apiFetch } from "../../../app/service/api";

export interface Empleado {
  id_persona: number;
  dni: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  fecha_ingreso: string;
  id_area_trabajo: number;
  activo: boolean;
  imagen?: string;
  nombre_area?: string;
}

export interface CreateEmpleadoDTO {
  dni: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string; // ✅ Cambiado de 'phone' a 'telefono'
  fecha_nacimiento: string; // ✅ Cambiado de 'fecha_nace' a 'fecha_nacimiento'
  id_area_trabajo: number; // ✅ Cambiado de 'id_area' a 'id_area_trabajo'
}

export const empleadoService = {
  getAll: async (): Promise<Empleado[]> => {
    try {
      return await apiFetch("/personas");
    } catch (error) {
      console.error('Error fetching empleados:', error);
      throw new Error('No se pudieron cargar los empleados');
    }
  },

  getById: async (id: number): Promise<Empleado> => {
    try {
      return await apiFetch(`/personas/${id}`); // ✅ Corregido: /personas/ en lugar de /persona/
    } catch (error) {
      console.error(`Error fetching empleado ${id}:`, error);
      throw new Error('No se pudo cargar el empleado');
    }
  },

  create: async (empleado: CreateEmpleadoDTO): Promise<Empleado> => {
    try {
      return await apiFetch("/personas", {
        method: "POST",
        body: JSON.stringify(empleado),
      });
    } catch (error) {
      console.error('Error creating empleado:', error);
      throw new Error('No se pudo crear el empleado');
    }
  },

  update: async (id: number, empleado: Partial<Empleado>): Promise<Empleado> => {
    try {
      return await apiFetch(`/personas/${id}`, { // ✅ Corregido: /personas/ en lugar de /persona/
        method: "PUT",
        body: JSON.stringify(empleado),
      });
    } catch (error) {
      console.error(`Error updating empleado ${id}:`, error);
      throw new Error('No se pudo actualizar el empleado');
    }
  },

  remove: async (id: number): Promise<void> => {
    try {
      await apiFetch(`/personas/${id}`, { // ✅ Corregido: /personas/ en lugar de /persona/
        method: "DELETE",
      });
    } catch (error) {
      console.error(`Error deleting empleado ${id}:`, error);
      throw new Error('No se pudo eliminar el empleado');
    }
  },
};