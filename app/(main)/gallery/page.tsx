import fs from "fs";
import path from "path";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectShowcase, type GalleryProject } from "@/components/gallery/ProjectShowcase";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const FOLDER_PATTERN = /^(.+)-(\d+)-(before|after)$/i;

function humanizeSlug(slug: string): string {
  const dateMatch = slug.match(/^(\d{1,2})-(\d{1,2})-(\d{2})$/);
  if (dateMatch) {
    const [, month, day, year] = dateMatch;
    const date = new Date(2000 + Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/[-_]/g, " ");
}

function getProjects(): GalleryProject[] {
  const decksDir = path.join(process.cwd(), "public/decks");
  const folders = fs
    .readdirSync(decksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const projects = new Map<string, GalleryProject>();

  for (const folder of folders) {
    const match = folder.match(FOLDER_PATTERN);
    if (!match) continue;
    const [, slug, , label] = match;

    const images = fs
      .readdirSync(path.join(decksDir, folder))
      .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .sort()
      .map((file) => `/decks/${folder}/${file}`);

    if (images.length === 0) continue;

    const project = projects.get(slug) ?? { slug, title: humanizeSlug(slug), before: [], after: [] };
    if (label.toLowerCase() === "before") project.before.push(...images);
    else project.after.push(...images);
    projects.set(slug, project);
  }

  return Array.from(projects.values()).filter((p) => p.before.length > 0 && p.after.length > 0);
}

export default function GalleryPage() {
  const projects = getProjects();

  return (
    <>
      <Section tone="dark">
        <Container className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Gallery</p>
          <h1 className="font-display text-hero font-bold">Before &amp; After</h1>
          <p className="mx-auto max-w-2xl text-lead text-surface-dark-foreground/80">
            Drag the slider on any project to see the transformation, or browse the full photo set
            for a closer look.
          </p>
        </Container>
      </Section>

      <Section>
        <Container className="grid grid-cols-1 gap-x-10 gap-y-16 lg:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 2) * 100}>
              <ProjectShowcase project={project} priority={i === 0} />
            </Reveal>
          ))}
        </Container>
      </Section>
    </>
  );
}
