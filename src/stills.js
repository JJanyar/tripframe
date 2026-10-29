// Still frames as PNG, JPG or BMP. Browsers only encode PNG and JPG, so BMP is written here.

export const STILL_FORMATS = ['png', 'jpg', 'bmp'];

/** A 24-bit, bottom-up BMP from RGBA pixels. */
export function encodeBmp(width, height, rgba) {
  const row = Math.ceil((width * 3) / 4) * 4;
  const size = 54 + row * height;
  const out = new Uint8Array(size);
  const dv = new DataView(out.buffer);
  out[0] = 0x42;
  out[1] = 0x4d;
  dv.setUint32(2, size, true);
  dv.setUint32(10, 54, true);
  dv.setUint32(14, 40, true);
  dv.setInt32(18, width, true);
  dv.setInt32(22, height, true);
  dv.setUint16(26, 1, true);
  dv.setUint16(28, 24, true);
  dv.setUint32(34, row * height, true);
  dv.setInt32(38, 2835, true);
  dv.setInt32(42, 2835, true);
  for (let y = 0; y < height; y++) {
    const src = (height - 1 - y) * width * 4;
    const dst = 54 + y * row;
    for (let x = 0; x < width; x++) {
      out[dst + x * 3] = rgba[src + x * 4 + 2];
      out[dst + x * 3 + 1] = rgba[src + x * 4 + 1];
      out[dst + x * 3 + 2] = rgba[src + x * 4];
    }
  }
  return out;
}

export function canvasToBlob(canvas, format) {
  if (format === 'bmp') {
    const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    return Promise.resolve(new Blob([encodeBmp(canvas.width, canvas.height, data)], { type: 'image/bmp' }));
  }
  return new Promise((resolve) => canvas.toBlob(resolve, format === 'jpg' ? 'image/jpeg' : 'image/png', 0.92));
}
