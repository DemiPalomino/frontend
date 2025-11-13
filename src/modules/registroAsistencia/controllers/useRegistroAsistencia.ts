import { useState } from 'react';
import { registroAsistenciaService, ResultadoReconocimiento } from '../services/registroAsistencia.service';

export const useRegistroAsistencia = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ultimoRegistro, setUltimoRegistro] = useState<ResultadoReconocimiento | null>(null);

  const registrarAsistenciaFacial = async (id_persona: number) => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await registroAsistenciaService.registrarAsistenciaFacial(id_persona);
      setUltimoRegistro(resultado);
      return resultado;
    } catch (err: any) {
      setError(err.message || 'Error al registrar asistencia facial');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const verificarRostro = async (descriptor: number[]) => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await registroAsistenciaService.verificarRostro(descriptor);
      return resultado;
    } catch (err: any) {
      setError(err.message || 'Error al verificar rostro');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registrarRostro = async (id_persona: number, descriptor: number[]) => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await registroAsistenciaService.registrarDescriptorFacial(id_persona, descriptor);
      return resultado;
    } catch (err: any) {
      setError(err.message || 'Error al registrar rostro');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const limpiarEstado = () => {
    setUltimoRegistro(null);
    setError(null);
  };

  return {
    loading,
    error,
    ultimoRegistro,
    registrarAsistenciaFacial,  
    verificarRostro,
    registrarRostro,
    limpiarEstado,
  };
};