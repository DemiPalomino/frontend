import { useState, useEffect } from 'react';
import { permisoService, Permiso, CreatePermisoDTO } from '../services/permiso.service';

interface UsePermisoProps {
  idPersona?: number; 
}

export const usePermiso = ({ idPersona }: UsePermisoProps = {}) => {
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarPermisos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await permisoService.getAll(idPersona);
      setPermisos(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar permisos');
      console.error('Error en usePermiso:', err);
    } finally {
      setLoading(false);
    }
  };

  const crearPermiso = async (permiso: CreatePermisoDTO) => {
    try {
      setError(null);
      const nuevoPermiso = await permisoService.create(permiso);
      setPermisos(prev => [...prev, nuevoPermiso]);
      return nuevoPermiso;
    } catch (err: any) {
      setError(err.message || 'Error al crear permiso');
      throw err;
    }
  };

  const actualizarPermiso = async (id: number, permiso: Partial<Permiso>) => {
    try {
      setError(null);
      const permisoActualizado = await permisoService.update(id, permiso);
      setPermisos(prev => prev.map(p => p.id_permiso === id ? permisoActualizado : p));
      return permisoActualizado;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar permiso');
      throw err;
    }
  };

  const eliminarPermiso = async (id: number) => {
    try {
      setError(null);
      await permisoService.remove(id);
      setPermisos(prev => prev.filter(p => p.id_permiso !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar permiso');
      throw err;
    }
  };

  const aprobarPermiso = async (id: number) => {
    return actualizarPermiso(id, { estado: 'aprobado' });
  };

  const rechazarPermiso = async (id: number) => {
    return actualizarPermiso(id, { estado: 'rechazado' });
  };

  useEffect(() => {
    cargarPermisos();
  }, [idPersona]);

  return {
    permisos,
    loading,
    error,
    crearPermiso,
    actualizarPermiso,
    eliminarPermiso,
    aprobarPermiso,
    rechazarPermiso,
    recargarPermisos: cargarPermisos,
  };
};