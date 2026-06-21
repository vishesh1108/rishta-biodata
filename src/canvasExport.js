const GOLD = "#c79631";
const INK = "#2f2515";

const layoutInsets = {
  "layout-one": { top: 0.124, right: 0.074, bottom: 0.064, left: 0.074 },
  "layout-two": { top: 0.092, right: 0.076, bottom: 0.072, left: 0.076 },
  "layout-three": { top: 0.064, right: 0.082, bottom: 0.088, left: 0.082 },
  "layout-arch": { top: 0.094, right: 0.084, bottom: 0.088, left: 0.084 },
  "layout-peacock": { top: 0.074, right: 0.074, bottom: 0.12, left: 0.074 },
  "layout-leaf": { top: 0.076, right: 0.078, bottom: 0.1, left: 0.078 },
  "layout-sapphire": { top: 0.075, right: 0.078, bottom: 0.094, left: 0.078 },
  "layout-lotus": { top: 0.078, right: 0.078, bottom: 0.104, left: 0.078 },
};

const generatedLayouts = new Set([
  "layout-arch",
  "layout-peacock",
  "layout-leaf",
  "layout-sapphire",
  "layout-lotus",
]);

export async function renderBiodataCanvas({
  template,
  language,
  fields,
  photo,
  selectedHeader,
  textScale = 1,
  photoScale = 1,
}) {
  await document.fonts?.ready;
  const background = await loadImage(template.image);
  const canvas = document.createElement("canvas");
  canvas.width = background.naturalWidth || background.width || 1055;
  canvas.height = background.naturalHeight || background.height || 1491;
  const ctx = canvas.getContext("2d");
  const photoImage = photo ? await loadImage(photo) : null;
  const visible = fields.length ? fields : sampleFields(language);
  const grouped = groupFields(visible, language);
  const baseMetrics = getMetrics({ template, language, visible, grouped, textScale, photoScale, canvas });

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  let metrics = baseMetrics;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const result = drawDocument(ctx, {
      template,
      language,
      grouped,
      photoImage,
      selectedHeader,
      canvas,
      metrics,
      dryRun: true,
    });
    if (result.bottom <= metrics.overlayBottom) break;
    metrics = {
      ...metrics,
      safeFont: Math.max(0.62, metrics.safeFont * 0.93),
      safePhotoScale: Math.max(0.56, metrics.safePhotoScale * 0.96),
    };
  }

  drawDocument(ctx, {
    template,
    language,
    grouped,
    photoImage,
    selectedHeader,
    canvas,
    metrics,
    dryRun: false,
  });

  return canvas;
}

function getMetrics({ template, visible, grouped, textScale, photoScale, canvas }) {
  const valueLengths = visible.map((field) => field.value.trim().length);
  const totalValueChars = valueLengths.reduce((sum, length) => sum + length, 0);
  const longestValue = Math.max(0, ...valueLengths);
  const longValueCount = valueLengths.filter((length) => length > 28).length;
  const densityScore =
    visible.length +
    longValueCount * 1.1 +
    totalValueChars / 85 +
    Math.max(0, grouped.personal.length - 6) * 1.1 +
    Math.max(0, longestValue - 42) / 18;
  const density = densityScore > 24 ? "extra" : densityScore > 15 ? "dense" : "normal";
  const densityTextMultiplier = density === "extra" ? 0.84 : density === "dense" ? 0.92 : 1;
  const densityPhotoMultiplier = density === "extra" ? 0.88 : density === "dense" ? 0.95 : 1;
  const maxFontByDensity = density === "extra" ? 0.92 : density === "dense" ? 1.02 : 1.14;
  const safeFont = Math.max(0.72, Math.min(textScale * densityTextMultiplier, maxFontByDensity));
  const safePhotoScale = Math.max(0.68, Math.min(photoScale * densityPhotoMultiplier, 1.18));
  const unit = canvas.width / 675;
  const inset = layoutInsets[template.layout] || { top: 0.07, right: 0.078, bottom: 0.08, left: 0.078 };
  const overlay = {
    x: canvas.width * inset.left,
    y: canvas.height * inset.top,
    width: canvas.width * (1 - inset.left - inset.right),
    height: canvas.height * (1 - inset.top - inset.bottom),
  };

  return {
    density,
    safeFont,
    safePhotoScale,
    unit,
    overlay,
    overlayBottom: overlay.y + overlay.height,
  };
}

