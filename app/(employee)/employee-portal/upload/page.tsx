import { getGalleryGroups } from "@/lib/gallery";
import GalleryManager from "@/components/employee/GalleryManager";

export default async function UploadPage() {
  const groups = await getGalleryGroups();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Deck Doctors</p>
        <h1 className="font-display text-h2 font-bold text-primary">Gallery</h1>
        <p className="text-sm text-muted-foreground">
          Upload and arrange the project photos that appear on the public gallery page.
        </p>
      </div>
      <GalleryManager initialGroups={groups} />
    </div>
  );
}
