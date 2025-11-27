import React, { useState, useRef, useEffect } from 'react';
import { useRegistroAsistencia } from '../controllers/useRegistroAsistencia';
import { useFaceApi, FaceDetectionResult } from '../../../hooks/useFaceApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Camera, CameraOff, User, Clock, CheckCircle, AlertCircle, Loader2, Save } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';

export const RegistroAsistenciaPage: React.FC = () => {
  const {
    loading: registroLoading,
    error: registroError,
    ultimoRegistro,
    empleadosConDescriptores,
    registrarAsistenciaFacial,
    registrarDescriptorFacial,
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

  const { user } = useAuth(); 

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      setCameraLoading(true);
      setCameraError(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Tu navegador no soporta acceso a la cámara');
      }

    
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      console.log('Solicitando acceso a la cámara...');

      // VERIFICAR que videoRef existe ANTES de continuar
      if (!videoRef.current) {
        throw new Error('Elemento video no está disponible en el DOM');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' 
        },
        audio: false
      });

      console.log('Stream obtenido:', stream);


      videoRef.current.srcObject = stream;
      streamRef.current = stream;

      
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) {
          reject(new Error('Elemento video perdido durante la inicialización'));
          return;
        }

        const video = videoRef.current;

        const onLoadedMetadata = () => {
          console.log('Metadatos cargados - Video listo');
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
          resolve();
        };

        const onError = () => {
          video.removeEventListener('error', onError);
          reject(new Error('Error al cargar el video'));
        };

        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.addEventListener('error', onError);


        setTimeout(() => {
          if (video.readyState >= 2) { 
            console.log('Video listo por timeout');
            resolve();
          }
        }, 2000);
      });

      if (videoRef.current) {
        try {
          await videoRef.current.play();
          console.log('Video reproduciéndose correctamente');
        } catch (playError) {
          console.warn('Error en play(), pero continuando:', playError);
        }
      }

      setCameraActive(true);
      setScanResult(null);
      limpiarEstado();
      console.log('✅ Cámara activada exitosamente');

    } catch (error: any) {
      console.error('❌ Error detallado al acceder a la cámara:', error);
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
        errorMessage = 'No se puede acceder a la cámara con la configuración solicitada. Intenta con otra cámara.';
      } else if (error.message.includes('Elemento video')) {
        errorMessage = 'Error técnico: El elemento de video no está disponible. Recarga la página.';
      }

      setCameraError(errorMessage);
 
      alert(`Error de cámara: ${errorMessage}\n\nSi el problema persiste:\n• Recarga la página\n• Verifica los permisos de cámara\n• Prueba en otro navegador`);
    } finally {
      setCameraLoading(false);
    }
  };

  

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        console.log('Limpiando cámara...');
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
        streamRef.current = null;
      }
    };
  }, []);

  const stopCamera = () => {
    console.log('Deteniendo cámara...');

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

    console.log('Cámara detenida');
  };

  // Función reconocerRostro con registro de asistencia
  const reconocerRostro = async () => {
    if (!videoRef.current || !modelsLoaded) {
      alert('La cámara o los modelos de IA no están listos.');
      return;
    }

    setIsScanning(true);
    setScanResult(null);
    limpiarEstado();

    try {
      console.log('Iniciando detección facial...');
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

      console.log('Descriptor capturado:', descriptorCapturado.length, 'dimensiones');
      console.log('Empleados para comparar:', empleadosConDescriptores.length);

      // Buscar coincidencia con los descriptores existentes
      let mejorDistancia = 1;
      let empleadoReconocido = null;

      for (const empleado of empleadosConDescriptores) {
        try {
          const descriptorBD = empleado.descriptor;

          let distancia = 0;
          for (let i = 0; i < descriptorCapturado.length; i++) {
            const diff = descriptorCapturado[i] - descriptorBD[i];
            distancia += diff * diff;
          }
          distancia = Math.sqrt(distancia);

          console.log(`Comparando con ${empleado.nombres}: distancia=${distancia.toFixed(4)}`);

          if (distancia < 0.6 && distancia < mejorDistancia) {
            mejorDistancia = distancia;
            empleadoReconocido = empleado;
          }
        } catch (err) {
          console.error(`Error comparando con empleado ${empleado.nombres}:`, err);
        }
      }

      if (!empleadoReconocido) {
        setScanResult('error');
        alert('No se reconoció el rostro. Si eres nuevo, registra tu rostro primero.');
        return;
      }

      console.log(`Empleado reconocido: ${empleadoReconocido.nombres} (distancia: ${mejorDistancia.toFixed(4)})`);
      setCurrentUser({
        id: empleadoReconocido.id_persona,
        nombre: `${empleadoReconocido.nombres} ${empleadoReconocido.apellidos}`
      });

      //REGISTRAR ASISTENCIA en el backend
      try {
        const resultado = await registrarAsistenciaFacial(empleadoReconocido.id_persona);
        console.log('Asistencia registrada:', resultado);
        setScanResult('success');

        // Mostrar mensaje de éxito
        setTimeout(() => {
          alert(`${resultado.mensaje}\nEmpleado: ${empleadoReconocido.nombres} ${empleadoReconocido.apellidos}\nTipo: ${resultado.tipo === 'entrada' ? 'Entrada' : 'Salida'}`);
        }, 500);

      } catch (err: any) {
        console.error('Error registrando asistencia:', err);
        setScanResult('error');
        alert(` Error al registrar asistencia: ${err.message}`);
      }

    } catch (error) {
      console.error('Error en el proceso de reconocimiento:', error);
      setScanResult('error');
      alert('Error durante el reconocimiento facial. Por favor, intenta nuevamente.');
    } finally {
      setIsScanning(false);
    }
  };

  // Función registrarNuevoRostro con guardado en BD
  const registrarNuevoRostro = async () => {
    if (!videoRef.current || !modelsLoaded) {
      alert('La cámara o los modelos de IA no están listos.');
      return;
    }

    if (!user?.id_persona) {
      alert('No se pudo obtener tu información de usuario. Por favor, inicia sesión nuevamente.');
      return;
    }

    const idPersona = user.id_persona;
    const nombreUsuario = user.nombres && user.apellidos 
      ? `${user.nombres} ${user.apellidos}`
      : user.user || 'Usuario';

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

      console.log('Registrando descriptor para ID:', idPersona);

      //REGISTRAR DESCRIPTOR en la base de datos
      await registrarDescriptorFacial(idPersona, descriptor);

      setScanResult('success');

      setTimeout(() => {
        setModoRegistro(false);
      }, 500);

    } catch (error: any) {
      setScanResult('error');
    } finally {
      setIsRegisteringFace(false);
    }
  };

  useEffect(() => {
    if (cameraActive && empleadosConDescriptores.length === 0) {
      console.log('Cámara activada - empleados cargados:', empleadosConDescriptores.length);
    }
  }, [cameraActive, empleadosConDescriptores.length]);

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
              {/* VIDEO SIEMPRE PRESENTE pero controlado por cameraActive */}
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                style={{ transform: 'scaleX(-1)' }}
              />

              {/* Estado de carga del video */}
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

              {/* PLACEHOLDER cuando la cámara no está activa */}
              {!cameraActive && (
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
                        disabled={isScanning || !modelsLoaded || empleadosConDescriptores.length === 0}
                        className="flex-1"
                        variant="default"
                      >
                        {isScanning ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Reconociendo...
                          </>
                        ) : (
                          `Reconocer Rostro (${empleadosConDescriptores.length} empleados)`
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

            {cameraActive && empleadosConDescriptores.length === 0 && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertDescription className="text-yellow-800">
                  <strong>Advertencia:</strong> No hay empleados con rostros registrados. Usa "Registrar Rostro" para agregar empleados al sistema.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Sección de Resultados */}
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
                <div className={`border rounded-lg p-4 ${ultimoRegistro.tipo === 'entrada'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-blue-50 border-blue-200'
                  }`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${ultimoRegistro.tipo === 'entrada' ? 'bg-green-100' : 'bg-blue-100'
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
                        {ultimoRegistro.fecha_ingreso
                          ? new Date(ultimoRegistro.fecha_ingreso).toLocaleTimeString('es-ES')
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

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Instrucciones</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Solo una persona debe estar frente a la cámara</li>
                <li>• Mantén buena iluminación frontal</li>
                <li>• Mira directamente a la cámara</li>
                <li>• Espera el mensaje de confirmación</li>
                <li>• Empleados registrados: <strong>{empleadosConDescriptores.length}</strong></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistroAsistenciaPage;