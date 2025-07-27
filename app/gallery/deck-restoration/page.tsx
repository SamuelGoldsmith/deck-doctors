import fs from "fs";
import path from "path";
import sharp from "sharp";
import heicConvert from "heic-convert";
import ImageCarousel from "@/components/ImageCarousel";

export default async function DeckRestorationPage() {
  const imagesDir = path.join(process.cwd(), "public/decks");

  const folderNames = fs.readdirSync(imagesDir);
  const imagePaths: string[][] = [];

  for (const folder of folderNames) {
    const folderPath = path.join(imagesDir, folder);
    const files = fs.readdirSync(folderPath);

    const convertedPaths: string[] = [];

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      const base = path.basename(file, ext);
      const filePath = path.join(folderPath, file);

      if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
        convertedPaths.push(`/decks/${folder}/${file}`);
      } else if (ext === ".heic") {
        const jpgPath = path.join(folderPath, base + ".jpg");

        if (fs.existsSync(jpgPath)) {
          // .jpg already exists, no need to convert or add again
          continue;
        }

        const inputBuffer = fs.readFileSync(filePath);
        const outputBuffer = await heicConvert({
          buffer: inputBuffer,
          format: "JPEG",
          quality: 0.9,
        });
        fs.writeFileSync(jpgPath, outputBuffer);

        convertedPaths.push(`/decks/${folder}/${base}.jpg`);
      }
    }

    if (convertedPaths.length > 0) {
      imagePaths.push(convertedPaths);
    }
  }

  return (
    <main className="p-6 space-y-10 flex flex-col items-center">
      {imagePaths.map((paths, index) => (
        <div className="lg:w-2/5 m:w-8/10 sm:w-8/10 bg-background" key={`folder-${index}`}>
          <ImageCarousel images={paths} key={`carousel-${index}`} />
          {(index - 1 % 2) ==0 && (<hr className="h-px my-8 bg-black border-5 border-secondary rounded-2xl"/>)}
        </div>
      ))}
    </main>

  );
}
