import { useState, useEffect } from 'react';
import { areaService, AreaTrabajo } from '../services/area.service';

export const useAreas = () => {
  const [areas, setAreas] = useState<AreaTrabajo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarAreas = async () => {
    try {
      setLoading(true);
      setError(null);
      const areasData = await areaService.getAreas();
      setAreas(areasData);
    } catch (err: any) {
      setError(err.message);
      console.error('Error en useAreas:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAreaNombre = (idArea: number): string => {
    const area = areas.find(a => a.id_area === idArea);
    return area ? area.nombre_area : 'N/A';
  };

  useEffect(() => {
    cargarAreas();
  }, []);

  return {
    areas,
    loading,
    error,
    getAreaNombre,
    recargarAreas: cargarAreas,
  };
};