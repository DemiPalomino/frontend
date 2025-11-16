import { useState, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { useFaceApi } from '../../../hooks/useFaceApi';
import { apiFetch } from '../../../app/service/api';

export interface FaceRegistrationResult {
  success: boolean;
  message: string;
  descriptor?: number[];
}

export const useFaceRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<'detecting' | 'extracting' | 'saving' | null>(null);
  
  const { modelsLoaded, detectFaces } = useFaceApi();

  const registerFace = async (videoElement: HTMLVideoElement, id_persona: number): Promise<FaceRegistrationResult> => {
    if (!modelsLoaded) {
      throw new Error('Modelos de IA no cargados');
    }

    setLoading(true);
    setError(null);

    try {
      setProgress('detecting');
      
      // Detectar rostros
      const faces = await detectFaces(videoElement);
      
      if (faces.length === 0) {
        throw new Error('No se detectó ningún rostro. Asegúrate de estar frente a la cámara con buena iluminación.');
      }

      if (faces.length > 1) {
        throw new Error('Se detectó más de un rostro. Por favor, asegúrate de que solo una persona esté en cámara.');
      }

      const face = faces[0];
      
      setProgress('extracting');
      
      // El descriptor ya está extraído por detectFaces
      const descriptor = face.descriptor;
      
      setProgress('saving');
      
      // Registrar descriptor en el backend
      const response = await apiFetch(`/personas/${id_persona}/descriptor`, {
        method: 'POST',
        body: JSON.stringify({
          descriptor: Array.from(descriptor) // Convertir Float32Array a array normal
        }),
      });

      setProgress(null);
      
      return {
        success: true,
        message: 'Rostro registrado exitosamente',
        descriptor: Array.from(descriptor)
      };

    } catch (error: any) {
      setProgress(null);
      setError(error.message);
      
      return {
        success: false,
        message: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    progress,
    registerFace,
    modelsLoaded
  };
};