import React, { useRef, useEffect, useState } from 'react';
import { useFaceRegistration } from '../controllers/useFaceRegistration';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Camera, CameraOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FaceRegistrationModalProps {
  id_persona: number;
  nombres: string;
  apellidos: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const FaceRegistrationModal: React.FC<FaceRegistrationModalProps> = ({
  id_persona,
  nombres,
  apellidos,
  onSuccess,
  onClose
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [cameraActive, setCameraActive] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<{success: boolean; message: string} | null>(null);
  
  const { loading, error, progress, registerFace, modelsLoaded } = useFaceRegistration();

  const startCamera = async () => {
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
        setRegistrationResult(null);
      }
    } catch (error) {
      console.error('Error accediendo a la cámara:', error);
      alert('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleRegisterFace = async () => {
    if (!videoRef.current) return;

    const result = await registerFace(videoRef.current, id_persona);
    setRegistrationResult(result);

    if (result.success) {
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Registrar Rostro - {nombres} {apellidos}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {registrationResult && (
            <Alert variant={registrationResult.success ? "default" : "destructive"} className={registrationResult.success ? "bg-green-50 border-green-200" : ""}>
              {registrationResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription className={registrationResult.success ? "text-green-800" : ""}>
                {registrationResult.message}
              </AlertDescription>
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
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <CameraOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-center">Cámara desactivada</p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Instrucciones:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Posiciónate frente a la cámara a 30-50 cm de distancia</li>
              <li>• Asegura buena iluminación frontal</li>
              <li>• Mantén el rostro visible sin obstrucciones</li>
              <li>• Permanece inmóvil durante el registro</li>
            </ul>
          </div>

          {progress && (
            <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span className="text-sm">
                {progress === 'detecting' && 'Detectando rostro...'}
                {progress === 'extracting' && 'Extrayendo descriptor facial...'}
                {progress === 'saving' && 'Guardando en base de datos...'}
              </span>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            {!cameraActive ? (
              <Button onClick={startCamera} disabled={!modelsLoaded}>
                {modelsLoaded ? (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Iniciar Cámara
                  </>
                ) : (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cargando Modelos...
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleRegisterFace}
                  disabled={loading}
                  variant="default"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    'Registrar Rostro'
                  )}
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  <CameraOff className="w-4 h-4 mr-2" />
                  Detener Cámara
                </Button>
              </>
            )}
            <Button onClick={onClose} variant="outline">
              Cerrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};