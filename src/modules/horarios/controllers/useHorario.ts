import { useState, useEffect } from 'react';
import { horarioService, Horario, CreateHorarioDTO } from '../services/horario.service';
import { useSucursal } from '../../sucursales/controllers/useSucursal';

export const useHorario = () => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { areas, loading: loadingAreas } = useSucursal();

  const cargarHorarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await horarioService.getAll();
      setHorarios(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar horarios');
      console.error('Error en useHorario:', err);
    } finally {
      setLoading(false);
    }
  };

  const crearHorario = async (horario: CreateHorarioDTO) => {
    try {
      setError(null);
      const nuevoHorario = await horarioService.create(horario);
      setHorarios(prev => [...prev, nuevoHorario]);
      return nuevoHorario;
    } catch (err: any) {
      setError(err.message || 'Error al crear horario');
      throw err;
    }
  };

  const actualizarHorario = async (id: number, horario: Partial<Horario>) => {
    try {
      setError(null);
      const horarioActualizado = await horarioService.update(id, horario);
      setHorarios(prev => prev.map(h => h.id_horario === id ? horarioActualizado : h));
      return horarioActualizado;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar horario');
      throw err;
    }
  };

  const eliminarHorario = async (id: number) => {
    try {
      setError(null);
      await horarioService.remove(id);
      setHorarios(prev => prev.filter(h => h.id_horario !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar horario');
      throw err;
    }
  };

  const toggleEstadoHorario = async (id: number, estado: number) => {
    return actualizarHorario(id, { estado });
  };

  useEffect(() => {
    cargarHorarios();
  }, []);

  return {
    horarios,
    loading: loading || loadingAreas,
    error,
    areas,
    crearHorario,
    actualizarHorario,
    eliminarHorario,
    toggleEstadoHorario,
    recargarHorarios: cargarHorarios,
  };
};