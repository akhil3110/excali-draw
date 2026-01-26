import { Plus, Upload, Layout, Users, Wand2 } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      icon: <Plus className="w-5 h-5" />,
      label: "Blank Board",
      description: "Start from scratch",
      color: "hsl(174,72%,56%)",
    },
    {
      icon: <Layout className="w-5 h-5" />,
      label: "Use Template",
      description: "Choose a template",
      color: "hsl(270,60%,65%)",
    },
    {
      icon: <Upload className="w-5 h-5" />,
      label: "Import File",
      description: "Upload existing work",
      color: "hsl(45,93%,47%)",
    },
    {
      icon: <Wand2 className="w-5 h-5" />,
      label: "AI Generate",
      description: "Create with AI",
      color: "hsl(340,82%,59%)",
    },
  ];

  return (
    <div className="bg-[hsl(222,47%,14%)] border border-[hsl(222,47%,25%)] rounded-xl p-5">
      <h3 className="text-lg font-semibold text-[hsl(210,40%,98%)] mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[hsl(222,47%,18%)] hover:bg-[hsl(222,47%,22%)] border border-transparent hover:border-[hsl(222,47%,30%)] transition-all duration-200 group"
          >
            <div
              className="p-2.5 rounded-lg transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${action.color}20`, color: action.color }}
            >
              {action.icon}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[hsl(210,40%,98%)]">{action.label}</p>
              <p className="text-xs text-[hsl(215,20%,65%)]">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
