import { AlertCircle, Building2, Loader2, Lock, Mail, Package, Shield, User } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { useState } from "react";

interface LoginFormProps {
    onSubmit: (user: string, password:string) => void;
    isLoading?: boolean;
    error?: string;
}

export default function LoginForm({onSubmit, isLoading,error}: LoginFormProps) {
    const [usuario, setUser] = useState("");
    const [password, setPassword] = useState("");

      const handle = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(usuario,password);
      }
    return (
        <form onSubmit={handle} className="space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="username"
                        type="text"
                        placeholder="Ingrese su usuario"
                        value={usuario}
                        onChange={(e) => setUser(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> 
                    <Input
                        id="password"
                        type="password"
                        placeholder="Ingrese su contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"

                    />
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !usuario || !password}>
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Iniciando sesión...
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Iniciar Sesión
                    </div>
                )}
            </Button>
        </form>
    )
}