function drawDocument(ctx, options) {
  const { template, language, grouped, photoImage, selectedHeader, canvas, metrics, dryRun } = options;
  const { unit, overlay, safeFont, safePhotoScale, density } = metrics;
  const colors = {
    accent: template.accent || "#006c51",
    accentDark: template.accentDark || template.accent || "#006c51",
    accentSoft: template.accentSoft || template.accent || GOLD,
    header: template.headerColor || "#b41414",
  };

  const compactHeaderScale = generatedLayouts.has(template.layout) ? 0.92 : 1;
  const densityHeaderScale = density === "extra" ? 0.78 : density === "dense" ? 0.9 : 1;
  const headerScale = compactHeaderScale * densityHeaderScale;
  const headerShift = parsePixel(template.headerShift) * unit;
  const titleFont = 62 * unit * headerScale;
  const toplineFont = 18 * unit * headerScale;
  const toplineGap = (density === "extra" ? 5 : density === "dense" ? 7 : 10) * unit * headerScale;
  const titleGap = (density === "extra" ? 6 : density === "dense" ? 8 : 10) * unit * headerScale;
  const ruleGap = (density === "extra" ? 10 : density === "dense" ? 14 : 22) * unit * headerScale;
  const sectionGap = (density === "extra" ? 6 : density === "dense" ? 12 : 18) * unit * safeFont;
  const rowFont = (density === "extra" ? 15 : density === "dense" ? 16 : 19) * unit * safeFont;
  const headingFont = (density === "extra" ? 15 : density === "dense" ? 18 : 22) * unit * safeFont;
  const rowGap = (density === "extra" ? 2 : density === "dense" ? 5 : 8) * unit * safeFont;
  const personalGap = (density === "extra" ? 10 : density === "dense" ? 16 : 22) * unit * safeFont;
  const headingGap = (density === "extra" ? 5 : density === "dense" ? 9 : 13) * unit * safeFont;
  const headingPadY = (density === "extra" ? 5 : density === "dense" ? 6 : 8) * unit * safeFont;
  const headingPadX = (density === "extra" ? 11 : density === "dense" ? 15 : 20) * unit * safeFont;
  const lineHeight = rowFont * (density === "extra" ? 1.04 : density === "dense" ? 1.1 : 1.16);
  const header = selectedHeader || {
    value: language === "hi" ? "|| श्री गणेशाय नमः ||" : "|| Shri Ganeshaya Namah ||",
    mode: "invocation",
  };
  const invocation = header.mode === "invocation" ? header.value : "";
  const title = header.mode === "title" && header.value ? header.value : language === "hi" ? "बायोडाटा" : "BIODATA";

  let y = overlay.y + headerShift;
  if (invocation.trim()) {
    ctx.font = font(800, toplineFont, `"Noto Serif Devanagari", "Gloock", serif`);
    ctx.fillStyle = colors.header;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    if (!dryRun) ctx.fillText(invocation, overlay.x + overlay.width / 2, y, overlay.width * 0.84);
    y += toplineFont * 1.15 + toplineGap;
  } else {
    y += toplineFont * 1.15 + toplineGap;
  }

  ctx.font = font(400, titleFont, `"Gloock", "Noto Serif Devanagari", serif`);
  ctx.fillStyle = colors.accent;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  if (!dryRun) ctx.fillText(title.toUpperCase(), overlay.x + overlay.width / 2, y, overlay.width * 0.76);
  y += titleFont * 0.96 + titleGap;
  if (!dryRun) drawRule(ctx, overlay.x + overlay.width * 0.15, y, overlay.width * 0.7, unit, colors);
  y += 2 * unit + ruleGap;

  const generated = generatedLayouts.has(template.layout);
  const photoWidth = generated ? 164 * unit * safePhotoScale : Math.min(overlay.width * 0.36, 230 * unit * safePhotoScale);
  const photoHeight = photoWidth * 1.25;
  const photoX = overlay.x + overlay.width - photoWidth;
  const photoY = y;
  const personalWidth = Math.max(overlay.width - photoWidth - personalGap, overlay.width * 0.54);
  const personalBottom = drawSection(ctx, {
    x: overlay.x,
    y,
    width: Math.min(personalWidth, overlay.width - photoWidth - personalGap),
    title: language === "hi" ? "व्यक्तिगत विवरण" : "PERSONAL DETAILS",
    fields: grouped.personal,
    colors,
    rowFont,
    headingFont,
    rowGap,
    lineHeight,
    headingGap,
    headingPadX,
    headingPadY,
    density,
    type: "personal",
    dryRun,
  });

  const photoBottom = drawPhoto(ctx, {
    x: photoX,
    y: photoY,
    width: photoWidth,
    height: photoHeight,
    image: photoImage,
    colors,
    unit,
    scale: safeFont,
    label: language === "hi" ? "फोटो" : "Photo",
    dryRun,
  });

  y = Math.max(personalBottom, photoBottom) + sectionGap;
  y = drawSection(ctx, {
    x: overlay.x,
    y,
    width: overlay.width,
    title: language === "hi" ? "पारिवारिक विवरण" : "FAMILY DETAILS",
    fields: grouped.family,
    colors,
    rowFont,
    headingFont,
    rowGap,
    lineHeight,
    headingGap,
    headingPadX,
    headingPadY,
    density,
    type: "family",
    dryRun,
  }) + sectionGap;

  y = drawSection(ctx, {
    x: overlay.x,
    y,
    width: overlay.width,
    title: language === "hi" ? "संपर्क विवरण" : "CONTACT DETAILS",
    fields: grouped.contact,
    colors,
    rowFont,
    headingFont,
    rowGap,
    lineHeight,
    headingGap,
    headingPadX,
    headingPadY,
    density,
    type: "contact",
    dryRun,
  });

  return { bottom: y };
}

