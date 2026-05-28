import path from "path";

const SAFE_SEGMENT_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function normalizeText(value) {
  return String(value ?? "").trim();
}

export function isSafeSegment(value) {
  const text = normalizeText(value);
  return SAFE_SEGMENT_RE.test(text);
}

export function assertSafeSegment(value, label = "segment") {
  const text = normalizeText(value);
  if (!text || !SAFE_SEGMENT_RE.test(text)) {
    throw new Error(`Invalid ${label}: ${text || "(empty)"}`);
  }
  return text;
}

export function assertIsoDate(value, label) {
  const text = normalizeText(value);
  if (!text) return "";
  if (!DATE_RE.test(text)) {
    throw new Error(`${label} 格式应为 YYYY-MM-DD`);
  }
  return text;
}

export function resolveWithinBase(baseDir, ...segments) {
  const resolvedBase = path.resolve(baseDir);
  const resolvedTarget = path.resolve(resolvedBase, ...segments);
  const prefix = resolvedBase.endsWith(path.sep) ? resolvedBase : `${resolvedBase}${path.sep}`;
  if (resolvedTarget !== resolvedBase && !resolvedTarget.startsWith(prefix)) {
    throw new Error(`Path escapes base directory: ${resolvedTarget}`);
  }
  return resolvedTarget;
}

export function sanitizeHtml(input, { allowStyleTags = false, allowInlineStyles = false } = {}) {
  let html = String(input ?? "");

  html = html.replace(/<\s*(script|iframe|object|embed|meta|link)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "");
  html = html.replace(/<\s*(script|iframe|object|embed|meta|link)\b[^>]*\/?\s*>/gi, "");

  if (!allowStyleTags) {
    html = html.replace(/<\s*style\b[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi, "");
    html = html.replace(/<\s*style\b[^>]*\/?\s*>/gi, "");
  }

  html = html.replace(/\son[a-z-]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "");

  if (!allowInlineStyles) {
    html = html.replace(/\sstyle\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "");
  }

  html = html.replace(/\s(href|src)\s*=\s*(["'])([^"']*)\2/gi, (match, attr, quote, value) => {
    const normalized = String(value ?? "").trim().replace(/\s+/g, "");
    if (/^(javascript:|vbscript:|data:text\/html)/i.test(normalized)) {
      return "";
    }
    return ` ${attr}=${quote}${value}${quote}`;
  });

  return html;
}

