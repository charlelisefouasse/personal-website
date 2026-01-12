import { ChevronUpIcon } from "lucide-react";

const skills = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Testing",
    items: ["Vitest", "Cypress", "Jest", "Playwright"],
  },
  {
    title: "Tools",
    items: ["Git", "GitHub", "GitLab", "VS Code"],
  },
  {
    title: "Project Management",
    items: ["Jira", "Agile", "Scrum"],
  },
];

const ProfessionalPage = () => {
  return (
    <div className="bg-grid relative flex h-svh w-full flex-col overflow-hidden p-4 text-gray-800 md:p-8">
      <div className="flex flex-1 flex-col items-center gap-4 md:gap-24">
        <div className="flex items-center gap-2 text-lg">
          See more <ChevronUpIcon />
        </div>
        <div className="bg-pro-bg flex max-w-5xl flex-col items-center gap-6 self-center border-2 border-gray-300 p-4 text-center shadow-[6px_10px_0px_0px_rgba(0,0,0,0.8)] md:gap-12 md:p-12">
          <div className="flex flex-col gap-4">
            <h2 className="font-orbitron text-xl font-bold md:text-3xl">
              Hi👋 ! My name is Charlélise Fouasse
            </h2>
            <h3 className="font-orbitron text-lg font-bold md:text-2xl">
              Frontend developer
            </h3>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {skills.map((category) => (
              <div
                key={category.title}
                className="bg-pro-bg flex flex-col gap-4 border border-gray-300 p-2 md:p-6"
              >
                <h3 className="font-orbitron text-sm font-bold tracking-wider uppercase">
                  {category.title}
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalPage;
