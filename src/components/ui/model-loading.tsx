// src/components/ui/model-loading.tsx
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface ModelLoadingProps {
  loading: boolean;
  error: string | null;
  progress: number;
  individualModels: {
    ssdMobilenetv1: boolean;
    faceLandmark68: boolean;
    faceRecognition: boolean;
  };
}

export function ModelLoading({ loading, error, progress, individualModels }: ModelLoadingProps) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 text-red-800 mb-2">
          <XCircle className="w-5 h-5" />
          <span className="font-medium">Error cargando modelos</span>
        </div>
        <p className="text-red-700 text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 text-blue-800 mb-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Cargando modelos de IA...</span>
          <span className="text-sm">{progress}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-blue-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Model Status */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            {individualModels.ssdMobilenetv1 ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            )}
            <span>Detección de rostros</span>
          </div>
          
          <div className="flex items-center gap-2">
            {individualModels.faceLandmark68 ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            )}
            <span>Puntos faciales (68 puntos)</span>
          </div>
          
          <div className="flex items-center gap-2">
            {individualModels.faceRecognition ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            )}
            <span>Reconocimiento facial</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}