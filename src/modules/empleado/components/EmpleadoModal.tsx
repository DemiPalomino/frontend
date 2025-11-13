import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Empleado, CreateEmpleadoDTO } from '../services/empleado.service';


interface EmpleadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (empleado: CreateEmpleadoDTO | Partial<Empleado>) => Promise<void>;
  empleado?: Empleado | null;
}

const areas = [
  { id: 1, nombre: 'Administración' },
  { id: 2, nombre: 'Recursos Humanos' },
  { id: 3, nombre: 'Contabilidad' },
  { id: 4, nombre: 'Sistemas' },
  { id: 5, nombre: 'Ventas' }
];

export const EmpleadoModal: React.FC<EmpleadoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  empleado
}) => {
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    id_area_trabajo: 1
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (empleado) {
      setFormData({
        dni: empleado.dni,
        nombres: empleado.nombres,
        apellidos: empleado.apellidos,
        email: empleado.email,
        telefono: empleado.telefono,
        fecha_nacimiento: empleado.fecha_nacimiento.split('T')[0],
        id_area_trabajo: empleado.id_area_trabajo
      });
    } else {
      setFormData({
        dni: '',
        nombres: '',
        apellidos: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        id_area_trabajo: 1
      });
    }
  }, [empleado, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error al guardar empleado:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            {empleado ? 'Editar Empleado' : 'Nuevo Empleado'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="dni">DNI</Label>
              <Input
                id="dni"
                value={formData.dni}
                onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value }))}
                required
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
                required
              />
            </div>

            <div>
              <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
              <Input
                id="fecha_nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha_nacimiento: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="area">Área de Trabajo</Label>
              <Select
                value={formData.id_area_trabajo.toString()}
                onValueChange={(value: string) => setFormData(prev => ({ ...prev, id_area_trabajo: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {areas.map(area => (
                    <SelectItem key={area.id} value={area.id.toString()}>
                      {area.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : (empleado ? 'Actualizar' : 'Crear')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};