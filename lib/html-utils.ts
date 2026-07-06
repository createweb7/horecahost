import sanitizeHtml from "sanitize-html";

export function sanitizeText(text: string | null | undefined): string {
  if (!text) return "";
  return String(text)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]*>/g, "")
    .trim();
}

export function buildHeroText(
  metadata: { h1_tag?: string | null; h2_tag?: string | null; paragraph_text?: string | null; meta_title?: string | null; meta_description?: string | null } | null,
  fallbackName: string,
): { h1: string; h2: string; paragraph: string } {
  return {
    h1: sanitizeText(metadata?.h1_tag || metadata?.meta_title) || fallbackName,
    h2: sanitizeText(metadata?.h2_tag || "") || "",
    paragraph: sanitizeText(metadata?.paragraph_text || ""),
  };
}

// Server-safe version of cleanHTML — same DOMPurify allowlist and paragraph-joining logic,
// using isomorphic-dompurify so it also runs in Node during SSR.
export function serverCleanHTML(html: string): string {
  let sanitized = sanitizeHtml(html, {
    allowedTags: ["p", "br", "strong", "em", "u", "ul", "ol", "li"],
    allowedAttributes: {},
  });

  sanitized = sanitized
    .replace(/&nbsp;/g, " ")
    .replace(/&#8226;/g, "•")
    .replace(/&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\r/g, "");

  sanitized = sanitized.replace(/<p>[\s•]*<\/p>/g, "");

  const paragraphRegex = /<p>(.*?)<\/p>/gs;
  const paragraphs: string[] = [];
  let match;

  while ((match = paragraphRegex.exec(sanitized)) !== null) {
    let text = match[1].trim().replace(/^[•\s]+/, "").trim();
    if (text) paragraphs.push(text);
  }

  const result: string[] = [];
  let i = 0;

  while (i < paragraphs.length) {
    let current = paragraphs[i];
    let nextIndex = i + 1;

    const isSectionHeader =
      /^(Standard features|Dimensions|Options|Features|Specifications|Includes|Additional)/i.test(current);
    let endsWithPunctuation = /[.!?:;—]\s*$/.test(current);

    if (!isSectionHeader) {
      while (!endsWithPunctuation && nextIndex < paragraphs.length) {
        const next = paragraphs[nextIndex];
        if (/^(Standard features|Dimensions|Options|Features|Specifications|Includes|Additional)/i.test(next)) break;
        current = current + " " + next;
        nextIndex++;
        endsWithPunctuation = /[.!?:;—]\s*$/.test(current);
      }
    }

    if (current.trim()) result.push(`<p>• ${current}</p>`);
    i = nextIndex;
  }

  return result.join("");
}
