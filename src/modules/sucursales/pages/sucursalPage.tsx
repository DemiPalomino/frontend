import React, { useState } from 'react';
import { useSucursal } from '../controllers/useSucursal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Badge } from '../../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../..//components/ui/select';
import { Building2, MapPin, Phone, Plus, Edit, Trash2, Briefcase } from 'lucide-react';

export const SucursalPage: React.FC = () => {
  const {
    sucursales,
    areas,
    loading,
    error,
    crearSucursal,
    actualizarSucursal,
    eliminarSucursal,
    crearArea,
    actualizarArea,
    eliminarArea,
    getAreasPorSucursal,
    getSucursalNombre
  } = useSucursal();

  const [isSucursalDialogOpen, setIsSucursalDialogOpen] = useState(false);
  const [isAreaDialogOpen, setIsAreaDialogOpen] = useState(false);
  const [editingSucursal, setEditingSucursal] = useState<any>(null);
  const [editingArea, setEditingArea] = useState<any>(null);

  const [nuevaSucursal, setNuevaSucursal] = useState({
    nombre_sucursal: '',
    direccion: '',
    telefono: '',
  });

  const [nuevaArea, setNuevaArea] = useState({
    nombre_area: '',
    descripcion: '',
    id_sucursal: 0,
  });

  const handleSaveSucursal = async () => {
    try {
      if (editingSucursal) {
        await actualizarSucursal(editingSucursal.id_sucursal, nuevaSucursal);
      } else {
        await crearSucursal({ ...nuevaSucursal, activo: true });
      }
      setIsSucursalDialogOpen(false);
      resetSucursalForm();
    } catch (error) {
      console.error('Error al guardar sucursal:', error);
    }
  };

const handleSaveArea = async () => {
  try {
 
    if (!nuevaArea.nombre_area.trim()) {
      alert('El nombre del área es requerido');
      return;
    }
    if (nuevaArea.id_sucursal === 0) {
      alert('Debe seleccionar una sucursal');
      return;
    }

 
    if (editingArea) {
      await actualizarArea(editingArea.id_area, nuevaArea);
    } else {
      await crearArea(nuevaArea);
    }
    
    setIsAreaDialogOpen(false);
    resetAreaForm();
  } catch (error: any) {
    console.error('Error al guardar área:', error);
    alert('Error al guardar el área: ' + error.message);
  }
};

  const handleEditSucursal = (sucursal: any) => {
    setEditingSucursal(sucursal);
    setNuevaSucursal({
      nombre_sucursal: sucursal.nombre_sucursal,
      direccion: sucursal.direccion,
      telefono: sucursal.telefono,
    });
    setIsSucursalDialogOpen(true);
  };


  const handleEditArea = (area: any) => {
    setEditingArea(area);
    setNuevaArea({
      nombre_area: area.nombre_area || '',
      descripcion: area.descripcion || '',
      id_sucursal: area.id_sucursal || 0, 
    });
    setIsAreaDialogOpen(true);
  };

  const handleDeleteSucursal = async (id: number) => {
    if (confirm('¿Está seguro de eliminar esta sucursal?')) {
      try {
        await eliminarSucursal(id);
      } catch (error) {
        console.error('Error al eliminar sucursal:', error);
      }
    }
  };

  const handleDeleteArea = async (id: number) => {
    if (confirm('¿Está seguro de eliminar esta área?')) {
      try {
        await eliminarArea(id);
      } catch (error) {
        console.error('Error al eliminar área:', error);
      }
    }
  };

  const resetSucursalForm = () => {
    setEditingSucursal(null);
    setNuevaSucursal({ nombre_sucursal: '', direccion: '', telefono: '' });
  };

  const resetAreaForm = () => {
    setEditingArea(null);
    setNuevaArea({ nombre_area: '', descripcion: '', id_sucursal: 1 });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando sucursales y áreas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-2">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Sucursales y Áreas</h1>
        <p className="text-gray-600 mt-1">
          Administre las sucursales y áreas de trabajo de la empresa
        </p>
      </div>

      <Tabs defaultValue="sucursales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sucursales">Sucursales</TabsTrigger>
          <TabsTrigger value="areas">Áreas de Trabajo</TabsTrigger>
        </TabsList>

        <TabsContent value="sucursales" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sucursales</CardTitle>
                  <CardDescription>Lista de todas las sucursales registradas</CardDescription>
                </div>
                <Dialog open={isSucursalDialogOpen} onOpenChange={setIsSucursalDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetSucursalForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Sucursal
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingSucursal ? 'Editar Sucursal' : 'Nueva Sucursal'}
                      </DialogTitle>
                      <DialogDescription>
                        Complete los datos de la sucursal
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre_sucursal">Nombre de la Sucursal</Label>
                        <Input
                          id="nombre_sucursal"
                          value={nuevaSucursal.nombre_sucursal}
                          onChange={(e) => setNuevaSucursal({ ...nuevaSucursal, nombre_sucursal: e.target.value })}
                          placeholder="Ej: Sede Central - Lima"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="direccion">Dirección</Label>
                        <Textarea
                          id="direccion"
                          value={nuevaSucursal.direccion}
                          onChange={(e) => setNuevaSucursal({ ...nuevaSucursal, direccion: e.target.value })}
                          placeholder="Dirección completa de la sucursal"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          value={nuevaSucursal.telefono}
                          onChange={(e) => setNuevaSucursal({ ...nuevaSucursal, telefono: e.target.value })}
                          placeholder="01-1234567"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsSucursalDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveSucursal}>
                        {editingSucursal ? 'Actualizar' : 'Crear'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sucursal</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Áreas</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sucursales.map((sucursal) => (
                    <TableRow key={sucursal.id_sucursal}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {sucursal.nombre_sucursal}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {sucursal.direccion}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {sucursal.telefono}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getAreasPorSucursal(sucursal.id_sucursal).length} áreas
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {sucursal.activo ? (
                          <Badge variant="default" className="bg-green-500">Activo</Badge>
                        ) : (
                          <Badge variant="destructive">Inactivo</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSucursal(sucursal)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSucursal(sucursal.id_sucursal)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="areas" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Áreas de Trabajo</CardTitle>
                  <CardDescription>Lista de todas las áreas de trabajo por sucursal</CardDescription>
                </div>
                <Dialog open={isAreaDialogOpen} onOpenChange={setIsAreaDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetAreaForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Área
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingArea ? 'Editar Área' : 'Nueva Área de Trabajo'}
                      </DialogTitle>
                      <DialogDescription>
                        Complete los datos del área de trabajo
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="sucursal">Sucursal</Label>
                        
                        <Select
                          value={nuevaArea.id_sucursal?.toString() || ""} 
                          onValueChange={(value: string) => setNuevaArea({
                            ...nuevaArea,
                            id_sucursal: value ? parseInt(value) : 0
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una sucursal" />
                          </SelectTrigger>
                          <SelectContent>
                            {sucursales.map((sucursal) => (
                              <SelectItem key={sucursal.id_sucursal} value={sucursal.id_sucursal.toString()}>
                                {sucursal.nombre_sucursal}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nombre_area">Nombre del Área</Label>
                        <Input
                          id="nombre_area"
                          value={nuevaArea.nombre_area}
                          onChange={(e) => setNuevaArea({ ...nuevaArea, nombre_area: e.target.value })}
                          placeholder="Ej: Desarrollo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="descripcion_area">Descripción</Label>
                        <Textarea
                          id="descripcion_area"
                          value={nuevaArea.descripcion}
                          onChange={(e) => setNuevaArea({ ...nuevaArea, descripcion: e.target.value })}
                          placeholder="Descripción del área de trabajo"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAreaDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveArea}>
                        {editingArea ? 'Actualizar' : 'Crear'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Área</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Sucursal</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {areas.map((area) => (
                    <TableRow key={area.id_area}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          {area.nombre_area}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {area.descripcion}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {getSucursalNombre(area.id_sucursal)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditArea(area)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteArea(area.id_area)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default SucursalPage;