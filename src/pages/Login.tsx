import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { Loader2, LogIn } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  // Validação básica de email
  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmailValid(form.email)) {
      alert("Digite um e-mail válido.");
      return;
    }
    if (!form.password) {
      alert("Digite sua senha.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("financi_logged_in", "true");
      navigate("/dashboard");
    }, 1000);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (error) {
      alert("Erro ao autenticar com Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tl from-violet-950 via-violet-700 to-violet-400 relative overflow-hidden">
      {/* Overlay para contraste */}
      <div className="absolute inset-0 bg-white/30 dark:bg-black/30 z-0" />
      <div className="relative z-10 w-full max-w-md">
      <Card
        className="w-full max-w-md shadow-lg backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 border border-white/40 dark:border-zinc-700/40 relative z-10"
      >
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-900 dark:text-white">
              Entrar no{" "}
              <span className="text-violet-700">FinanciControl</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-6"
              onSubmit={handleSubmit}
              autoComplete="on"
            >
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  aria-label="E-mail"
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  aria-label="Senha"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            <Button
              type="button"
              className="w-full mt-2"
              onClick={handleGoogleSignIn}
              variant="outline"
              disabled={googleLoading}
              aria-label="Entrar com Google"
            >
              {googleLoading ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="h-4 w-4 mr-2"
                />
              )}
              {googleLoading ? "Entrando..." : "Entrar com Google"}
            </Button>
            <div className="text-center text-sm mt-4">
              Não tem conta?{" "}
              <Link to="/cadastro" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;