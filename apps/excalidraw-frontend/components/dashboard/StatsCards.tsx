import { FileText, Users, Clock, TrendingUp } from "lucide-react";

interface StatCard {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

const StatsCards = () => {
  const stats: StatCard[] = [
    {
      icon: <FileText className="w-6 h-6" />,
      label: "Total Boards",
      value: "24",
      change: "+3 this week",
      changeType: "positive",
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: "Collaborators",
      value: "12",
      change: "+2 new",
      changeType: "positive",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: "Hours Saved",
      value: "48h",
      change: "This month",
      changeType: "neutral",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: "Productivity",
      value: "94%",
      change: "+12% vs last week",
      changeType: "positive",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-[hsl(222,47%,14%)] border border-[hsl(222,47%,25%)] rounded-xl p-5 hover:border-[hsl(174,72%,56%)]/30 transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 rounded-lg bg-[hsl(174,72%,56%)]/10">
              <div className="text-[hsl(174,72%,56%)]">{stat.icon}</div>
            </div>
          </div>
          <div>
            <p className="text-[hsl(215,20%,65%)] text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-[hsl(210,40%,98%)]">{stat.value}</p>
            <p className={`text-xs mt-1 ${
              stat.changeType === "positive" 
                ? "text-[hsl(142,76%,56%)]" 
                : stat.changeType === "negative" 
                  ? "text-[hsl(0,72%,56%)]" 
                  : "text-[hsl(215,20%,65%)]"
            }`}>
              {stat.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
