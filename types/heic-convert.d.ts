declare module "heic-convert" {
  interface HeicConvertOptions {
    /** The HEIC/HEIF file contents. */
    buffer: Uint8Array | ArrayBuffer;
    /** Output image format. */
    format: "JPEG" | "PNG";
    /** JPEG compression quality, 0..1 (ignored for PNG). */
    quality?: number;
  }
  function convert(options: HeicConvertOptions): Promise<ArrayBuffer>;
  export = convert;
}
