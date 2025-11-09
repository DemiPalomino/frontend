import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Building2, MapPin, Phone, Plus, Edit, Trash2, Briefcase } from 'lucide-react';
import { sucursales, areasTrabajo } from '../../data/mockData';
import { Sucursal, AreaTrabajo } from '../../types/database';
import { toast } from 'sonner@2.0.3';

export const Sucursales: React.FC = () => {
  const [sucursalesList, setSucursalesList] = useState<Sucursal[]>(sucursales);
  const [areasList, setAreasList] = useState<AreaTrabajo[]>(areasTrabajo);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAreaDialogOpen, setIsAreaDialogOpen] = useState(false);
  const [editingSucursal, setEditingSucursal] = useState<Sucursal | null>(null);
  const [editingArea, setEditingArea] = useState<AreaTrabajo | null>(null);

  const [newSucursal, setNewSucursal] = useState({
    nombre_sucursal: '',
    direccion: '',
    telefono: '',
  });

  const [newArea, setNewArea] = useState({
    nombre_area: '',
    descripcion: '',
    id_sucursal: 0,
  });

  const handleSaveSucursal = () => {
    if (!newSucursal.nombre_sucursal || !newSucursal.direccion) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    if (editingSucursal) {
      setSucursalesList(sucursalesList.map(s => 
        s.id_sucursal === editingSucursal.id_sucursal 
          ? { ...editingSucursal, ...newSucursal }
          : s
      ));
      toast.success('Sucursal actualizada correctamente');
    } else {
      const nuevaSucursal: Sucursal = {
        id_sucursal: Math.max(...sucursalesList.map(s => s.id_sucursal)) + 1,
        ...newSucursal,
        activo: true,
      };
      setSucursalesList([...sucursalesList, nuevaSucursal]);
      toast.success('Sucursal creada correctamente');
    }

    setIsDialogOpen(false);
    setEditingSucursal(null);
    setNewSucursal({ nombre_sucursal: '', direccion: '', telefono: '' });
  };

  const handleSaveArea = () => {
    if (!newArea.nombre_area || !newArea.id_sucursal) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    if (editingArea) {
      setAreasList(areasList.map(a => 
        a.id_area === editingArea.id_area 
          ? { ...editingArea, ...newArea }
          : a
      ));
      toast.success('Área actualizada correctamente');
    } else {
      const nuevaArea: AreaTrabajo = {
        id_area: Math.max(...areasList.map(a => a.id_area)) + 1,
        ...newArea,
      };
      setAreasList([...areasList, nuevaArea]);
      toast.success('Área creada correctamente');
    }

    setIsAreaDialogOpen(false);
    setEditingArea(null);
    setNewArea({ nombre_area: '', descripcion: '', id_sucursal: 0 });
  };

  const handleEditSucursal = (sucursal: Sucursal) => {
    setEditingSucursal(sucursal);
    setNewSucursal({
      nombre_sucursal: sucursal.nombre_sucursal,
      direccion: sucursal.direccion,
      telefono: sucursal.telefono,
    });
    setIsDialogOpen(true);
  };

  const handleEditArea = (area: AreaTrabajo) => {
    setEditingArea(area);
    setNewArea({
      nombre_area: area.nombre_area,
      descripcion: area.descripcion,
      id_sucursal: area.id_sucursal,
    });
    setIsAreaDialogOpen(true);
  };

  const handleDeleteSucursal = (id: number) => {
    setSucursalesList(sucursalesList.filter(s => s.id_sucursal !== id));
    toast.success('Sucursal eliminada correctamente');
  };

  const handleDeleteArea = (id: number) => {
    setAreasList(areasList.filter(a => a.id_area !== id));
    toast.success('Área eliminada correctamente');
  };

  const getSucursalNombre = (id_sucursal: number) => {
    return sucursalesList.find(s => s.id_sucursal === id_sucursal)?.nombre_sucursal || 'N/A';
  };

  const getAreasBySucursal = (id_sucursal: number) => {
    return areasList.filter(a => a.id_sucursal === id_sucursal);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Gestión de Sucursales y Áreas</h1>
        <p className="text-muted-foreground mt-1">
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
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingSucursal(null);
                      setNewSucursal({ nombre_sucursal: '', direccion: '', telefono: '' });
                    }}>
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
                        <Label htmlFor="nombre_sucursal">Nombre de la Sucursal *</Label>
                        <Input
                          id="nombre_sucursal"
                          value={newSucursal.nombre_sucursal}
                          onChange={(e) => setNewSucursal({ ...newSucursal, nombre_sucursal: e.target.value })}
                          placeholder="Ej: Sede Central - Lima"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="direccion">Dirección *</Label>
                        <Textarea
                          id="direccion"
                          value={newSucursal.direccion}
                          onChange={(e) => setNewSucursal({ ...newSucursal, direccion: e.target.value })}
                          placeholder="Dirección completa de la sucursal"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          value={newSucursal.telefono}
                          onChange={(e) => setNewSucursal({ ...newSucursal, telefono: e.target.value })}
                          placeholder="01-1234567"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
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
                  {sucursalesList.map((sucursal) => (
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
                          {getAreasBySucursal(sucursal.id_sucursal).length} áreas
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
                    <Button onClick={() => {
                      setEditingArea(null);
                      setNewArea({ nombre_area: '', descripcion: '', id_sucursal: 0 });
                    }}>
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
                        <Label htmlFor="sucursal">Sucursal *</Label>
                        <Select
                          value={newArea.id_sucursal.toString()}
                          onValueChange={(value) => setNewArea({ ...newArea, id_sucursal: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una sucursal" />
                          </SelectTrigger>
                          <SelectContent>
                            {sucursalesList.map((sucursal) => (
                              <SelectItem key={sucursal.id_sucursal} value={sucursal.id_sucursal.toString()}>
                                {sucursal.nombre_sucursal}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nombre_area">Nombre del Área *</Label>
                        <Input
                          id="nombre_area"
                          value={newArea.nombre_area}
                          onChange={(e) => setNewArea({ ...newArea, nombre_area: e.target.value })}
                          placeholder="Ej: Desarrollo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="descripcion_area">Descripción</Label>
                        <Textarea
                          id="descripcion_area"
                          value={newArea.descripcion}
                          onChange={(e) => setNewArea({ ...newArea, descripcion: e.target.value })}
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
                  {areasList.map((area) => (
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
