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
    if (modelsLoadedRef.current) {
      console.log('Modelos ya cargados');
      return true;
    }

    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      const MODEL_URL = '/models';
      console.log('Iniciando carga de modelos de reconocimiento facial...');
      // Verifica que los modelos existen
      try {
        const response = await fetch(MODEL_URL);
        if (!response.ok) {
          throw new Error('No se pueden cargar los modelos. Verifica que la carpeta /models exista en public/');
        }
      } catch (err) {
        throw new Error('Error accediendo a los modelos. Asegúrate de que los archivos de modelos estén en public/models/');
      }

      const models = [
        {
          name: 'SSD MobilenetV1',
          loader: () => faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          progress: 25
        },
        {
          name: 'Face Landmark 68',
          loader: () => faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          progress: 50
        },
        {
          name: 'Face Recognition',
          loader: () => faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          progress: 75
        }
      ];

      for (let i = 0; i < models.length; i++) {
        console.log(`Cargando ${models[i].name}...`);
        await models[i].loader();
        setProgress(models[i].progress);
        console.log(`${models[i].name} cargado correctamente`);
      }

      console.log('Todos los modelos cargados exitosamente');
      modelsLoadedRef.current = true;
      setModelsLoaded(true);
      setProgress(100);
      return true;

    } catch (err: any) {
      console.error('Error detallado:', err);
      let errorMessage = 'Error al cargar los modelos de reconocimiento facial';

      if (err.message?.includes('404') || err.message?.includes('cargar los modelos')) {
        errorMessage = 'Error: No se pueden cargar los modelos de IA. Verifica que la carpeta /public/models exista y contenga los archivos necesarios.';
      } else if (err.message?.includes('fetch')) {
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
      const detectionOptions = new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.5
      });

      const detections = await faceapi
        .detectAllFaces(videoElement, detectionOptions)
        .withFaceLandmarks()
        .withFaceDescriptors();

      console.log(`Se detectaron ${detections.length} rostros`);

      return detections.map((detection: any) => ({
        detection: detection.detection,
        landmarks: detection.landmarks,
        descriptor: detection.descriptor
      }));
    } catch (error) {
      console.error('Error en detección facial:', error);
      throw new Error(`Error al detectar rostros: ${error}`);
    }
  };

  useEffect(() => {
    console.log('Precargando modelos de face-api.js...');
    loadModels().then(success => {
      if (success) {
        console.log('Precarga de modelos completada');
      } else {
        console.error('Falló la precarga de modelos');
      }
    });
  }, []);

  return {
    modelsLoaded: modelsLoadedRef.current,
    loading,
    error,
    progress,
    loadModels,
    detectFaces
  };
};