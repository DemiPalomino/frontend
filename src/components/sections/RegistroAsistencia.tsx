// En tu RegistroAsistencia.tsx
import { useFaceApi } from '../../hooks/useFaceApi';
import { ModelLoading } from '../../components/ui/model-loading';
import { useModelVerification } from '../../hooks/useModelVerification';
import { CheckCircle } from 'lucide-react';

export function RegistroAsistencia() {
  const { 
    modelsLoaded, 
    loading, 
    error, 
    progress, 
    individualModels,
    reloadModels 
  } = useFaceApi();
  
  useModelVerification();

  return (
    <div className="p-6 space-y-6">
      {/* Loading State */}
      <ModelLoading 
        loading={loading}
        error={error}
        progress={progress}
        individualModels={individualModels}
      />

      {/* Contenido principal */}
      {modelsLoaded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tu interfaz de cámara y reconocimiento aquí */}
          <div className="text-center p-8 bg-green-50 rounded-lg">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800">
              Modelos de IA Cargados
            </h3>
            <p className="text-green-600">
              El sistema de reconocimiento facial está listo
            </p>
          </div>
        </div>
      )}
    </div>
  );
}