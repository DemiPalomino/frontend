import React, { useState } from 'react';
import { useReporte } from '../controllers/useReporte';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { 
  BarChart3, 
  Download, 
  Filter,
  CalendarIcon,
  Clock,
  TrendingUp,
  Users
} from 'lucide-react';

export const ReportesPage: React.FC = () => {
  const { reporte, loading, error, generarReporte, exportarPDF } = useReporte();
  
  const [filtros, setFiltros] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    id_area: '',
    id_persona: ''
  });

  const handleGenerarReporte = async () => {
    try {
      await generarReporte({
        fecha_inicio: filtros.fecha_inicio,
        fecha_fin: filtros.fecha_fin,
        id_area: filtros.id_area ? parseInt(filtros.id_area) : undefined,
        id_persona: filtros.id_persona ? parseInt(filtros.id_persona) : undefined
      });
    } catch (error) {
   
    }
  };

  const handleExportarPDF = async () => {
    try {
      await exportarPDF({
        fecha_inicio: filtros.fecha_inicio,
        fecha_fin: filtros.fecha_fin,
        id_area: filtros.id_area ? parseInt(filtros.id_area) : undefined,
      });
    } catch (error) {
      alert('Error al exportar PDF: ' + error);
    }
  };


  const totalRegistros = reporte.length;
  const totalTardanzas = reporte.filter(a => a.miniTardanza > 0).length;
  const totalFaltas = 0;
  const promedioAsistencia = totalRegistros > 0 ? ((totalRegistros - totalTardanzas) / totalRegistros * 100).toFixed(1) : '0';

  return (
    <div className="p-6 space-y-6">
      {/* CABECERA */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reportes de Asistencia</h1>
          <p className="text-gray-600">Analiza los patrones de asistencia y genera reportes detallados</p>
        </div>
        <Button onClick={handleExportarPDF} disabled={loading}>
          <Download className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Fecha Inicio</label>
              <Input
                type="date"
                value={filtros.fecha_inicio}
                onChange={(e) => setFiltros({...filtros, fecha_inicio: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Fecha Fin</label>
              <Input
                type="date"
                value={filtros.fecha_fin}
                onChange={(e) => setFiltros({...filtros, fecha_fin: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Área</label>
              <Select value={filtros.id_area} onValueChange={(value: any) => setFiltros({...filtros, id_area: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las áreas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Diseño</SelectItem>
                  <SelectItem value="2">Ventas</SelectItem>
                  <SelectItem value="3">Ploteo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleGenerarReporte} disabled={loading} className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                {loading ? 'Generando...' : 'Generar Reporte'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjetas de Estadisticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Registros</p>
                <p className="text-2xl font-semibold text-blue-600">{totalRegistros}</p>
                <p className="text-xs text-gray-500">En el período</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tardanzas</p>
                <p className="text-2xl font-semibold text-orange-600">{totalTardanzas}</p>
                <p className="text-xs text-gray-500">En el período</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Faltas</p>
                <p className="text-2xl font-semibold text-red-600">{totalFaltas}</p>
                <p className="text-xs text-gray-500">En el período</p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">% Asistencia</p>
                <p className="text-2xl font-semibold text-green-600">{promedioAsistencia}%</p>
                <p className="text-xs text-gray-500">Promedio</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resultados del Reporte */}
      <Card>
        <CardHeader>
          <CardTitle>Reporte de Asistencias</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800">Error: {error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Generando reporte...</p>
            </div>
          ) : reporte.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No hay datos para mostrar. Aplica los filtros y genera un reporte.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3">Empleado</th>
                    <th className="text-left py-3">Fecha</th>
                    <th className="text-left py-3">Hora Entrada</th>
                    <th className="text-left py-3">Hora Salida</th>
                    <th className="text-left py-3">Tardanza</th>
                    <th className="text-left py-3">Método</th>
                  </tr>
                </thead>
                <tbody>
                  {reporte.map((asistencia) => (
                    <tr key={asistencia.id_asistencia} className="border-b border-gray-100">
                      <td className="py-4">
                        <div>
                          <p className="font-medium">{asistencia.nombres} {asistencia.apellidos}</p>
                          <p className="text-sm text-gray-500">{asistencia.nombre_area}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        {new Date(asistencia.fecha_ingreso).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-4">{asistencia.hora_entrada}</td>
                      <td className="py-4">
                        {asistencia.hora_salida || (
                          <Badge variant="outline" className="text-orange-600">
                            No registrada
                          </Badge>
                        )}
                      </td>
                      <td className="py-4">
                        {asistencia.miniTardanza > 0 ? (
                          <Badge variant="destructive">{asistencia.miniTardanza} min</Badge>
                        ) : (
                          <Badge variant="secondary">A tiempo</Badge>
                        )}
                      </td>
                      <td className="py-4">
                        <Badge variant={asistencia.metodo_registro === 'reconocimientoFacial' ? 'default' : 'secondary'}>
                          {asistencia.metodo_registro === 'reconocimientoFacial'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default ReportesPage;