import { ExternalLinkIcon, GithubIcon } from "lucide-react";
import wavingHand from "@/assets/waving_hand.svg";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import {
  TERMINAL_NAME,
  TerminalPrompt,
} from "@/components/professionnal/TerminalPrompt";

const Projects = [
  {
    title: "Records",
    description: "Register your vinyl records collection",
    image: "/logo_records_pixel.png",
    preview_link: "https://charlelise-vinyl-collection.vercel.app/",
    github_link: "https://github.com/charlelisefouasse/vinyl-collection",
  },
  {
    title: "Concert ticket generator",
    description: "Generate concert tickets to keep as souvenirs",
    image: "",
    preview_link: "https://concert-tickets-generator.vercel.app/",
    github_link: "https://github.com/charlelisefouasse/concert-tickets",
  },
];

const Articles = [
  {
    title: "Les bases du design pour les dev front",
    image: "/cosplay.jpg",
    preview_link:
      "https://www.bearstudio.fr/blog/design-css/les-bases-du-design-pour-dev-front",
  },
];
const skills = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "Tanstack", "TypeScript", "Tailwind CSS"],
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

const contact = [
  { title: "Linkedin", link: "https://www.linkedin.com/in/charlelise-fouasse" },
  { title: "Github", link: "https://github.com/charlelisefouasse" },
];

