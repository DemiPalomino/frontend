import React, { useState } from 'react';
import { useEmpleado } from '../controllers/useEmpleado';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Users, Plus, Search, Edit, Eye, Mail, Phone, Calendar, Building } from 'lucide-react';

export const EmpleadoPage: React.FC = () => {
  const { 
    empleados, 
    loading, 
    error 
  } = useEmpleado();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = empleados.filter(empleado =>
    empleado.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.dni.includes(searchTerm) ||
    empleado.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAreaName = (areaId: number) => {
    const areas = {
      1: 'Desarrollo',
      2: 'Marketing',
      3: 'Recursos Humanos', 
      4: 'Administración'
    };
    return areas[areaId as keyof typeof areas] || 'Sin área';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando empleados...</p>
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
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gestión de Empleados</h1>
          <p className="text-gray-600">Administra la información de los empleados de la empresa</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Empleado
        </Button>
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
                <p className="text-sm text-gray-600">Total Empleados</p>
                <p className="text-2xl font-semibold">{empleados.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Empleados Activos</p>
                <p className="text-2xl font-semibold text-green-600">
                  {empleados.filter(e => e.activo).length}
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
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No se encontraron empleados que coincidan con la búsqueda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Empleado</th>
                    <th className="text-left py-3 px-4">DNI</th>
                    <th className="text-left py-3 px-4">Contacto</th>
                    <th className="text-left py-3 px-4">Área</th>
                    <th className="text-left py-3 px-4">Fecha Ingreso</th>
                    <th className="text-left py-3 px-4">Estado</th>
                    <th className="text-left py-3 px-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((empleado) => (
                    <tr key={empleado.id_persona} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">{empleado.nombres} {empleado.apellidos}</p>
                            <p className="text-sm text-gray-500">{empleado.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">{empleado.dni}</td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <p className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {empleado.email}
                          </p>
                          <p className="flex items-center mt-1">
                            <Phone className="w-3 h-3 mr-1" />
                            {empleado.telefono}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline">{getAreaName(empleado.id_area_trabajo)}</Badge>
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
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default EmpleadoPage;