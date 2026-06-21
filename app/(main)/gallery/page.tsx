import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { GalleryBrowser } from "@/components/gallery/GalleryBrowser";
import { getGalleryGroups } from "@/lib/gallery";

// Reads gallery photos from the DB at request time so new uploads appear without
// a rebuild (and so the build doesn't depend on the gallery tables existing yet).
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const groups = await getGalleryGroups();

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
        <Container>
          <GalleryBrowser groups={groups} />
        </Container>
      </Section>
    </>
  );
}
