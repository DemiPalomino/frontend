import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Users,
  Plus,
  Search,
  Edit,
  Eye,
  Mail,
  Phone,
  Calendar,
  Building,
  Shield,
  User as UserIcon,
  Lock
} from 'lucide-react';
import { personas as initialPersonas, areasTrabajo, usuarios as initialUsuarios, tiposUsuario } from '../../data/mockData';
import { Persona, Usuario } from '../../types/database';
import { toast } from 'sonner@2.0.3';

export function Empleados() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Persona | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [personas, setPersonas] = useState<Persona[]>(initialPersonas);
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);

  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    fecha_ingreso: new Date().toISOString().split('T')[0],
    id_area_trabajo: 0,
    activo: true,
    // Campos de usuario
    nombre_usuario: '',
    contrasena: '',
    id_tipo_usuario: 2, // Por defecto empleado
  });

  const filteredEmployees = personas.filter(persona =>
    persona.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.dni.includes(searchTerm) ||
    persona.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAreaName = (areaId: number) => {
    const area = areasTrabajo.find(a => a.id_area === areaId);
    return area ? area.nombre_area : 'Sin área';
  };

  const getUsuarioByPersonaId = (personaId: number) => {
    return usuarios.find(u => u.id_persona === personaId);
  };

  const getTipoUsuarioNombre = (tipoId: number) => {
    const tipo = tiposUsuario.find(t => t.id_tipo_usuario === tipoId);
    return tipo ? tipo.nombre_tipo : 'N/A';
  };

  const handleViewEmployee = (employee: Persona) => {
    setSelectedEmployee(employee);
    setShowViewDialog(true);
  };

  const handleEditEmployee = (employee: Persona) => {
    setSelectedEmployee(employee);
    const usuario = getUsuarioByPersonaId(employee.id_persona);

    setFormData({
      nombres: employee.nombres,
      apellidos: employee.apellidos,
      dni: employee.dni,
      email: employee.email,
      telefono: employee.telefono,
      fecha_nacimiento: employee.fecha_nacimiento,
      fecha_ingreso: employee.fecha_ingreso,
      id_area_trabajo: employee.id_area_trabajo,
      activo: employee.activo,
      nombre_usuario: usuario?.nombre_usuario || '',
      contrasena: usuario?.contrasena || '',
      id_tipo_usuario: usuario?.id_tipo_usuario || 2,
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setFormData({
      nombres: '',
      apellidos: '',
      dni: '',
      email: '',
      telefono: '',
      fecha_nacimiento: '',
      fecha_ingreso: new Date().toISOString().split('T')[0],
      id_area_trabajo: 0,
      activo: true,
      nombre_usuario: '',
      contrasena: '',
      id_tipo_usuario: 2,
    });
    setSelectedEmployee(null);
  };

  const validateForm = () => {
    if (!formData.nombres || !formData.apellidos || !formData.dni || !formData.email) {
      toast.error('Por favor complete todos los campos obligatorios');
      return false;
    }
    if (!formData.nombre_usuario || !formData.contrasena) {
      toast.error('Por favor complete los datos de usuario y contraseña');
      return false;
    }
    if (!formData.id_area_trabajo) {
      toast.error('Por favor seleccione un área de trabajo');
      return false;
    }
    return true;
  };

  const handleSaveEmployee = () => {
    if (!validateForm()) return;

    const newPersona: Persona = {
      id_persona: Math.max(...personas.map(p => p.id_persona)) + 1,
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      dni: formData.dni,
      email: formData.email,
      telefono: formData.telefono,
      fecha_nacimiento: formData.fecha_nacimiento,
      fecha_ingreso: formData.fecha_ingreso,
      id_area_trabajo: formData.id_area_trabajo,
      activo: formData.activo,
      imagen: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
    };

    const newUsuario: Usuario = {
      id_usuario: Math.max(...usuarios.map(u => u.id_usuario)) + 1,
      nombre_usuario: formData.nombre_usuario,
      contrasena: formData.contrasena,
      id_tipo_usuario: formData.id_tipo_usuario,
      ultimo_acceso: new Date().toISOString(),
      id_persona: newPersona.id_persona,
    };

    setPersonas([...personas, newPersona]);
    setUsuarios([...usuarios, newUsuario]);
    toast.success('Empleado creado exitosamente');
    setShowAddDialog(false);
    resetForm();
  };

  const handleUpdateEmployee = () => {
    if (!validateForm() || !selectedEmployee) return;

    const updatedPersonas = personas.map(p =>
      p.id_persona === selectedEmployee.id_persona
        ? {
          ...p,
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          dni: formData.dni,
          email: formData.email,
          telefono: formData.telefono,
          fecha_nacimiento: formData.fecha_nacimiento,
          fecha_ingreso: formData.fecha_ingreso,
          id_area_trabajo: formData.id_area_trabajo,
          activo: formData.activo,
        }
        : p
    );

    const usuarioExistente = getUsuarioByPersonaId(selectedEmployee.id_persona);
    let updatedUsuarios = [...usuarios];

    if (usuarioExistente) {
      updatedUsuarios = usuarios.map(u =>
        u.id_persona === selectedEmployee.id_persona
          ? {
            ...u,
            nombre_usuario: formData.nombre_usuario,
            contrasena: formData.contrasena,
            id_tipo_usuario: formData.id_tipo_usuario,
          }
          : u
      );
    } else {
      const newUsuario: Usuario = {
        id_usuario: Math.max(...usuarios.map(u => u.id_usuario)) + 1,
        nombre_usuario: formData.nombre_usuario,
        contrasena: formData.contrasena,
        id_tipo_usuario: formData.id_tipo_usuario,
        ultimo_acceso: new Date().toISOString(),
        id_persona: selectedEmployee.id_persona,
      };
      updatedUsuarios = [...usuarios, newUsuario];
    }

    setPersonas(updatedPersonas);
    setUsuarios(updatedUsuarios);
    toast.success('Empleado actualizado exitosamente');
    setShowEditDialog(false);
    resetForm();
  };

  const EmployeeFormFields = () => (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground">Datos Personales</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombres">Nombres *</Label>
            <Input
              id="nombres"
              value={formData.nombres}
              onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
              placeholder="Juan Carlos"
            />
          </div>
          <div>
            <Label htmlFor="apellidos">Apellidos *</Label>
            <Input
              id="apellidos"
              value={formData.apellidos}
              onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
              placeholder="García López"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="dni">DNI *</Label>
          <Input
            id="dni"
            value={formData.dni}
            onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
            placeholder="12345678"
            maxLength={8}
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="correo@empresa.com"
          />
        </div>
        <div>
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            placeholder="987654321"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
            <Input
              id="fecha_nacimiento"
              type="date"
              value={formData.fecha_nacimiento}
              onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="fecha_ingreso">Fecha de Ingreso</Label>
            <Input
              id="fecha_ingreso"
              type="date"
              value={formData.fecha_ingreso}
              onChange={(e) => setFormData({ ...formData, fecha_ingreso: e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="area">Área de Trabajo *</Label>
          <Select
            value={formData.id_area_trabajo.toString()}
            onValueChange={(value) => setFormData({ ...formData, id_area_trabajo: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un área" />
            </SelectTrigger>
            <SelectContent>
              {areasTrabajo.map((area) => (
                <SelectItem key={area.id_area} value={area.id_area.toString()}>
                  {area.nombre_area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-medium text-sm text-muted-foreground">Datos de Usuario</h4>
        <div>
          <Label htmlFor="nombre_usuario">
            <UserIcon className="w-4 h-4 inline mr-1" />
            Nombre de Usuario *
          </Label>
          <Input
            id="nombre_usuario"
            value={formData.nombre_usuario}
            onChange={(e) => setFormData({ ...formData, nombre_usuario: e.target.value })}
            placeholder="juan.garcia"
          />
        </div>
        <div>
          <Label htmlFor="contrasena">
            <Lock className="w-4 h-4 inline mr-1" />
            Contraseña *
          </Label>
          <Input
            id="contrasena"
            type="password"
            value={formData.contrasena}
            onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
            placeholder="********"
          />
        </div>
        <div>
          <Label htmlFor="rol">
            <Shield className="w-4 h-4 inline mr-1" />
            Rol *
          </Label>
          <Select
            value={formData.id_tipo_usuario.toString()}
            onValueChange={(value) => setFormData({ ...formData, id_tipo_usuario: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              {tiposUsuario.map((tipo) => (
                <SelectItem key={tipo.id_tipo_usuario} value={tipo.id_tipo_usuario.toString()}>
                  {tipo.nombre_tipo.charAt(0).toUpperCase() + tipo.nombre_tipo.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1>Gestión de Empleados</h1>
          <p className="text-muted-foreground">Administra la información de los empleados de la empresa</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={(open) => {
          setShowAddDialog(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
              <DialogDescription>
                Completa los siguientes campos para agregar un nuevo empleado al sistema.
              </DialogDescription>
            </DialogHeader>
            <EmployeeFormFields />
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                resetForm();
              }}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEmployee}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nombre, DNI o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Empleados</p>
                <p className="text-2xl font-semibold">{personas.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Empleados Activos</p>
                <p className="text-2xl font-semibold text-green-600">
                  {personas.filter(p => p.activo).length}
                </p>
              </div>
              <Building className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Empleados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Empleado</th>
                  <th className="text-left py-3 px-4">DNI</th>
                  <th className="text-left py-3 px-4">Usuario</th>
                  <th className="text-left py-3 px-4">Rol</th>
                  <th className="text-left py-3 px-4">Área</th>
                  <th className="text-left py-3 px-4">Contacto</th>
                  <th className="text-left py-3 px-4">Fecha Ingreso</th>
                  <th className="text-left py-3 px-4">Estado</th>
                  <th className="text-left py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((empleado) => {
                  const usuario = getUsuarioByPersonaId(empleado.id_persona);
                  return (
                    <tr key={empleado.id_persona} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={empleado.imagen}
                            alt={empleado.nombres}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">{empleado.nombres} {empleado.apellidos}</p>
                            <p className="text-sm text-muted-foreground">{empleado.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">{empleado.dni}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <UserIcon className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{usuario?.nombre_usuario || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {usuario && (
                          <Badge variant={usuario.id_tipo_usuario === 1 ? "default" : "secondary"}>
                            <Shield className="w-3 h-3 mr-1" />
                            {getTipoUsuarioNombre(usuario.id_tipo_usuario)}
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline">{getAreaName(empleado.id_area_trabajo)}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <p className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {empleado.telefono}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(empleado.fecha_ingreso).toLocaleDateString('es-ES')}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={empleado.activo ? "default" : "outline"} className={empleado.activo ? "bg-green-500" : ""}>
                          {empleado.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewEmployee(empleado)}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditEmployee(empleado)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Employee Dialog */}
      <Dialog open={showEditDialog} onOpenChange={(open) => {
        setShowEditDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Empleado</DialogTitle>
            <DialogDescription>
              Modifica los datos del empleado seleccionado.
            </DialogDescription>
          </DialogHeader>
          <EmployeeFormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditDialog(false);
              resetForm();
            }}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateEmployee}>Actualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Employee Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles del Empleado</DialogTitle>
            <DialogDescription>
              Información completa del empleado seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (() => {
            const usuario = getUsuarioByPersonaId(selectedEmployee.id_persona);
            return (
              <div className="space-y-4">
                <div className="text-center">
                  <img
                    src={selectedEmployee.imagen}
                    alt={selectedEmployee.nombres}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold">
                    {selectedEmployee.nombres} {selectedEmployee.apellidos}
                  </h3>
                  <p className="text-muted-foreground">{getAreaName(selectedEmployee.id_area_trabajo)}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">DNI</Label>
                      <p className="font-medium">{selectedEmployee.dni}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Teléfono</Label>
                      <p className="font-medium">{selectedEmployee.telefono}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedEmployee.email}</p>
                  </div>

                  <div className="pt-3 border-t">
                    <Label className="text-muted-foreground mb-2 block">Datos de Usuario</Label>
                    <div className="space-y-2 bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-muted-foreground" />
                        <span>Usuario: <strong>{usuario?.nombre_usuario || 'N/A'}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-muted-foreground" />
                        <span>Rol:
                          {usuario && (
                            <Badge variant={usuario.id_tipo_usuario === 1 ? "default" : "secondary"} className="ml-2">
                              {getTipoUsuarioNombre(usuario.id_tipo_usuario)}
                            </Badge>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                        <span>Contraseña: <strong>{'•'.repeat(8)}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <Label className="text-muted-foreground">Fecha Nacimiento</Label>
                      <p className="font-medium">
                        {new Date(selectedEmployee.fecha_nacimiento).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Fecha Ingreso</Label>
                      <p className="font-medium">
                        {new Date(selectedEmployee.fecha_ingreso).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Estado</Label>
                    <div className="mt-1">
                      <Badge variant={selectedEmployee.activo ? "default" : "outline"} className={selectedEmployee.activo ? "bg-green-500" : ""}>
                        {selectedEmployee.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
