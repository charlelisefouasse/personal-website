import { ExternalLinkIcon, GithubIcon } from "lucide-react";

const Projects = [
  {
    title: "Vinyls collection",
    image: "/cosplay.jpg",
    preview_link: "https://charlelise-vinyl-collection.vercel.app/",
    github_link: "https://github.com/charlelisefouasse/vinyl-collection",
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

const ProjectsPage = () => {
  return (
    <div className="bg-grid relative flex h-full w-full flex-col overflow-hidden p-4 text-gray-800 md:p-8">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 md:gap-8">
        <div className="flex w-full max-w-5xl flex-col gap-4">
          <h2 className="font-orbitron text-2xl font-bold md:text-4xl">
            ARTICLES
          </h2>
          <div className="bg-pro-bg flex w-full flex-col items-center gap-6 self-center border-2 border-gray-300 p-4 text-center shadow-[6px_10px_0px_0px_rgba(0,0,0,0.8)] md:gap-12 md:p-12">
            <div className="flex w-full flex-wrap gap-8">
              {Articles.map((article) => (
                <div
                  key={article.title}
                  className="flex flex-1 flex-col items-center gap-4 border border-gray-300 p-2 md:p-6"
                >
                  <a
                    key={article.title}
                    target="_blank"
                    href={article.preview_link}
                    className="flex w-fit flex-col items-center gap-4"
                  >
                    <h3 className="font-orbitron font-bold tracking-wider md:text-lg">
                      {article.title}
                    </h3>
                    <div className="aspect-video w-[60vw] shrink-0 overflow-hidden border md:w-[400px]">
                      <img
                        src={article.image}
                        alt={""}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </a>
                </div>
              ))}
              <div className="flex min-h-42 flex-1 flex-col items-center justify-center gap-4 border border-dashed border-gray-300 p-2 md:p-6">
                <h3 className="font-orbitron font-bold tracking-wider uppercase md:text-lg">
                  More to come...
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-5xl flex-col gap-4">
          <h2 className="font-orbitron text-2xl font-bold md:text-4xl">
            PROJECTS
          </h2>
          <div className="bg-pro-bg flex w-full flex-col items-center gap-6 self-center border-2 border-gray-300 p-4 text-center shadow-[6px_10px_0px_0px_rgba(0,0,0,0.8)] md:gap-12 md:p-12">
            <div className="flex w-full flex-wrap gap-8">
              {Projects.map((project) => (
                <div
                  key={project.title}
                  className="flex flex-1 flex-col items-center gap-4 border border-gray-300 p-2 md:p-6"
                >
                  <a
                    key={project.title}
                    target="_blank"
                    href={project.preview_link}
                    className="flex w-fit flex-col items-center gap-4"
                  >
                    <h3 className="font-orbitron font-bold tracking-wider md:text-lg">
                      {project.title}
                    </h3>
                    <div className="aspect-video w-[60vw] shrink-0 overflow-hidden border md:w-[400px]">
                      <img
                        src={project.image}
                        alt={""}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </a>
                  <a
                    href={project.github_link}
                    target="_blank"
                    className="flex items-center gap-1 border border-gray-300 p-2"
                  >
                    <GithubIcon className="h-4" />
                    See on github
                    <ExternalLinkIcon className="h-4" />
                  </a>
                </div>
              ))}
              <div className="flex min-h-42 flex-1 flex-col items-center justify-center gap-4 border border-dashed border-gray-300 p-2 md:p-6">
                <h3 className="font-orbitron font-bold tracking-wider uppercase md:text-lg">
                  More to come...
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
