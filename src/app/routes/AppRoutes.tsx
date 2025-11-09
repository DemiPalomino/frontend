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

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas públicas */}
                <Route element={<AuthLayout />}>
                    {AuthRoutes}
                </Route>
                
                {/* Rutas protegidas */}
                <Route element={<AdminLayout />}>
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/empleados" element={
                        <ProtectedRoute>
                            <EmpleadoPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/horarios" element={
                        <ProtectedRoute>
                            <HorariosPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/permisos" element={
                        <ProtectedRoute>
                            <PermisoPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/registro" element={
                        <ProtectedRoute>
                            <RegistroAsistenciaPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/reportes" element={
                        <ProtectedRoute>
                            <ReportesPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/sucursales" element={
                        <ProtectedRoute>
                            <SucursalPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/configuracion" element={
                        <ProtectedRoute>
                            <ConfiguracionPages />
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