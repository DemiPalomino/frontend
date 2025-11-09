import { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

export interface FaceDetectionResult {
  detection: faceapi.FaceDetection;
  landmarks: faceapi.FaceLandmarks68;
  descriptor: Float32Array;
}

export const useFaceApi = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  const modelsLoadedRef = useRef(false);

  const loadModels = async (): Promise<boolean> => {
    if (modelsLoadedRef.current) return true;

    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      const MODEL_URL = '/models';
      console.log('🔄 Cargando modelos de reconocimiento facial...');

      // Cargar modelos secuencialmente con progreso
      const models = [
        { name: 'SSD MobilenetV1', loader: () => faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL) },
        { name: 'Face Landmark 68', loader: () => faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL) },
        { name: 'Face Recognition', loader: () => faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL) }
      ];

      for (let i = 0; i < models.length; i++) {
        console.log(`📦 Cargando ${models[i].name}...`);
        await models[i].loader();
        setProgress(Math.round(((i + 1) / models.length) * 100));
      }

      console.log('✅ Todos los modelos cargados exitosamente');
      modelsLoadedRef.current = true;
      setModelsLoaded(true);
      return true;

    } catch (err: any) {
      console.error('❌ Error cargando modelos:', err);
      
      let errorMessage = 'Error al cargar los modelos de reconocimiento facial';
      
      if (err.message.includes('404')) {
        errorMessage = 'Modelos no encontrados. Verifica que los archivos estén en public/models/';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Error de red al cargar modelos. Verifica tu conexión.';
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const detectFaces = async (videoElement: HTMLVideoElement): Promise<FaceDetectionResult[]> => {
    if (!modelsLoadedRef.current) {
      throw new Error('Modelos de reconocimiento facial no cargados');
    }

    try {
      const detections = await faceapi
        .detectAllFaces(videoElement)
        .withFaceLandmarks()
        .withFaceDescriptors();

      return detections.map(detection => ({
        detection: detection.detection,
        landmarks: detection.landmarks,
        descriptor: detection.descriptor
      }));
    } catch (error) {
      console.error('❌ Error en detección facial:', error);
      throw new Error('Error al detectar rostros');
    }
  };

  const recognizeFace = async (descriptor: Float32Array, knownDescriptors: Float32Array[], threshold: number = 0.6): Promise<number | null> => {
    if (!knownDescriptors.length) return null;

    let bestMatch = {
      index: -1,
      distance: Number.MAX_VALUE
    };

    knownDescriptors.forEach((knownDescriptor, index) => {
      const distance = faceapi.euclideanDistance(descriptor, knownDescriptor);
      if (distance < bestMatch.distance) {
        bestMatch = { index, distance };
      }
    });

    return bestMatch.distance < threshold ? bestMatch.index : null;
  };

  useEffect(() => {
    // Precargar modelos al montar el hook
    loadModels();
  }, []);

  return {
    modelsLoaded: modelsLoadedRef.current,
    loading,
    error,
    progress,
    loadModels,
    detectFaces,
    recognizeFace
  };
};