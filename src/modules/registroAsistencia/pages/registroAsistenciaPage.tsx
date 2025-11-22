import React, { useState, useRef, useEffect } from 'react';
import { useRegistroAsistencia } from '../controllers/useRegistroAsistencia';
import { useFaceApi, FaceDetectionResult } from '../../../hooks/useFaceApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Camera, CameraOff, User, Clock, CheckCircle, AlertCircle, Loader2, Save } from 'lucide-react';

export const RegistroAsistenciaPage: React.FC = () => {
  const {
    loading: registroLoading,
    error: registroError,
    ultimoRegistro,
    empleadosConDescriptores,
    limpiarEstado
  } = useRegistroAsistencia();

  const {
    modelsLoaded,
    loading: modelsLoading,
    error: faceError,
    progress,
    loadModels,
    detectFaces
  } = useFaceApi();

  const [cameraActive, setCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isRegisteringFace, setIsRegisteringFace] = useState(false);
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: number; nombre: string } | null>(null);
  const [modoRegistro, setModoRegistro] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraLoading, setCameraLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
const startCamera = async () => {
  try {
    setCameraLoading(true);
    setCameraError(null);
    
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Tu navegador no soporta acceso a la cámara');
    }

    // Detener cámara existente si hay una
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    console.log('Solicitando acceso a la cámara...');

    // Obtener lista de cámaras disponibles ANTES de acceder
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
    console.log('=== INFORMACIÓN DE CÁMARAS DISPONIBLES ===');
    videoDevices.forEach((device, index) => {
      console.log(`Cámara ${index}:`, device.label || `Dispositivo ${index}`);
    });
    console.log('==========================================');

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 }
        // Sin facingMode para usar la cámara por defecto
      },
      audio: false
    });

    // Obtener información de la cámara que se está usando
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      console.log('=== CÁMARA EN USO ===');
      console.log('Label:', videoTrack.label);
      console.log('Settings:', videoTrack.getSettings());
      console.log('========================');
    }

    console.log('Cámara accedida correctamente');

    if (!videoRef.current) {
      throw new Error('Elemento video no encontrado');
    }

    videoRef.current.srcObject = stream;
    streamRef.current = stream;

    // Resto de tu código...
    await new Promise((resolve, reject) => {
      if (!videoRef.current) {
        reject(new Error('Elemento video no encontrado'));
        return;
      }

      const videoElement = videoRef.current;

      videoElement.onloadedmetadata = () => {
        console.log('Metadatos del video cargados');
        resolve(true);
      };

      videoElement.onerror = () => {
        reject(new Error('Error al cargar el video'));
      };

      setTimeout(() => {
        if (videoElement.readyState >= 2) {
          resolve(true);
        } else {
          console.warn('Video no completamente cargado, pero continuando...');
          resolve(true);
        }
      }, 3000);
    });

    if (videoRef.current) {
      try {
        await videoRef.current.play();
        console.log('Video reproduciéndose');
      } catch (playError) {
        console.warn('Error en play():', playError);
      }
    }

    setCameraActive(true);
    setScanResult(null);
    limpiarEstado();
    console.log('Cámara activada y lista');

  } catch (error: any) {
    console.error('Error detallado al acceder a la cámara:', error);
    let errorMessage = 'No se pudo acceder a la cámara.';

    if (error.name === 'NotAllowedError') {
      errorMessage = 'Permisos de cámara denegados. Por favor, permite el acceso a la cámara en la configuración de tu navegador.';
    } else if (error.name === 'NotFoundError') {
      errorMessage = 'No se encontró ninguna cámara conectada.';
    } else if (error.name === 'NotSupportedError') {
      errorMessage = 'Tu navegador no soporta acceso a la cámara.';
    } else if (error.name === 'NotReadableError') {
      errorMessage = 'La cámara está siendo usada por otra aplicación.';
    } else if (error.name === 'OverconstrainedError') {
      errorMessage = 'No se puede acceder a la cámara con la configuración solicitada.';
    }

    setCameraError(errorMessage);
    alert(`Error: ${errorMessage}`);
  } finally {
    setCameraLoading(false);
  }
};
 
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
    setCameraLoading(false);
    setIsScanning(false);
    setIsRegisteringFace(false);
    setScanResult(null);
    setCurrentUser(null);
    setModoRegistro(false);
    setCameraError(null);
  };

  const reconocerRostro = async () => {
    if (!videoRef.current || !modelsLoaded) {
      alert('La cámara o los modelos de IA no están listos.');
      return;
    }
    setIsScanning(true);
    setScanResult(null);
    limpiarEstado();
    try {
      const faces = await detectFaces(videoRef.current);
      if (faces.length === 0) {
        setScanResult('error');
        alert('No se detectó ningún rostro. Asegúrate de estar frente a la cámara con buena iluminación.');
        return;
      }
      if (faces.length > 1) {
        setScanResult('error');
        alert('Se detectó más de un rostro. Por favor, asegúrate de que solo una persona esté en cámara.');
        return;
      }
      const face = faces[0];
      const descriptorCapturado = Array.from(face.descriptor);
      // Buscar coincidencia con los descriptores existentes
      let mejorSimilitud = 1;
      let empleadoReconocido = null;
      for (const empleado of empleadosConDescriptores) {
        const descriptorBD = empleado.descriptor;       
        // Calcular distancia euclidiana
        let distancia = 0;
        for (let i = 0; i < descriptorCapturado.length; i++) {
          const diff = descriptorCapturado[i] - descriptorBD[i];
          distancia += diff * diff;
        }
        distancia = Math.sqrt(distancia);
        console.log(`Comparando con ${empleado.nombres}: ${distancia}`);
        if (distancia < 0.6 && distancia < mejorSimilitud) {
          mejorSimilitud = distancia;
          empleadoReconocido = empleado;
        }
      }
      if (!empleadoReconocido) {
        setScanResult('error');
        alert('No se reconoció el rostro. Si eres nuevo, registra tu rostro primero.');
        return;
      }
      console.log(`Empleado reconocido: ${empleadoReconocido.nombres} (similitud: ${mejorSimilitud})`);
    } catch (error) {
      console.error('Error en el proceso de reconocimiento:', error);
      setScanResult('error');
      alert('Error durante el reconocimiento facial. Por favor, intenta nuevamente.');
    } finally {
      setIsScanning(false);
    }
  };

  const registrarNuevoRostro = async () => {
    if (!videoRef.current || !modelsLoaded) {
      alert('La cámara o los modelos de IA no están listos.');
      return;
    }

    const idPersona = prompt('Ingresa tu ID de persona:');
    if (!idPersona) return;

    setIsRegisteringFace(true);
    setScanResult(null);

    try {
      const faces = await detectFaces(videoRef.current);

      if (faces.length === 0) {
        setScanResult('error');
        alert('No se detectó ningún rostro. Posiciónate frente a la cámara.');
        return;
      }

      if (faces.length > 1) {
        setScanResult('error');
        alert('Se detectó más de un rostro. Solo debe haber una persona en cámara.');
        return;
      }

      const face = faces[0];
      const descriptor = Array.from(face.descriptor);

      setScanResult('success');
      alert('Rostro registrado exitosamente! Ahora puedes usar el reconocimiento facial.');
      
      setModoRegistro(false);

    } catch (error) {
      console.error('Error registrando rostro:', error);
      setScanResult('error');
      alert('Error al registrar el rostro. Intenta nuevamente.');
    } finally {
      setIsRegisteringFace(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Registro de Asistencia por Reconocimiento Facial</h1>
        <p className="text-gray-600">Sistema automático de registro de entrada y salida</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sección de Cámara */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              {modoRegistro ? 'Registro de Rostro' : 'Reconocimiento Facial'}
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

            {cameraError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{cameraError}</AlertDescription>
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
                    style={{ transform: 'scaleX(-1)' }}
                    onLoadedData={() => console.log('Video data loaded')}
                    onCanPlay={() => console.log('Video can play')}
                    onError={(e) => console.error('Video error:', e)}
                  />

                  {/* Estado de carga del video - solo mostrar cuando cameraLoading es true */}
                  {cameraLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="text-white text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                        <p>Iniciando cámara...</p>
                      </div>
                    </div>
                  )}

                  {(isScanning || isRegisteringFace) && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                          <span className="font-medium">
                            {isRegisteringFace ? 'Registrando rostro...' : 'Reconociendo rostro...'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {scanResult === 'success' && (
                    <div className="absolute top-4 left-4 right-4">
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          {modoRegistro ? '¡Rostro registrado exitosamente!' : '¡Reconocimiento exitoso! Asistencia registrada.'}
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {scanResult === 'error' && (
                    <div className="absolute top-4 left-4 right-4">
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Error en el proceso. Verifica las instrucciones.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                  <CameraOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-center mb-4">Cámara desactivada</p>
                  <p className="text-gray-400 text-sm text-center">
                    Haz clic en "Iniciar Cámara" para comenzar
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {!cameraActive ? (
                <Button
                  onClick={startCamera}
                  className="flex-1"
                  disabled={modelsLoading || cameraLoading}
                >
                  {modelsLoading || cameraLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {cameraLoading ? 'Iniciando cámara...' : `Cargando IA (${progress}%)`}
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
                  {!modoRegistro ? (
                    <>
                      <Button
                        onClick={reconocerRostro}
                        disabled={isScanning || !modelsLoaded}
                        className="flex-1"
                        variant="default"
                      >
                        {isScanning ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Reconociendo...
                          </>
                        ) : (
                          'Reconocer Rostro'
                        )}
                      </Button>
                      <Button 
                        onClick={() => setModoRegistro(true)}
                        variant="outline"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Registrar Rostro
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={registrarNuevoRostro}
                        disabled={isRegisteringFace || !modelsLoaded}
                        className="flex-1"
                        variant="default"
                      >
                        {isRegisteringFace ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Registrando...
                          </>
                        ) : (
                          'Guardar Rostro'
                        )}
                      </Button>
                      <Button 
                        onClick={() => setModoRegistro(false)}
                        variant="outline"
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                  <Button onClick={stopCamera} variant="outline">
                    <CameraOff className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            {modoRegistro && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-800">
                  <strong>Modo registro:</strong> Posiciónate frente a la cámara y haz clic en "Guardar Rostro" para registrar tu rostro en el sistema.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Sección de Resultados - se mantiene igual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Estado y Resultados
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
                        {new Date(ultimoRegistro.fecha_ingreso!).toLocaleTimeString('es-ES')}
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

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Instrucciones</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Solo una persona debe estar frente a la cámara</li>
                <li>• Mantén buena iluminación frontal</li>
                <li>• Mira directamente a la cámara</li>
                <li>• Espera el mensaje de confirmación</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistroAsistenciaPage;