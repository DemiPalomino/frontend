import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useFaceApi } from '../../../hooks/useFaceApi';
import { apiFetch } from '../../../app/service/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Badge } from '../../../components/ui/badge';
import { Camera, CameraOff, CheckCircle, AlertCircle, Loader2, User } from 'lucide-react';

interface RecognitionResult {
  success: boolean;
  tipo: 'entrada' | 'salida';
  persona: {
    id_persona: number;
    nombres: string;
    apellidos: string;
    dni: string;
  };
  mensaje: string;
  fecha_ingreso?: string;
  fecha_salida?: string;
  miniTardanza?: number;
  similitud: number;
}

export const FaceRecognitionAttendance: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { modelsLoaded, loading: modelsLoading, detectFaces } = useFaceApi();
  
  const [cameraActive, setCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<RecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);

  // Iniciar cámara
  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setError(null);
        setLastResult(null);
      }
    } catch (error) {
      console.error('Error accediendo a la cámara:', error);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  }, []);

  // Detener cámara
  const stopCamera = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
    setIsRecognizing(false);
  }, []);

  // Procesar frame para reconocimiento
  const processFrame = useCallback(async () => {
    if (!videoRef.current || !modelsLoaded || isProcessing) return;

    setIsProcessing(true);

    try {
      const faces = await detectFaces(videoRef.current);
      
      if (faces.length === 0) {
        setIsRecognizing(false);
        return;
      }

      if (faces.length > 1) {
        setError('Múltiples rostros detectados. Solo una persona debe estar en cámara.');
        setIsRecognizing(false);
        return;
      }

      setIsRecognizing(true);
      const face = faces[0];
      
      // Enviar descriptor al backend para reconocimiento
      const descriptorArray = Array.from(face.descriptor);
      
      const resultado = await apiFetch('/asistencias/reconocer-facial', {
        method: 'POST',
        body: JSON.stringify({
          descriptor: descriptorArray
        }),
      });

      setLastResult(resultado);
      setError(null);

      // Esperar 3 segundos antes de permitir otro reconocimiento
      setTimeout(() => {
        setLastResult(null);
      }, 3000);

    } catch (error: any) {
      console.error('Error en reconocimiento:', error);
      setError(error.message || 'Error en el reconocimiento facial');
      setIsRecognizing(false);
    } finally {
      setIsProcessing(false);
    }
  }, [modelsLoaded, isProcessing, detectFaces]);

  // Iniciar/detener reconocimiento automático
  useEffect(() => {
    if (cameraActive && modelsLoaded) {
      detectionIntervalRef.current = setInterval(processFrame, 2000); // Procesar cada 2 segundos
    } else {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    }

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [cameraActive, modelsLoaded, processFrame]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Reconocimiento Facial en Tiempo Real
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
          {cameraActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
              <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" style={{ display: 'none' }} />
              
              {/* Overlay de estado */}
              <div className="absolute top-4 left-4 right-4">
                {isRecognizing && (
                  <Badge className="bg-blue-500 text-white">
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    Reconociendo...
                  </Badge>
                )}
              </div>

              {/* Indicador de reconocimiento */}
              {lastResult && (
                <div className={`absolute inset-0 border-4 ${
                  lastResult.success 
                    ? 'border-green-500 bg-green-500 bg-opacity-20' 
                    : 'border-red-500 bg-red-500 bg-opacity-20'
                } transition-all duration-300`}>
                  <div className="absolute top-4 right-4">
                    {lastResult.success ? (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4">
              <CameraOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-center">Cámara desactivada</p>
            </div>
          )}
        </div>

        {/* Resultado del reconocimiento */}
        {lastResult && (
          <Alert className={lastResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
            {lastResult.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={lastResult.success ? "text-green-800" : "text-red-800"}>
              <div className="font-semibold">
                {lastResult.success ? (
                  <>
                    ¡Hola {lastResult.persona.nombres} {lastResult.persona.apellidos}!
                  </>
                ) : (
                  'No reconocido'
                )}
              </div>
              <div className="text-sm mt-1">
                {lastResult.mensaje} 
                {lastResult.similitud && (
                  <span className="ml-2 text-xs opacity-75">
                    (similitud: {lastResult.similitud.toFixed(3)})
                  </span>
                )}
              </div>
              {lastResult.miniTardanza && lastResult.miniTardanza > 0 && (
                <div className="text-sm font-medium text-amber-600 mt-1">
                  Tardanza: {lastResult.miniTardanza} minutos
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          {!cameraActive ? (
            <Button
              onClick={startCamera}
              disabled={modelsLoading}
              className="flex-1"
            >
              {modelsLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cargando IA...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Iniciar Reconocimiento
                </>
              )}
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="outline" className="flex-1">
              <CameraOff className="w-4 h-4 mr-2" />
              Detener Reconocimiento
            </Button>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-medium text-blue-800 mb-2 text-sm">Estado del Sistema</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                cameraActive ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              <span>Cámara: {cameraActive ? 'Activa' : 'Inactiva'}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                modelsLoaded ? 'bg-green-500' : modelsLoading ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span>IA: {modelsLoaded ? 'Lista' : modelsLoading ? 'Cargando...' : 'No cargada'}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isRecognizing ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
              }`}></div>
              <span>Reconocimiento: {isRecognizing ? 'Activo' : 'Inactivo'}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                lastResult ? (lastResult.success ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-400'
              }`}></div>
              <span>Estado: {lastResult ? (lastResult.success ? 'Reconocido' : 'Error') : 'Esperando'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};