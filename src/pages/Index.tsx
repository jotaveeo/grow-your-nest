import Dashboard from "./Dashboard";
import { useAuth } from "@/hooks/useAuth"; // Exemplo de hook de autenticação
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg font-medium">Carregando...</span>
      </div>
    );
  }

  return <Dashboard />;
};

export default Index;
