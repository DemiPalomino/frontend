import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";
import AuthRoutes from "../../modules/auth/routes/AuthRoutes";
import AuthLayout from "../../shared/layouts/AuthLayout";
import AdminLayout from "../../shared/layouts/AdminLayout";
import { DashboardPage } from "../../modules/dashboard/pages/DashboardPage";
import EmpleadoPage from "../../modules/empleado/pages/EmpleadoPage";
import HorariosPage from "../../modules/horarios/pages/HorariosPage";
import PermisoPage from "../../modules/permisos/pages/PermisoPage";
import RegistroAsistenciaPage from "../../modules/registroAsistencia/pages/registroAsistenciaPage";
import ReportesPage from "../../modules/reportes/pages/ReportesPage";
import SucursalPage from "../../modules/sucursales/pages/SucursalPage";
import ConfiguracionPages from "../../modules/configuracion/pages/ConfiguracionPages";
import { ReactElement } from "react";

const RoleProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: ReactElement; 
  allowedRoles: number[] 
}) => {
  const userStr = localStorage.getItem('user');
  let user;
  
  try {
    user = userStr ? JSON.parse(userStr) : {};
  } catch (error) {
    user = {};
  }
  
  const userRole = user?.id_tipo_usuario || user?.role;
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route element={<AuthLayout />}>
                    {AuthRoutes}
                </Route>

                <Route element={<AdminLayout />}>
                    {/* Dashboard para todos los roles */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={[1, 2]}>
                                <DashboardPage />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    } />
                    
                    {/* Solo Admin */}
                    <Route path="/empleados" element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={[1]}>
                                <EmpleadoPage />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    } />
                    
                    {/* Solo Admin */}
                    <Route path="/horarios" element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={[1]}>
                                <HorariosPage />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    } />
                    
                    {/* Para todos */}
                    <Route path="/permisos" element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={[1, 2]}>
                                <PermisoPage />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    } />
                    
                    {/* Para todos */}
                    <Route path="/registro" element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={[1, 2]}>
                                <RegistroAsistenciaPage />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    } />
                    
                    {/* Solo Admin */}
                    <Route path="/reportes" element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={[1]}>
                                <ReportesPage />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    } />
                    
                    {/* Solo Admin */}
                    <Route path="/sucursales" element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={[1]}>
                                <SucursalPage />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    } />
                    
                    {/* Solo Admin */}
                    <Route path="/configuracion" element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={[1]}>
                                <ConfiguracionPages />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    } />
                </Route>
                
                {/* Rutas por defecto */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}