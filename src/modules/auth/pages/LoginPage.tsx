import { Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); 
  const { login } = useAuth();
  
  const handleLogin = async (user: string, password: string) => {
    setError("");
    setIsLoading(true);
    
    try {
      await login(user, password);
      navigate("/dashboard"); 
    } catch (err: any) {
      setError("Usuario o contraseña incorrectos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle>Sistema de Asistencia</CardTitle>
          <CardDescription>
            Control de asistencia con reconocimiento facial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error}/>
        </CardContent>
      </Card>
    </div>
  );
}