function drawSection(ctx, options) {
  const {
    x,
    y,
    width,
    title,
    fields,
    colors,
    rowFont,
    headingFont,
    rowGap,
    lineHeight,
    headingGap,
    headingPadX,
    headingPadY,
    density,
    type,
    dryRun,
  } = options;
  if (!fields.length) return y;

  const headingBottom = drawHeading(ctx, {
    x,
    y,
    title,
    colors,
    headingFont,
    headingPadX,
    headingPadY,
    density,
    dryRun,
  });

  const rowTop = headingBottom + headingGap;
  return drawRows(ctx, {
    x,
    y: rowTop,
    width,
    fields,
    colors,
    rowFont,
    rowGap,
    lineHeight,
    type,
    dryRun,
  });
}

function drawHeading(ctx, { x, y, title, colors, headingFont, headingPadX, headingPadY, density, dryRun }) {
  ctx.font = font(700, headingFont, `"Gloock", "Noto Serif Devanagari", serif`);
  const minWidth = (density === "normal" ? 240 : 184) * (headingFont / 22);
  const textWidth = ctx.measureText(title).width;
  const width = Math.max(minWidth, textWidth + headingPadX * 2);
  const height = headingFont + headingPadY * 2;
  if (!dryRun) {
    ctx.save();
    ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
    ctx.shadowBlur = 0;
    ctx.fillStyle = colors.accent;
    roundedRect(ctx, x, y, width, height, Math.max(4, headingFont * 0.14));
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.lineWidth = Math.max(2, headingFont * 0.08);
    ctx.strokeStyle = GOLD;
    ctx.stroke();
    ctx.fillStyle = "#fffdf4";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, x + width / 2, y + height / 2 + headingFont * 0.04, width - headingPadX);
    ctx.restore();
  }
  return y + height;
}

function drawRows(ctx, { x, y, width, fields, colors, rowFont, rowGap, lineHeight, type, dryRun }) {
  let currentY = y;
  const labelRatio = type === "contact" ? 0.22 : width > 650 ? 0.28 : 0.34;
  const labelWidth = Math.max(rowFont * 4.4, Math.min(width * labelRatio, rowFont * 11));
  const colonWidth = rowFont * 0.75;
  const gap = rowFont * 0.38;
  const valueX = x + labelWidth + colonWidth + gap * 2;
  const valueWidth = Math.max(rowFont * 5, width - (valueX - x));

  ctx.font = font(800, rowFont, `"Georgia", "Noto Serif Devanagari", serif`);
  fields.forEach((field) => {
    const label = field.label?.[field.language] || field.label?.en || field.label?.hi || "";
    const value = field.value || "";
    const labelLines = wrapText(ctx, label, labelWidth);
    ctx.font = font(400, rowFont, `"Georgia", "Noto Serif Devanagari", serif`);
    const valueLines = wrapText(ctx, value, valueWidth);
    const rowLines = Math.max(labelLines.length, valueLines.length, 1);

    if (!dryRun) {
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = colors.accent;
      ctx.font = font(800, rowFont, `"Georgia", "Noto Serif Devanagari", serif`);
      labelLines.forEach((line, index) => ctx.fillText(line, x, currentY + index * lineHeight, labelWidth));
      ctx.fillStyle = colors.accent;
      ctx.font = font(900, rowFont, `"Georgia", "Noto Serif Devanagari", serif`);
      ctx.textAlign = "center";
      ctx.fillText(":", x + labelWidth + gap + colonWidth / 2, currentY);
      ctx.textAlign = "left";
      ctx.fillStyle = INK;
      ctx.font = font(400, rowFont, `"Georgia", "Noto Serif Devanagari", serif`);
      valueLines.forEach((line, index) => ctx.fillText(line, valueX, currentY + index * lineHeight, valueWidth));
    }

    currentY += rowLines * lineHeight + rowGap;
    ctx.font = font(800, rowFont, `"Georgia", "Noto Serif Devanagari", serif`);
  });

  return currentY - rowGap;
}

