import { ChartAreaGradient } from "@/components/ui/areaChart";
import { ChartBarInteractive } from "@/components/ui/barCharts";
import { ChartPieLabel } from "@/components/ui/donutChart";
import { ChartRadialLabel } from "@/components/ui/radialCharts";
import { ChartRadarDefault } from "@/components/ui/radialChartSimple";

export default function Dashboard() {
    return (
        <div className="h-full space-y-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <div className="grid gap-6">
                <div className="w-full h-[400px]">
                    <ChartBarInteractive />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ChartPieLabel />
                    <ChartRadialLabel />
                    <ChartRadarDefault />
                    <ChartAreaGradient />
                </div>
            </div>
        </div>
    );
}