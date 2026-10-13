/** Alternate URLs for the shared catalog entities available in each market. */
export function marketDetailAlternates(origin: string, slug: string) {
  const encodedSlug = encodeURIComponent(slug);
  return {
    "en-AE": `${origin}/${encodedSlug}`,
    "en-SA": `${origin}/sa/${encodedSlug}`,
    "en-MU": `${origin}/mu/${encodedSlug}`,
    "en-MV": `${origin}/mv/${encodedSlug}`,
    "ar-SA": `${origin}/sa/ar/${encodedSlug}`,
    "x-default": `${origin}/${encodedSlug}`,
  };
}
