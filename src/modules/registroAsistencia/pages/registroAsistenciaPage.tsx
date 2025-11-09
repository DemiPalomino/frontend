import React, { useState, useRef, useEffect } from 'react';
import { useRegistroAsistencia } from '../controllers/useRegistroAsistencia';
import { useFaceApi } from '../../../hooks/useFaceApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Camera, CameraOff, User, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export const RegistroAsistenciaPage: React.FC = () => {
  const { 
    loading: registroLoading, 
    error: registroError, 
    ultimoRegistro, 
    registrarAsistenciaManual,
    limpiarEstado 
  } = useRegistroAsistencia();

  const {
    modelsLoaded,
    loading: modelsLoading,
    error: faceError,
    progress,
    loadModels,
    detectFaces,
    recognizeFace
  } = useFaceApi();

  const [cameraActive, setCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);
  const [descriptoresEmpleados, setDescriptoresEmpleados] = useState<Float32Array[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cargar descriptores de empleados al montar
  useEffect(() => {
    // En una implementación real, esto cargaría desde el backend
    // Por ahora simulamos algunos descriptores
    const cargarDescriptores = async () => {
      // Simular carga de descriptores
      console.log('📥 Cargando descriptores de empleados...');
    };
    
    cargarDescriptores();
  }, []);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('getUserMedia no es soportado en este navegador');
      }

      // Asegurar que los modelos estén cargados
      if (!modelsLoaded) {
        const loaded = await loadModels();
        if (!loaded) {
          throw new Error('No se pudieron cargar los modelos de reconocimiento facial');
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setScanResult(null);
        limpiarEstado();
      }
    } catch (error: any) {
      console.error('❌ Error accediendo a la cámara:', error);
      
      let errorMessage = 'No se pudo acceder a la cámara.';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Permisos de cámara denegados. Por favor, permite el acceso a la cámara.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No se encontró ninguna cámara conectada.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Tu navegador no soporta acceso a la cámara.';
      }
      
      alert(errorMessage);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setIsScanning(false);
    setScanResult(null);
  };

  const scanFace = async () => {
    if (!videoRef.current || !modelsLoaded) {
      alert('Cámara o modelos no listos');
      return;
    }

    setIsScanning(true);
    setScanResult(null);

    try {
      // Detectar rostros en el video
      const faces = await detectFaces(videoRef.current);
      
      if (faces.length === 0) {
        setScanResult('error');
        alert('No se detectó ningún rostro. Por favor, colócate frente a la cámara.');
        return;
      }

      if (faces.length > 1) {
        setScanResult('error');
        alert('Se detectó más de un rostro. Por favor, asegúrate de que solo una persona esté en cámara.');
        return;
      }

      const face = faces[0];
      
      // En una implementación real, aquí compararíamos con la base de datos
      // Por ahora simulamos reconocimiento de un empleado aleatorio
      const randomEmployeeId = Math.floor(Math.random() * 4) + 1;
      
      // Registrar asistencia
      await registrarAsistenciaFacial(randomEmployeeId);
      setScanResult('success');
      
    } catch (error) {
      console.error('❌ Error en escaneo facial:', error);
      setScanResult('error');
      alert('Error durante el reconocimiento facial. Intenta nuevamente.');
    } finally {
      setIsScanning(false);
    }
  };

  const registrarAsistenciaFacial = async (id_persona: number) => {
    // En implementación real, esto llamaría al servicio
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date();
        const resultado = {
          tipo: Math.random() > 0.5 ? 'entrada' : 'salida' as 'entrada' | 'salida',
          id_asistencia: Math.floor(Math.random() * 1000),
          fecha_ingreso: now.toISOString(),
          miniTardanza: Math.random() > 0.7 ? Math.floor(Math.random() * 30) : 0,
          mensaje: Math.random() > 0.5 ? 'Entrada registrada' : 'Salida registrada',
          persona: {
            id_persona,
            nombres: ['Juan Carlos', 'María Elena', 'Carlos Alberto', 'Ana Patricia'][id_persona - 1],
            apellidos: ['García López', 'Rodríguez Silva', 'Mendoza Cruz', 'Flores Vásquez'][id_persona - 1],
            dni: ['12345678', '87654321', '11223344', '55667788'][id_persona - 1],
          }
        };
        resolve(resultado);
      }, 1000);
    });
  };

  const handleManualRegister = async () => {
    try {
      const randomEmployeeId = Math.floor(Math.random() * 4) + 1;
      await registrarAsistenciaManual(randomEmployeeId);
    } catch (error) {
      console.error('❌ Error en registro manual:', error);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Registro de Asistencia</h1>
        <p className="text-gray-600">Sistema de reconocimiento facial para control de entrada y salida</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Reconocimiento Facial
              {modelsLoading && (
                <Badge variant="outline" className="ml-2">
                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  {progress}%
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {faceError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{faceError}</AlertDescription>
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
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="absolute top-0 left-0" style={{ display: 'none' }} />
                  
                  {isScanning && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                          <span className="font-medium">Reconociendo rostro...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {scanResult === 'success' && (
                    <div className="absolute top-4 left-4 right-4">
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          ¡Reconocimiento exitoso! Asistencia registrada.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                  
                  {scanResult === 'error' && (
                    <div className="absolute top-4 left-4 right-4">
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Error en el reconocimiento. Intente nuevamente.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <CameraOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Cámara desactivada</p>
                    {!modelsLoaded && !modelsLoading && (
                      <Button onClick={loadModels} className="mt-2" variant="outline">
                        Cargar Modelos
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {!cameraActive ? (
                <Button 
                  onClick={startCamera} 
                  className="flex-1"
                  disabled={modelsLoading}
                >
                  {modelsLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Cargando modelos...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Iniciar Cámara
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={scanFace} 
                    disabled={isScanning || !modelsLoaded}
                    className="flex-1"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Escaneando...
                      </>
                    ) : (
                      'Escanear Rostro'
                    )}
                  </Button>
                  <Button onClick={stopCamera} variant="outline">
                    <CameraOff className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            <div className="border-t pt-4">
              <Button 
                onClick={handleManualRegister} 
                variant="outline" 
                className="w-full"
                disabled={registroLoading}
              >
                <User className="w-4 h-4 mr-2" />
                {registroLoading ? 'Registrando...' : 'Registro Manual'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status and Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Hora Actual</p>
                <p className="font-semibold">{new Date().toLocaleTimeString('es-ES')}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Camera className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Estado Cámara</p>
                <Badge variant={cameraActive ? "secondary" : "outline"}>
                  {cameraActive ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
            </div>

            {registroError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{registroError}</AlertDescription>
              </Alert>
            )}

            {ultimoRegistro && (
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Último Registro</h3>
                <div className={`border rounded-lg p-4 ${
                  ultimoRegistro.tipo === 'entrada' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      ultimoRegistro.tipo === 'entrada' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {ultimoRegistro.tipo === 'entrada' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {ultimoRegistro.persona?.nombres} {ultimoRegistro.persona?.apellidos}
                      </p>
                      <p className="text-sm text-gray-600">DNI: {ultimoRegistro.persona?.dni}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Tipo:</p>
                      <Badge variant={ultimoRegistro.tipo === 'entrada' ? 'default' : 'secondary'}>
                        {ultimoRegistro.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-gray-600">Hora:</p>
                      <p className="font-medium">
                        {ultimoRegistro.tipo === 'entrada' 
                          ? new Date(ultimoRegistro.fecha_ingreso!).toLocaleTimeString('es-ES')
                          : new Date(ultimoRegistro.fecha_salida!).toLocaleTimeString('es-ES')
                        }
                      </p>
                    </div>
                  </div>

                  {ultimoRegistro.miniTardanza && ultimoRegistro.miniTardanza > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <Badge variant="destructive">
                        Tardanza: +{ultimoRegistro.miniTardanza} minutos
                      </Badge>
                    </div>
                  )}
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-green-700">
                      ✓ {ultimoRegistro.mensaje}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Instrucciones</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Colóquese frente a la cámara</li>
                <li>• Mantenga el rostro bien iluminado</li>
                <li>• Evite usar gafas de sol o gorros</li>
                <li>• Permanezca inmóvil durante el escaneo</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default RegistroAsistenciaPage;