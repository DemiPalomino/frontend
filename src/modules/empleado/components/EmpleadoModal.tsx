import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Empleado, CreateEmpleadoDTO } from '../services/empleado.service';
import { useAreas } from '../controllers/useAreas';
import { UserIcon, Lock, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '../../../components/ui/dialog';

interface EmpleadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (empleado: CreateEmpleadoDTO | Partial<Empleado>) => Promise<void>;
  empleado?: Empleado | null;
}


const tiposUsuario = [
  { id: 1, nombre: 'Administrador' },
  { id: 2, nombre: 'Empleado' }
];

export const EmpleadoModal: React.FC<EmpleadoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  empleado
}) => {
  const { areas, loading: loadingAreas } = useAreas();
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    id_area_trabajo: 1,
    // Datos de usuario 
    nombre_usuario: '',
    contrasena: '',
    id_tipo_usuario: 2
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (empleado) {
      setFormData({
        dni: empleado.dni,
        nombres: empleado.nombres,
        apellidos: empleado.apellidos,
        email: empleado.email,
        telefono: empleado.telefono,
        fecha_nacimiento: empleado.fecha_nacimiento.split('T')[0],
        id_area_trabajo: empleado.id_area_trabajo,
        // No se muestra datos de usuario por seguridad
        nombre_usuario: '',
        contrasena: '',
        id_tipo_usuario: 2
      });
    } else {
      setFormData({
        dni: '',
        nombres: '',
        apellidos: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        id_area_trabajo: 1,
        nombre_usuario: '',
        contrasena: '',
        id_tipo_usuario: 2
      });
    }
    setError(null);
  }, [empleado, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.id_area_trabajo === 0) {
      setError('Debe seleccionar un área de trabajo');
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const dataToSend = empleado
        ? { ...formData, nombre_usuario: undefined, contrasena: undefined, id_tipo_usuario: undefined }
        : formData;

      await onSave(dataToSend);
      onClose();
    } catch (error: any) {
      console.error('Error al guardar empleado:', error);
      setError(error.message || 'Error al guardar empleado');
    } finally {
      setLoading(false);
    }
  };

  const generarNombreUsuario = () => {
    const { nombres, apellidos } = formData;
    if (nombres && apellidos) {
      const primerNombre = nombres.split(' ')[0].toLowerCase();
      const primerApellido = apellidos.split(' ')[0].toLowerCase();
      const username = `${primerNombre}.${primerApellido}`;
      setFormData(prev => ({ ...prev, nombre_usuario: username }));
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent >

        <div>
          <DialogTitle> {empleado ? 'Editar Empleado' : 'Nuevo Empleado'}</DialogTitle>


          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Datos Personales */}
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Datos Personales</h3>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="dni">DNI</Label>
                  <Input
                    id="dni"
                    value={formData.dni}
                    onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value }))}
                    required
                    maxLength={8}
                    pattern="[0-9]{8}"
                  />
                </div>

                <div>
                  <Label htmlFor="nombres">Nombres</Label>
                  <Input
                    id="nombres"
                    value={formData.nombres}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombres: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="apellidos">Apellidos</Label>
                  <Input
                    id="apellidos"
                    value={formData.apellidos}
                    onChange={(e) => setFormData(prev => ({ ...prev, apellidos: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                  <Input
                    id="fecha_nacimiento"
                    type="date"
                    value={formData.fecha_nacimiento}
                    onChange={(e) => setFormData(prev => ({ ...prev, fecha_nacimiento: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="area">Área de Trabajo</Label>
                  <Select
                    value={formData.id_area_trabajo.toString()}
                    onValueChange={(value: string) => setFormData(prev => ({
                      ...prev,
                      id_area_trabajo: parseInt(value)
                    }))}
                    disabled={loadingAreas}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        loadingAreas ? "Cargando áreas..." : "Seleccione un área"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map(area => (
                        <SelectItem key={area.id_area} value={area.id_area.toString()}>
                          {area.nombre_area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {loadingAreas && (
                    <p className="text-sm text-gray-500 mt-1">Cargando áreas disponibles...</p>
                  )}
                </div>
              </div>
            </div>

            {/* Datos de Usuario */}
            {!empleado && (
              <div className="space-y-4 pt-2">
                <h3 className="font-medium text-sm text-gray-900 text-muted-foreground">Datos de Usuario</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="nombre_usuario">
                        <UserIcon className="w-4 h-4 inline mr-1" />
                        Nombre de Usuario
                      </Label>
                      <Input
                        id="nombre_usuario"
                        value={formData.nombre_usuario}
                        onChange={(e) => setFormData(prev => ({ ...prev, nombre_usuario: e.target.value }))}
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generarNombreUsuario}
                      className="mt-6"
                    >
                      Generar
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="contrasena">
                      <Lock className="w-4 h-4 inline mr-1" />
                      Contraseña
                    </Label>
                    <Input
                      id="contrasena"
                      type="password"
                      value={formData.contrasena}
                      onChange={(e) => setFormData(prev => ({ ...prev, contrasena: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="tipo_usuario">
                      <Shield className="w-4 h-4 inline mr-1" />
                      Tipo de Usuario</Label>
                    <Select
                      value={formData.id_tipo_usuario.toString()}
                      onValueChange={(value: string) => setFormData(prev => ({ ...prev, id_tipo_usuario: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposUsuario.map(tipo => (
                          <SelectItem key={tipo.id} value={tipo.id.toString()}>
                            {tipo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : (empleado ? 'Actualizar' : 'Crear')}
              </Button>
            </div>
          </form>
        </div>

      </DialogContent>

    </Dialog>

  );
};