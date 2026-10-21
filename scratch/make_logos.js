const fs = require('fs');
const zlib = require('zlib');

function encodePng(width, height, rgbaBuffer) {
  const stride = 1 + width * 4;
  const filtered = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    filtered[y * stride] = 0; // Filter None
    rgbaBuffer.copy(filtered, y * stride + 1, y * width * 4, (y + 1) * width * 4);
  }
  const compressed = zlib.deflateSync(filtered);

  function createChunk(type, data) {
    const chunk = Buffer.alloc(12 + data.length);
    chunk.writeUInt32BE(data.length, 0);
    chunk.write(type, 4, 4, 'ascii');
    data.copy(chunk, 8);
    // CRC32
    const crc = crc32(chunk.slice(4, 8 + data.length));
    chunk.writeInt32BE(crc, 8 + data.length);
    return chunk;
  }

  // Precomputed CRC table
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) | 0;
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type 6: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

// 1. Read source logo
const srcBuf = fs.readFileSync('img/logo.png');
let pos = 8;
let idatChunks = [];
while (pos < srcBuf.length) {
  const len = srcBuf.readUInt32BE(pos);
  const type = srcBuf.slice(pos + 4, pos + 8).toString('ascii');
  if (type === 'IDAT') idatChunks.push(srcBuf.slice(pos + 8, pos + 8 + len));
  pos += 8 + len + 4;
}
const uncompressed = zlib.inflateSync(Buffer.concat(idatChunks));
const srcW = 1024, srcH = 682;
const stride = 1 + srcW * 4;
const raw = Buffer.alloc(srcW * srcH * 4);

for (let y = 0; y < srcH; y++) {
  const filterType = uncompressed[y * stride];
  const rowStart = y * stride + 1;
  for (let x = 0; x < srcW * 4; x++) {
    let val = uncompressed[rowStart + x];
    let a = x >= 4 ? raw[y * srcW * 4 + x - 4] : 0;
    let b = y > 0 ? raw[(y - 1) * srcW * 4 + x] : 0;
    let c = (x >= 4 && y > 0) ? raw[(y - 1) * srcW * 4 + x - 4] : 0;
    if (filterType === 1) val = (val + a) & 0xff;
    else if (filterType === 2) val = (val + b) & 0xff;
    else if (filterType === 3) val = (val + Math.floor((a + b) / 2)) & 0xff;
    else if (filterType === 4) {
      let p = a + b - c;
      let pa = Math.abs(p - a);
      let pb = Math.abs(p - b);
      let pc = Math.abs(p - c);
      let pr = (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
      val = (val + pr) & 0xff;
    }
    raw[y * srcW * 4 + x] = val;
  }
}

// Function to make transparent from background
// White/light bg is around (250-255)
function makeTransparent(srcRaw, w, h) {
  const out = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const idx = i * 4;
    const r = srcRaw[idx];
    const g = srcRaw[idx + 1];
    const b = srcRaw[idx + 2];
    
    // Background is near white (r > 245, g > 245, b > 245)
    // Smooth fade between 235 and 252
    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    
    if (minVal >= 250) {
      // 100% transparent
      out[idx] = 0;
      out[idx + 1] = 0;
      out[idx + 2] = 0;
      out[idx + 3] = 0;
    } else if (minVal >= 235 && (maxVal - minVal) < 15) {
      // Semi-transparent edge anti-aliasing
      const alphaFactor = (250 - minVal) / 15;
      out[idx] = r;
      out[idx + 1] = g;
      out[idx + 2] = b;
      out[idx + 3] = Math.round(255 * alphaFactor);
    } else {
      out[idx] = r;
      out[idx + 1] = g;
      out[idx + 2] = b;
      out[idx + 3] = 255;
    }
  }
  return out;
}

// 2. Crop full logo (minX: 165, maxX: 860, minY: 200, maxY: 525)
const fullMinX = 160, fullMaxX = 865;
const fullMinY = 195, fullMaxY = 530;
const fullW = fullMaxX - fullMinX;
const fullH = fullMaxY - fullMinY;

const fullCroppedRaw = Buffer.alloc(fullW * fullH * 4);
for (let y = 0; y < fullH; y++) {
  for (let x = 0; x < fullW; x++) {
    const srcIdx = ((fullMinY + y) * srcW + (fullMinX + x)) * 4;
    const dstIdx = (y * fullW + x) * 4;
    fullCroppedRaw[dstIdx] = raw[srcIdx];
    fullCroppedRaw[dstIdx + 1] = raw[srcIdx + 1];
    fullCroppedRaw[dstIdx + 2] = raw[srcIdx + 2];
    fullCroppedRaw[dstIdx + 3] = raw[srcIdx + 3];
  }
}

const fullTransRaw = makeTransparent(fullCroppedRaw, fullW, fullH);
fs.writeFileSync('img/logo-full.png', encodePng(fullW, fullH, fullCroppedRaw));
fs.writeFileSync('img/logo-transparent.png', encodePng(fullW, fullH, fullTransRaw));
fs.writeFileSync('img/logo.png', encodePng(fullW, fullH, fullTransRaw));

// 3. Crop Icon only (PP mark: minY: 195 to maxY: ~465)
const iconMinX = 300, iconMaxX = 700;
const iconMinY = 195, iconMaxY = 470;
const iconW = iconMaxX - iconMinX;
const iconH = iconMaxY - iconMinY;

const iconCroppedRaw = Buffer.alloc(iconW * iconH * 4);
for (let y = 0; y < iconH; y++) {
  for (let x = 0; x < iconW; x++) {
    const srcIdx = ((iconMinY + y) * srcW + (iconMinX + x)) * 4;
    const dstIdx = (y * iconW + x) * 4;
    iconCroppedRaw[dstIdx] = raw[srcIdx];
    iconCroppedRaw[dstIdx + 1] = raw[srcIdx + 1];
    iconCroppedRaw[dstIdx + 2] = raw[srcIdx + 2];
    iconCroppedRaw[dstIdx + 3] = raw[srcIdx + 3];
  }
}
const iconTransRaw = makeTransparent(iconCroppedRaw, iconW, iconH);
fs.writeFileSync('img/logo-icon.png', encodePng(iconW, iconH, iconTransRaw));

console.log('Logos generated successfully:');
console.log('- img/logo.png (Transparent full logo)', fullW, 'x', fullH);
console.log('- img/logo-full.png (Clean full logo)', fullW, 'x', fullH);
console.log('- img/logo-icon.png (Icon only)', iconW, 'x', iconH);
