import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

const Cadastro = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Função para validar email
  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Função para validar senha (mínimo 8 caracteres, 1 número, 1 caractere especial)
  const isPasswordValid = (password: string) =>
    password.length >= 8 &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("O nome é obrigatório.");
      return;
    }
    if (!isEmailValid(form.email)) {
      alert("Digite um e-mail válido.");
      return;
    }
    if (!isPasswordValid(form.password)) {
      alert(
        "A senha deve ter pelo menos 8 caracteres, incluindo um número e um caractere especial."
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1200);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // Redirecione ou salve o usuário conforme sua lógica
      navigate("/dashboard");
    } catch (error) {
      alert("Erro ao autenticar com Google");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Criar Conta no FinanceFlow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
              <span className="text-xs text-muted-foreground">
                Mínimo 8 caracteres, incluindo número e caractere especial.
              </span>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>
          <Button
            type="button"
            className="w-full mt-2"
            onClick={handleGoogleSignIn}
            variant="outline"
          >
            Entrar com Google
          </Button>
          <div className="text-center text-sm mt-4">
            Já tem conta?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cadastro;