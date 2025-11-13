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
      console.log('✅ Modelos ya cargados');
      return true;
    }

    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      const MODEL_URL = '/models';
      console.log('🔄 Iniciando carga de modelos de reconocimiento facial...');

   
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
          progress: 100
        }
      ];

      for (let i = 0; i < models.length; i++) {
        console.log(`📦 Cargando ${models[i].name}...`);
        await models[i].loader();
        setProgress(models[i].progress);
        console.log(`✅ ${models[i].name} cargado correctamente`);
      }

      console.log('🎉 Todos los modelos cargados exitosamente');
      modelsLoadedRef.current = true;
      setModelsLoaded(true);
      return true;

    } catch (err: any) {
      console.error('❌ Error crítico cargando modelos:', err);

      let errorMessage = 'Error al cargar los modelos de reconocimiento facial';

      if (err.message?.includes('404') || err.message?.includes('No se pueden acceder')) {
        errorMessage = 'Error: No se pueden cargar los modelos de IA. Verifica la estructura de archivos.';
      } else if (err.message?.includes('Failed to fetch')) {
        errorMessage = 'Error de red al cargar modelos. Verifica tu conexión a internet.';
      } else if (err.name === 'TypeError') {
        errorMessage = 'Error de tipo al cargar modelos. Los archivos podrían estar corruptos.';
      }

      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const detectFaces = async (videoElement: HTMLVideoElement): Promise<FaceDetectionResult[]> => {
    if (!modelsLoadedRef.current) {
      throw new Error('Modelos de reconocimiento facial no cargados. Ejecuta loadModels() primero.');
    }

    try {
      // Configurar opciones de detección
      const detectionOptions = new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.5
      });

      console.log('🔍 Iniciando detección facial...');
      const detections = await faceapi
        .detectAllFaces(videoElement, detectionOptions)
        .withFaceLandmarks()
        .withFaceDescriptors();

      console.log(`✅ Se detectaron ${detections.length} rostros`);

      return detections.map((detection: { detection: any; landmarks: any; descriptor: any; }) => ({
        detection: detection.detection,
        landmarks: detection.landmarks,
        descriptor: detection.descriptor
      }));
    } catch (error) {
      console.error('❌ Error en detección facial:', error);

      
      let errorMessage = 'Error al detectar rostros';
      if (error instanceof Error) {
        errorMessage = `Error al detectar rostros: ${error.message}`;
      } else if (typeof error === 'string') {
        errorMessage = `Error al detectar rostros: ${error}`;
      }

      throw new Error(errorMessage);
    }
  };

  const recognizeFace = async (
    inputDescriptor: Float32Array,
    empleados: Array<{ id: number, descriptor: Float32Array }>,
    threshold: number = 0.6
  ) => {
    try {
      let mejorSimilitud = 0;
      let empleadoReconocido = null;

      for (const empleado of empleados) {
        const similitud = await faceapi.euclideanDistance(
          inputDescriptor,
          empleado.descriptor
        );

        console.log(`🔍 Comparando con empleado ${empleado.id}: ${similitud}`);

        if (similitud < threshold && similitud > mejorSimilitud) {
          mejorSimilitud = similitud;
          empleadoReconocido = empleado;
        }
      }

      return empleadoReconocido ? {
        id: empleadoReconocido.id,
        similitud: mejorSimilitud
      } : null;
    } catch (error) {
      console.error('Error en reconocimiento:', error);
      return null;
    }
  };

  
  useEffect(() => {
    console.log('🚀 Precargando modelos de face-api.js...');
    loadModels().then(success => {
      if (success) {
        console.log('🎉 Precarga de modelos completada');
      } else {
        console.error('❌ Falló la precarga de modelos');
      }
    });
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