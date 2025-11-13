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
    registrarAsistenciaFacial,
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
  const [descriptoresEmpleados, setDescriptoresEmpleados] = useState<Array<{ id: number, descriptor: Float32Array }>>([]);
  const [empleados, setEmpleados] = useState<Array<{ id_persona: number, nombres: string, apellidos: string, dni: string }>>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cargar descriptores de empleados
  useEffect(() => {

    // En registroAsistenciaPage.tsx - corregir la función cargarDescriptores
    const cargarDescriptores = async () => {
      try {
        console.log('📥 Cargando descriptores de empleados...');

        // CORRECCIÓN: Importar correctamente el servicio
        const { registroAsistenciaService } = await import('../services/registroAsistencia.service');
        const descriptores = await registroAsistenciaService.obtenerDescriptoresEmpleados();

        // CORRECCIÓN: Usar 'descriptor' en lugar de 'description'
        const descriptoresFormateados = descriptores.map((emp: any) => ({
          id: emp.id_persona,
          descriptor: new Float32Array(emp.descriptor) // ← Cambiar 'description' por 'descriptor'
        }));

        setDescriptoresEmpleados(descriptoresFormateados);
        setEmpleados(descriptores.map((emp: any) => ({
          id_persona: emp.id_persona,
          nombres: emp.nombres,
          apellidos: emp.apellidos,
          dni: emp.dni
        })));

        console.log(`✅ Cargados ${descriptoresFormateados.length} descriptores de empleados`);
      } catch (error) {
        console.error('❌ Error cargando descriptores:', error);
        // En desarrollo, usar datos de prueba
        console.log('🔄 Usando datos de prueba para desarrollo...');

        const datosPrueba = [
          {
            id_persona: 1,
            descriptor: Array.from({ length: 128 }, () => Math.random()),
            nombres: "Admin",
            apellidos: "Sistema",
            dni: "12345678"
          },
          {
            id_persona: 2,
            descriptor: Array.from({ length: 128 }, () => Math.random()),
            nombres: "Juan Carlos",
            apellidos: "Pérez López",
            dni: "87654321"
          }
        ];

        const descriptoresFormateados = datosPrueba.map(emp => ({
          id: emp.id_persona,
          descriptor: new Float32Array(emp.descriptor)
        }));

        setDescriptoresEmpleados(descriptoresFormateados);
        setEmpleados(datosPrueba.map(emp => ({
          id_persona: emp.id_persona,
          nombres: emp.nombres,
          apellidos: emp.apellidos,
          dni: emp.dni
        })));
      }
    };

    cargarDescriptores();
  }, []);

  // En registroAsistenciaPage.tsx - REEMPLAZAR la función startCamera
  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Tu navegador no soporta acceso a la cámara');
      }

      // Asegurar que los modelos estén cargados
      if (!modelsLoaded) {
        console.log('🔄 Cargando modelos de IA...');
        const loaded = await loadModels();
        if (!loaded) {
          throw new Error('No se pudieron cargar los modelos de reconocimiento facial');
        }
      }

      console.log('📷 Solicitando acceso a la cámara...');

      // Detener cámara anterior si existe
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

        // Esperar a que el video esté listo
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              resolve(true);
            };
          }
        });

        setCameraActive(true);
        setScanResult(null);
        limpiarEstado();
        console.log('✅ Cámara activada correctamente');
      }
    } catch (error: any) {
      console.error('❌ Error accediendo a la cámara:', error);

      let errorMessage = 'No se pudo acceder a la cámara.';

      if (error.name === 'NotAllowedError') {
        errorMessage = 'Permisos de cámara denegados. Por favor, permite el acceso a la cámara en la configuración de tu navegador.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No se encontró ninguna cámara conectada. Conecta una cámara e intenta nuevamente.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Tu navegador no soporta acceso a la cámara. Prueba con Chrome, Firefox o Edge.';
      } else if (error.message.includes('modelos')) {
        errorMessage = error.message;
      }

      alert(`Error: ${errorMessage}`);
    }
  };



  const stopCamera = () => {
    if (streamRef.current) {
      console.log('🛑 Deteniendo cámara...');
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`🛑 Track ${track.kind} detenido`);
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
    setIsScanning(false);
    setScanResult(null);
    console.log('✅ Cámara completamente detenida');
  };

  const scanFace = async () => {
    if (!videoRef.current || !modelsLoaded) {
      alert('La cámara o los modelos de IA no están listos. Espera a que se carguen completamente.');
      return;
    }

    if (descriptoresEmpleados.length === 0) {
      alert('No hay empleados registrados en el sistema. Contacta al administrador.');
      return;
    }

    setIsScanning(true);
    setScanResult(null);
    limpiarEstado();

    try {
      console.log('🔍 Iniciando proceso de reconocimiento facial...');

      // Detectar rostros en el video
      const faces = await detectFaces(videoRef.current);

      if (faces.length === 0) {
        setScanResult('error');
        alert('❌ No se detectó ningún rostro. Asegúrate de:\n• Estar frente a la cámara\n• Tener buena iluminación\n• Quitar gafas de sol o gorros');
        return;
      }

      if (faces.length > 1) {
        setScanResult('error');
        alert('❌ Se detectó más de un rostro. Por favor, asegúrate de que solo una persona esté en cámara.');
        return;
      }

      const face = faces[0];
      console.log('✅ Rostro detectado, procediendo a reconocimiento...');

      // Reconocer el rostro
      const reconocimiento = await recognizeFace(face.descriptor, descriptoresEmpleados, 0.6);

      if (!reconocimiento) {
        setScanResult('error');
        alert('❌ No se pudo reconocer el rostro. Posibles causas:\n• No estás registrado en el sistema\n• La iluminación no es adecuada\n• Intenta acercarte más a la cámara');
        return;
      }

      console.log(`✅ Rostro reconocido: Empleado ID ${reconocimiento.id}`);

      // Registrar asistencia
      const resultado = await registrarAsistenciaFacial(reconocimiento.id);
      setScanResult('success');

      console.log('🎉 Asistencia registrada exitosamente:', resultado);

    } catch (error) {
      console.error('❌ Error en el proceso de reconocimiento:', error);
      setScanResult('error');
      alert('Error durante el reconocimiento facial. Por favor, intenta nuevamente.');
    } finally {
      setIsScanning(false);
    }
  };

  const getNombreEmpleado = (id_persona: number) => {
    const empleado = empleados.find(emp => emp.id_persona === id_persona);
    return empleado ? `${empleado.nombres} ${empleado.apellidos}` : 'Empleado no encontrado';
  };

  useEffect(() => {
    return () => {
      console.log('🧹 Limpiando recursos de la cámara...');
      stopCamera();
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Registro de Asistencia por Reconocimiento Facial</h1>
        <p className="text-gray-600">Sistema automático de registro de entrada y salida</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sección de Cámara y Reconocimiento */}
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
                    className="w-full h-full object-cover transform scale-x-[-1]"
                    onLoadedMetadata={() => console.log('✅ Video de cámara cargado')}
                    onError={(e) => console.error('❌ Error en video:', e)}
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ display: 'none' }}
                  />

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
                          ¡Reconocimiento exitoso! Asistencia registrada correctamente.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {scanResult === 'error' && (
                    <div className="absolute top-4 left-4 right-4">
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Error en el reconocimiento. Verifica las instrucciones e intenta nuevamente.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                  <CameraOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-center mb-4">Cámara desactivada</p>
                  {!modelsLoaded && !modelsLoading && (
                    <Button onClick={loadModels} className="mt-2" variant="outline">
                      Cargar Modelos de IA
                    </Button>
                  )}
                  {faceError && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {faceError}
                      </AlertDescription>
                    </Alert>
                  )}
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
                      Cargando IA ({progress}%)
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
                    variant="default"
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


            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-800 mb-2 text-sm">Estado en Tiempo Real</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${cameraActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span>Cámara: {cameraActive ? 'Activa' : 'Inactiva'}</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${modelsLoaded ? 'bg-green-500' : modelsLoading ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  <span>Modelos IA: {modelsLoaded ? 'Listos' : modelsLoading ? 'Cargando...' : 'No cargados'}</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${streamRef.current ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span>Stream: {streamRef.current ? 'Conectado' : 'Desconectado'}</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${videoRef.current?.readyState === 4 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span>Video: {videoRef.current?.readyState === 4 ? 'Listo' : 'No listo'}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Estado del Sistema</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-blue-600">Modelos de IA:</span>
                  <Badge variant={modelsLoaded ? "secondary" : "outline"} className="ml-2">
                    {modelsLoaded ? 'Cargados' : modelsLoading ? 'Cargando...' : 'No cargados'}
                  </Badge>
                </div>
                <div>
                  <span className="text-blue-600">Empleados:</span>
                  <Badge variant="outline" className="ml-2">
                    {descriptoresEmpleados.length} registrados
                  </Badge>
                </div>
                <div>
                  <span className="text-blue-600">Cámara:</span>
                  <Badge variant={cameraActive ? "secondary" : "outline"} className="ml-2">
                    {cameraActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
                <div>
                  <span className="text-blue-600">Último Scan:</span>
                  <Badge variant={scanResult === 'success' ? "secondary" : scanResult === 'error' ? "destructive" : "outline"} className="ml-2">
                    {scanResult === 'success' ? 'Éxito' : scanResult === 'error' ? 'Error' : 'Ninguno'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección de Resultados y Estado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
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
                <h3 className="font-medium mb-3">Último Registro Exitoso</h3>
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

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Instrucciones para Uso Correcto</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Colóquese frente a la cámara a una distancia de 30-50 cm</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Asegure buena iluminación frontal (evite luces traseras)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Mantenga el rostro visible sin gafas de sol o gorros</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Permanezca inmóvil durante el escaneo (2-3 segundos)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Espere el mensaje de confirmación antes de retirarse</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Empleados Registrados en el Sistema</h4>
              <div className="space-y-2">
                {empleados.map(empleado => (
                  <div key={empleado.id_persona} className="flex justify-between items-center text-sm">
                    <span>{empleado.nombres} {empleado.apellidos}</span>
                    <Badge variant="outline">DNI: {empleado.dni}</Badge>
                  </div>
                ))}
                {empleados.length === 0 && (
                  <p className="text-yellow-700 text-sm">No hay empleados registrados en el sistema</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistroAsistenciaPage;