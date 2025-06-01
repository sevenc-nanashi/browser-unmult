function drawUnmultedImage(
  size: { width: number; height: number },
  img: HTMLImageElement,
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Failed to get canvas context");

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, size.width, size.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    const maxRgb = Math.max(r, g, b);
    if (maxRgb > 0) {
      data[i] = (r / maxRgb) * 255;
      data[i + 1] = (g / maxRgb) * 255;
      data[i + 2] = (b / maxRgb) * 255;
      data[i + 3] = a * (maxRgb / 255);
    } else {
      // If the pixel is black, set it to transparent
      data[i + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return { canvas, ctx };
}

function createBackgroundCanvas(
  width: number,
  height: number,
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  const dotSize = 25;
  for (let x = 0; x < canvas.width; x += dotSize) {
    const xIndex = Math.floor(x / dotSize);
    for (let y = 0; y < canvas.height; y += dotSize) {
      const yIndex = Math.floor(y / dotSize);
      if ((xIndex + yIndex) % 2 === 0) {
        ctx.fillStyle = "rgba(64, 64, 64, 1)";
      } else {
        ctx.fillStyle = "rgba(128, 128, 128, 1)";
      }
      ctx.fillRect(x, y, dotSize, dotSize);
    }
  }

  return { canvas, ctx };
}

export async function unmultImage(selectedImage: string) {
  const img = new Image();
  img.src = selectedImage;
  await new Promise<void>((resolve) => (img.onload = () => resolve()));

  const { canvas: resultCanvas } = drawUnmultedImage(
    { width: img.width, height: img.height },
    img,
  );
  const { canvas: backgroundCanvas } = createBackgroundCanvas(
    img.width,
    img.height,
  );

  const background = backgroundCanvas.toDataURL("image/png");
  const image = resultCanvas.toDataURL("image/png");
  if (!background || !image) {
    throw new Error("Failed to convert canvas to data URL");
  }

  return {
    background,
    image,
  };
}
