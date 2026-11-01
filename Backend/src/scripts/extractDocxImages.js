import fs from "fs";
import zlib from "zlib";
import path from "path";

export function extractImagesFromDocx(docxPath) {
  const buf = fs.readFileSync(docxPath);
  const images = {};

  // Find End of Central Directory (EOCD) signature: 0x06054b50
  let eocdOffset = -1;
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset === -1) {
    console.error("Could not find EOCD in zip file");
    return images;
  }

  const cdOffset = buf.readUInt32LE(eocdOffset + 16);
  const totalEntries = buf.readUInt16LE(eocdOffset + 10);

  let currentOffset = cdOffset;
  for (let i = 0; i < totalEntries; i++) {
    if (buf.readUInt32LE(currentOffset) !== 0x02014b50) break;

    const compressionMethod = buf.readUInt16LE(currentOffset + 10);
    const compressedSize = buf.readUInt32LE(currentOffset + 20);
    const fileNameLen = buf.readUInt16LE(currentOffset + 28);
    const extraLen = buf.readUInt16LE(currentOffset + 30);
    const commentLen = buf.readUInt16LE(currentOffset + 32);
    const localHeaderOffset = buf.readUInt32LE(currentOffset + 42);

    const fileName = buf.toString("utf8", currentOffset + 46, currentOffset + 46 + fileNameLen);
    currentOffset += 46 + fileNameLen + extraLen + commentLen;

    if (fileName.includes("word/media/")) {
      // Read local file header to find exact data offset
      const localFileNameLen = buf.readUInt16LE(localHeaderOffset + 26);
      const localExtraLen = buf.readUInt16LE(localHeaderOffset + 28);
      const dataOffset = localHeaderOffset + 30 + localFileNameLen + localExtraLen;
      const compressedData = buf.subarray(dataOffset, dataOffset + compressedSize);

      let fileData;
      if (compressionMethod === 0) {
        fileData = compressedData;
      } else if (compressionMethod === 8) {
        fileData = zlib.inflateRawSync(compressedData);
      }

      if (fileData) {
        const ext = path.extname(fileName).replace(".", "") || "png";
        images[fileName] = `data:image/${ext};base64,${fileData.toString("base64")}`;
      }
    }
  }

  return images;
}
