import { Edit3, Share2, MessageSquare, UserPlus, FileText } from "lucide-react";

interface Activity {
  icon: React.ReactNode;
  action: string;
  target: string;
  time: string;
  user?: string;
}

const RecentActivity = () => {
  const activities: Activity[] = [
    {
      icon: <Edit3 className="w-4 h-4" />,
      action: "You edited",
      target: "Product Roadmap",
      time: "5 min ago",
    },
    {
      icon: <Share2 className="w-4 h-4" />,
      action: "Sarah shared",
      target: "Design System",
      time: "1 hour ago",
      user: "Sarah",
    },
    {
      icon: <MessageSquare className="w-4 h-4" />,
      action: "New comment on",
      target: "User Flow Diagram",
      time: "2 hours ago",
    },
    {
      icon: <UserPlus className="w-4 h-4" />,
      action: "Mike joined",
      target: "Sprint Planning",
      time: "3 hours ago",
      user: "Mike",
    },
    {
      icon: <FileText className="w-4 h-4" />,
      action: "You created",
      target: "API Architecture",
      time: "Yesterday",
    },
  ];

  return (
    <div className="bg-[hsl(222,47%,14%)] border border-[hsl(222,47%,25%)] rounded-xl p-5">
      <h3 className="text-lg font-semibold text-[hsl(210,40%,98%)] mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[hsl(222,47%,20%)] text-[hsl(174,72%,56%)]">
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[hsl(210,40%,98%)]">
                <span className="text-[hsl(215,20%,65%)]">{activity.action}</span>{" "}
                <span className="font-medium text-[hsl(174,72%,56%)]">{activity.target}</span>
              </p>
              <p className="text-xs text-[hsl(215,20%,65%)] mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-2 text-sm text-[hsl(174,72%,56%)] hover:text-[hsl(174,72%,66%)] transition-colors">
        View all activity
      </button>
    </div>
  );
};

export default RecentActivity;
