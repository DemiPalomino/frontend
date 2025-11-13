// hooks/faceApiConfig.ts
export const faceApiConfig = {
  // Umbral de confianza para detección de rostros (0-1)
  faceDetectionThreshold: 0.5,
  
  // Umbral de similitud para reconocimiento (0-1, menor = más estricto)
  faceRecognitionThreshold: 0.6,
  
  // Tamaño mínimo de rostro a detectar
  minFaceSize: 50,
  
  // Ruta de los modelos
  modelsPath: '/models',
  
  // Opciones de cámara
  cameraConstraints: {
    video: { 
      width: 640, 
      height: 480,
      facingMode: 'user'
    } 
  }
};