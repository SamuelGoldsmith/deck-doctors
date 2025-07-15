declare module "heic-convert" {
  interface ConversionOptions {
    buffer: Buffer;
    format: "JPEG" | "PNG";
    quality?: number;
  }

  function heicConvert(options: ConversionOptions): Promise<Buffer>;

  export = heicConvert;
}

