
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  to?: string;
  className?: string;
}

export const BackButton = ({ to = "/dashboard", className = "" }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleBack}
      className={`animate-fade-in ${className}`}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Voltar
    </Button>
  );
};