function drawPhoto(ctx, { x, y, width, height, image, colors, unit, scale, label, dryRun }) {
  if (dryRun) return y + height;
  ctx.save();
  roundedRect(ctx, x, y, width, height, 18 * unit * scale);
  ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
  ctx.fill();
  ctx.lineWidth = Math.max(3 * unit * scale, 2);
  ctx.strokeStyle = colors.accentSoft;
  ctx.stroke();
  ctx.clip();

  if (image) {
    drawImageCover(ctx, image, x, y, width, height);
  } else {
    ctx.fillStyle = colors.accent;
    ctx.font = font(800, 18 * unit * scale, `"Georgia", "Noto Serif Devanagari", serif`);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + width / 2, y + height / 2);
  }
  ctx.restore();
  return y + height;
}

function drawRule(ctx, x, y, width, unit, colors) {
  const gradient = ctx.createLinearGradient(x, y, x + width, y);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
  gradient.addColorStop(0.25, colors.accent);
  gradient.addColorStop(0.5, GOLD);
  gradient.addColorStop(0.75, colors.accent);
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, Math.max(2 * unit, 1));
}

function groupFields(fields, language) {
  const withLanguage = fields.map((field) => ({ ...field, language }));
  return {
    personal: withLanguage.filter((field) => field.section === "personal" || !field.section),
    family: withLanguage.filter((field) => field.section === "family"),
    contact: withLanguage.filter((field) => field.section === "contact"),
  };
}

function wrapText(ctx, text, maxWidth) {
  const clean = String(text || "").trim();
  if (!clean) return [""];
  const words = clean.split(/\s+/);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !line) {
      if (ctx.measureText(candidate).width <= maxWidth) {
        line = candidate;
        return;
      }
      const chunks = breakLongWord(ctx, word, maxWidth);
      lines.push(...chunks.slice(0, -1));
      line = chunks[chunks.length - 1] || "";
      return;
    }
    lines.push(line);
    line = word;
  });

  if (line) lines.push(line);
  return lines.length ? lines : [clean];
}

function breakLongWord(ctx, word, maxWidth) {
  const chunks = [];
  let chunk = "";
  Array.from(word).forEach((char) => {
    const candidate = chunk + char;
    if (ctx.measureText(candidate).width <= maxWidth || !chunk) {
      chunk = candidate;
      return;
    }
    chunks.push(chunk);
    chunk = char;
  });
  if (chunk) chunks.push(chunk);
  return chunks;
}

function drawImageCover(ctx, image, x, y, width, height) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = sourceWidth;
  let sh = sourceHeight;

  if (sourceRatio > targetRatio) {
    sw = sourceHeight * targetRatio;
    sx = (sourceWidth - sw) / 2;
  } else {
    sh = sourceWidth / targetRatio;
    sy = (sourceHeight - sh) / 2;
  }

  ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    if (!String(src).startsWith("data:")) image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function font(weight, size, family) {
  return `${weight} ${Math.max(1, size).toFixed(2)}px ${family}`;
}

function parsePixel(value) {
  const parsed = Number.parseFloat(String(value || "0").replace("px", ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function sampleFields(language) {
  const samples = language === "hi"
    ? [
        ["name", "personal", "नाम", "आर्या शर्मा"],
        ["dob", "personal", "जन्म तिथि", "12 मई 1998"],
        ["height", "personal", "कद", "5'7\""],
        ["qualification", "personal", "योग्यता", "एम.बी.ए."],
        ["occupation", "personal", "व्यवसाय", "सॉफ्टवेयर इंजीनियर"],
        ["fatherName", "family", "पिता का नाम", "श्री राजेश शर्मा"],
        ["motherName", "family", "माता का नाम", "श्रीमती कविता शर्मा"],
        ["phone", "contact", "फोन नंबर", "+91 98765 43210"],
        ["address", "contact", "पता", "जयपुर, राजस्थान"],
      ]
    : [
        ["name", "personal", "Name", "Aarya Sharma"],
        ["dob", "personal", "DOB", "12 May 1998"],
        ["height", "personal", "Height", "5'7\""],
        ["qualification", "personal", "Qualification", "MBA"],
        ["occupation", "personal", "Occupation", "Software Engineer"],
        ["fatherName", "family", "Father's name", "Mr. Rajesh Sharma"],
        ["motherName", "family", "Mother's name", "Mrs. Kavita Sharma"],
        ["phone", "contact", "Phone number", "+91 98765 43210"],
        ["address", "contact", "Address", "Jaipur, Rajasthan"],
      ];

  return samples.map(([id, section, label, value]) => ({
    id,
    section,
    label: { en: label, hi: label },
    value,
    visible: true,
  }));
}