const ProfessionalPage = () => {
  return (
    <div className="bg-grid relative flex h-svh w-full flex-col justify-center overflow-hidden p-4 py-8 text-gray-800 md:p-8">
      <Tabs
        defaultValue="about"
        className="font-geist-mono relative flex min-h-2/3 w-full max-w-5xl flex-col self-center overflow-hidden rounded-xl border border-neutral-600 bg-[#333333] shadow-sm lg:h-180 lg:min-h-auto lg:shadow-2xl"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between bg-neutral-800 px-4 py-2 text-sm text-gray-300">
          <div className="w-10"></div>
          <div className="font-bold">{TERMINAL_NAME}:~</div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gray-400"></div>
            <div className="h-3 w-3 rounded-full bg-gray-400"></div>
            <div className="h-3 w-3 rounded-full bg-[#E95420]"></div>
          </div>
        </div>

        {/* Terminal Tabs */}
        <TabsList className="flex bg-[#2b2b2b] text-sm text-gray-400">
          <TabsTrigger
            value="about"
            className="border-b-2 border-transparent px-4 py-2 transition-colors hover:bg-[#3c3c3c] data-[state=active]:border-[#E95420] data-[state=active]:text-white"
          >
            About
          </TabsTrigger>
          <TabsTrigger
            value="projects"
            className="border-b-2 border-transparent px-4 py-2 transition-colors hover:bg-[#3c3c3c] data-[state=active]:border-[#E95420] data-[state=active]:text-white"
          >
            Projects
          </TabsTrigger>
          <TabsTrigger
            value="articles"
            className="border-b-2 border-transparent px-4 py-2 transition-colors hover:bg-[#3c3c3c] data-[state=active]:border-[#E95420] data-[state=active]:text-white"
          >
            Articles
          </TabsTrigger>
        </TabsList>

        {/* Terminal Body */}
        <div className="flex flex-col overflow-y-auto p-2 text-left text-sm md:max-h-[60vh] md:p-4 md:text-lg">
          <TabsContent
            value="about"
            className="flex flex-col gap-6 outline-none"
          >
            {/* Command 1: whoami */}
            <div className="flex flex-col gap-2">
              <TerminalPrompt command="whoami" />
              <div className="flex flex-col items-center gap-1 text-center md:gap-2">
                <h2 className="text-lg font-bold text-white md:text-3xl">
                  Hi{" "}
                  <img
                    src={wavingHand}
                    alt="waving hand"
                    className="mb-1 ml-1 inline-block h-6 w-6 md:h-8 md:w-8"
                  />{" "}
                  ! My name is Charlélise Fouasse
                </h2>
                <h3 className="text-base font-bold text-gray-400 md:text-2xl">
                  Frontend developer
                </h3>
              </div>
            </div>

            {/* Command 2: cat skills.json */}
            <div className="flex flex-col gap-2">
              <TerminalPrompt command="cat skills.json" />

              <div className="flex w-full flex-col text-sm sm:text-base md:text-lg">
                <span className="text-white">{"{"}</span>
                <div className="grid w-full grid-cols-2 gap-2 lg:grid-cols-4">
                  {skills.map((category, idx) => (
                    <div key={category.title} className="flex flex-col">
                      <span>
                        <span className="font-bold text-[#ad7fa8]">
                          "{category.title.toLowerCase()}"
                        </span>
                        <span className="text-white">: [</span>
                      </span>
                      <div className="flex flex-col pl-4">
                        {category.items.map((item, itemIdx) => (
                          <span key={item} className="text-[#e2a843]">
                            "{item}"
                            {itemIdx < category.items.length - 1 ? (
                              <span className="text-white">,</span>
                            ) : (
                              ""
                            )}
                          </span>
                        ))}
                      </div>
                      <span className="text-white">
                        ]{idx < skills.length - 1 ? "," : ""}
                      </span>
                    </div>
                  ))}
                </div>
                <span className="text-white">{"}"}</span>
              </div>
            </div>

            {/* Command 3: cat contact.json */}
            <div className="flex flex-col gap-2">
              <TerminalPrompt command="ls contacts/" />

              <div className="flex w-full gap-8 text-sm sm:text-base md:text-lg">
                {contact.map((contact) => (
                  <a
                    key={contact.link}
                    href={contact.link}
                    target="_blank"
                    className="flex w-fit items-center gap-1 text-white hover:underline"
                  >
                    {contact.title}
                  </a>
                ))}
              </div>
            </div>

            <TerminalPrompt showCursor className="mt-2 items-start" />
          </TabsContent>

          <TabsContent
            value="projects"
            className="flex flex-col gap-6 outline-none"
          >
            <div className="flex flex-col gap-2">
              <TerminalPrompt path="~/projects" command="ls" />
              <div className="flex w-full flex-col flex-wrap gap-4 pt-4 sm:flex-row">
                {Projects.map((project) => (
                  <div
                    key={project.title}
                    className="flex w-full flex-col justify-between gap-4 border border-dashed border-neutral-400 p-4 text-white md:w-[400px]"
                  >
                    <a
                      target="_blank"
                      href={project.preview_link}
                      className="flex flex-col gap-2 hover:opacity-80"
                    >
                      <h3 className="font-bold tracking-wider text-[#ad7fa8]">
                        {project.title}
                      </h3>
                      <div className="text-xs md:text-sm">
                        {project.description}
                      </div>
                    </a>
                    <a
                      href={project.github_link}
                      target="_blank"
                      className="flex w-fit items-center gap-1 text-[#729fcf] hover:underline"
                    >
                      <GithubIcon className="h-4" /> See on github{" "}
                      <ExternalLinkIcon className="mb-0.5 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <TerminalPrompt
              path="~/projects"
              showCursor
              className="mt-4 items-start"
            />
          </TabsContent>

          <TabsContent
            value="articles"
            className="flex flex-col gap-6 outline-none"
          >
            <div className="flex flex-col gap-2">
              <TerminalPrompt path="~/articles" command="ls" />
              <div className="flex w-full flex-wrap gap-4 pt-4">
                {Articles.map((article) => (
                  <div
                    key={article.title}
                    className="flex w-full flex-col justify-center gap-2 border border-dashed border-neutral-400 p-4 text-white sm:w-[calc(50%-0.5rem)] md:w-[400px]"
                  >
                    <a
                      target="_blank"
                      href={article.preview_link}
                      className="flex flex-col gap-2 hover:opacity-80"
                    >
                      <h3 className="font-bold tracking-wider text-[#ad7fa8]">
                        {article.title}
                      </h3>
                    </a>
                  </div>
                ))}
                <div className="flex min-h-32 w-full flex-col items-center justify-center gap-4 border border-dashed border-neutral-400 p-4 text-gray-400 sm:w-[calc(50%-0.5rem)] md:w-[400px]">
                  <h3 className="font-bold tracking-wider uppercase md:text-lg">
                    More to come...
                  </h3>
                </div>
              </div>
            </div>

            <TerminalPrompt
              path="~/articles"
              showCursor
              className="mt-4 items-start"
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ProfessionalPage;
