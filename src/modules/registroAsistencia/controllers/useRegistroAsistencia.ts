import { useState, useEffect, useCallback } from 'react';
import { registroAsistenciaService, ResultadoReconocimiento, EmpleadoConDescriptor } from '../services/registroAsistencia.service';

export const useRegistroAsistencia = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ultimoRegistro, setUltimoRegistro] = useState<ResultadoReconocimiento | null>(null);
  const [empleadosConDescriptores, setEmpleadosConDescriptores] = useState<EmpleadoConDescriptor[]>([]);

  const cargarEmpleadosConDescriptores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Cargando empleados con descriptores...');
      
      const empleados = await registroAsistenciaService.obtenerEmpleadosConDescriptores();
      
      console.log(`Cargados ${empleados.length} empleados con descriptores`);
      setEmpleadosConDescriptores(empleados);
      
    } catch (err: any) {
      console.error(' Error cargando empleados:', err);
      setError(err.message || 'Error al cargar lista de empleados');
      setEmpleadosConDescriptores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const registrarAsistenciaFacial = async (id_persona: number) => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await registroAsistenciaService.registrarAsistenciaFacial(id_persona);
      setUltimoRegistro(resultado);
      return resultado;
    } catch (err: any) {
      const errorMsg = err.message || 'Error al registrar asistencia facial';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Función para registrar descriptor facial
  const registrarDescriptorFacial = async (id_persona: number, descriptor: number[]) => {
    try {
      setLoading(true);
      setError(null);
      await registroAsistenciaService.registrarDescriptorFacial(id_persona, descriptor);
      
      await cargarEmpleadosConDescriptores();
    } catch (err: any) {
      const errorMsg = err.message || 'Error al registrar descriptor facial';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const limpiarEstado = () => {
    setUltimoRegistro(null);
    setError(null);
  };

  useEffect(() => {
    cargarEmpleadosConDescriptores();
  }, [cargarEmpleadosConDescriptores]);

  return {
    loading,
    error,
    ultimoRegistro,
    empleadosConDescriptores,
    registrarAsistenciaFacial,
    registrarDescriptorFacial, 
    limpiarEstado,
    recargarEmpleados: cargarEmpleadosConDescriptores
  };
};