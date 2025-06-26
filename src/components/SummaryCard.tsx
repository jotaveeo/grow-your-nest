import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const SummaryCard = ({
  title,
  value,
  icon: Icon,
  trend,
  className = "",
}: SummaryCardProps) => {
  return (
    <Card
      className={`transition-all duration-200 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary/40 ${className}`}
      tabIndex={0}
      aria-label={title}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 lg:px-6 pt-4 lg:pt-6">
        <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground leading-tight">
          {title}
        </CardTitle>
        <Icon
          className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground flex-shrink-0"
          aria-hidden="true"
        />
      </CardHeader>
      <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
        <div
          className="text-lg lg:text-2xl font-bold leading-tight break-all"
          aria-live="polite"
        >
          {value}
        </div>
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            <span
              className={`text-xs lg:text-sm font-medium ${
                trend.isPositive ? "text-success" : "text-destructive"
              }`}
              aria-label={
                trend.isPositive
                  ? `Aumento de ${trend.value}% em relação ao mês anterior`
                  : `Queda de ${trend.value}% em relação ao mês anterior`
              }
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-xs lg:text-sm text-muted-foreground">
              em relação ao mês anterior
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
