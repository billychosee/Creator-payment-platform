import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtext?: string;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  subtext,
}: StatCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{value}</p>
              {subtext && (
                <p className="text-xs text-muted-foreground">{subtext}</p>
              )}
            </div>
            {trend && (
              <p
                className={`text-xs font-medium ${
                  trend.isPositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {trend.isPositive ? "+" : "-"}
                {trend.value}% this month
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface OverviewCardProps {
  title: string;
  value: string | number;
  isCurrency?: boolean;
}

export const OverviewCard = ({
  title,
  value,
  isCurrency = true,
}: OverviewCardProps) => {
  const displayValue =
    isCurrency && typeof value === "number" ? formatCurrency(value) : value;

  return (
    <Card className="text-center">
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-muted-foreground mb-3">
          {title}
        </p>
        <p className="text-3xl font-bold">{displayValue}</p>
      </CardContent>
    </Card>
  );
};
