// 업로드 전 이미지 다운스케일/압축
export async function compressImage(
  file,
  { maxSize = 1080, quality = 0.72 } = {},
) {
  if (typeof window === "undefined" || !file?.type?.startsWith("image/")) {
    return file;
  }
  // GIF는 캔버스로 재인코딩하면 애니메이션이 깨지므로 원본 유지
  if (file.type === "image/gif") return file;

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = await new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = dataUrl;
  });

  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d").drawImage(img, 0, 0, w, h);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
  if (!blob) return file;

  const base = (file.name || "photo").replace(/\.\w+$/, "");
  return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
}
