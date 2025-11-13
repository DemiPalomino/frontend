import { useState, useEffect } from 'react';
import { empleadoService, Empleado, CreateEmpleadoDTO } from '../services/empleado.service';

export const useEmpleado = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await empleadoService.getAll();
      setEmpleados(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar empleados');
      console.error('Error en useEmpleado:', err);
    } finally {
      setLoading(false);
    }
  };

  const crearEmpleado = async (empleadoData: CreateEmpleadoDTO) => {
    try {
      setError(null);      
      const empleadoParaBackend = {
        ...empleadoData,        
      };
      const nuevoEmpleado = await empleadoService.create(empleadoParaBackend);
      setEmpleados(prev => [...prev, nuevoEmpleado]);
      return nuevoEmpleado;
    } catch (err: any) {
      setError(err.message || 'Error al crear empleado');
      throw err;
    }
  };

  const actualizarEmpleado = async (id: number, empleado: Partial<Empleado>) => {
    try {
      setError(null);
      const empleadoActualizado = await empleadoService.update(id, empleado);
      setEmpleados(prev => prev.map(emp => 
        emp.id_persona === id ? { ...emp, ...empleadoActualizado } : emp
      ));
      return empleadoActualizado;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar empleado');
      throw err;
    }
  };

  const eliminarEmpleado = async (id: number) => {
    try {
      setError(null);
      await empleadoService.remove(id);
      setEmpleados(prev => prev.filter(emp => emp.id_persona !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar empleado');
      throw err;
    }
  };

  const toggleActivo = async (id: number, activo: boolean) => {
    return actualizarEmpleado(id, { activo });
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  return {
    empleados,
    loading,
    error,
    crearEmpleado,
    actualizarEmpleado,
    eliminarEmpleado,
    toggleActivo,
    recargarEmpleados: cargarEmpleados,
  };
};