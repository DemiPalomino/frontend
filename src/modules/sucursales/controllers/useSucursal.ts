import { useState, useEffect } from 'react';
import { sucursalService, Sucursal, AreaTrabajo } from '../services/sucursal.service';

export const useSucursal = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [areas, setAreas] = useState<AreaTrabajo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [sucursalesData, areasData] = await Promise.all([
        sucursalService.getSucursales(),
        sucursalService.getAreas()
      ]);
      setSucursales(sucursalesData);
      setAreas(areasData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Operaciones de Sucursales
  const crearSucursal = async (sucursal: Omit<Sucursal, 'id_sucursal'>) => {
    try {
      const nuevaSucursal = await sucursalService.createSucursal(sucursal);
      setSucursales(prev => [...prev, nuevaSucursal]);
      return nuevaSucursal;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const actualizarSucursal = async (id: number, sucursal: Partial<Sucursal>) => {
    try {
      const sucursalActualizada = await sucursalService.updateSucursal(id, sucursal);
      setSucursales(prev => prev.map(s => s.id_sucursal === id ? sucursalActualizada : s));
      return sucursalActualizada;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const eliminarSucursal = async (id: number) => {
    try {
      await sucursalService.deleteSucursal(id);
      setSucursales(prev => prev.filter(s => s.id_sucursal !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Operaciones de Áreas
  const crearArea = async (area: Omit<AreaTrabajo, 'id_area'>) => {
    try {
      const nuevaArea = await sucursalService.createArea(area);
      setAreas(prev => [...prev, nuevaArea]);
      return nuevaArea;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

 // En useSucursal.ts - Mejorar la función de actualización
const actualizarArea = async (id: number, area: Partial<AreaTrabajo>) => {
  try {
    // ✅ Asegurar que los datos estén completos
    const datosCompletos = {
      nombre_area: area.nombre_area || '',
      descripcion: area.descripcion || '',
      id_sucursal: area.id_sucursal || 0
    };
    
    const areaActualizada = await sucursalService.updateArea(id, datosCompletos);
    setAreas(prev => prev.map(a => a.id_area === id ? areaActualizada : a));
    return areaActualizada;
  } catch (err: any) {
    setError(err.message);
    throw err;
  }
};

  const eliminarArea = async (id: number) => {
    try {
      await sucursalService.deleteArea(id);
      setAreas(prev => prev.filter(a => a.id_area !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Helper functions
  const getAreasPorSucursal = (idSucursal: number) => {
    return areas.filter(area => area.id_sucursal === idSucursal);
  };

  const getSucursalNombre = (idSucursal: number) => {
    const sucursal = sucursales.find(s => s.id_sucursal === idSucursal);
    return sucursal ? sucursal.nombre_sucursal : 'N/A';
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return {
    sucursales,
    areas,
    loading,
    error,
    crearSucursal,
    actualizarSucursal,
    eliminarSucursal,
    crearArea,
    actualizarArea,
    eliminarArea,
    getAreasPorSucursal,
    getSucursalNombre,
    recargarDatos: cargarDatos,
  };
};