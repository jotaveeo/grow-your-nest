
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface SummaryCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export const SummaryCard = ({ title, value, icon: Icon, trend, className = "" }: SummaryCardProps) => {
  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 lg:px-6 pt-4 lg:pt-6">
        <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground leading-tight">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground flex-shrink-0" />
      </CardHeader>
      <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
        <div className="text-lg lg:text-2xl font-bold leading-tight break-all">
          {value}
        </div>
        {trend && (
          <p className={`text-xs lg:text-sm mt-1 ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}% em relação ao mês anterior
          </p>
        )}
      </CardContent>
    </Card>
  )
}
