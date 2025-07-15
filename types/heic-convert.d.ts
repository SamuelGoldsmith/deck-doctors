// declare module "heic-convert" {
//   interface ConversionOptions {
//     buffer: ArrayBuffer;
//     format: "JPEG" | "PNG";
//     quality?: number;
//   }

//   function heicConvert(options: ConversionOptions): Promise<ArrayBuffer>;

//   export = heicConvert;
// }
declare module "heic-convert" {
  export = heicConvert;
  function heicConvert(options: {
    buffer: Buffer;
    format: "JPEG" | "PNG";
    quality?: number;
  }): Promise<Buffer>;
}