type RecaptchaResponse = {
  success?: boolean;
  action?: string;
  score?: number;
  hostname?: string;
};

function getAllowedHostnames(requestHostname: string): Set<string> {
  const configured = process.env.RECAPTCHA_ALLOWED_HOSTNAMES
    ?.split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);

  if (configured?.length) return new Set(configured);

  const hosts = new Set<string>();
  const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN || process.env.SITE_ORIGIN;
  if (siteOrigin) {
    try {
      const hostname = new URL(siteOrigin).hostname.toLowerCase();
      hosts.add(hostname);
      hosts.add(hostname.startsWith("www.") ? hostname.slice(4) : `www.${hostname}`);
    } catch {
      return hosts;
    }
  } else {
    hosts.add("horecahost.com");
    hosts.add("www.horecahost.com");
  }

  if (process.env.NODE_ENV !== "production") {
    hosts.add(requestHostname.toLowerCase());
    hosts.add("localhost");
    hosts.add("127.0.0.1");
  }

  return hosts;
}

export async function verifyRecaptcha(
  token: unknown,
  expectedAction: string,
  requestHostname: string,
): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (typeof token !== "string" || !token.trim() || !secret) return false;

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });

    if (!response.ok) return false;
    const result = (await response.json()) as RecaptchaResponse;
    const minimumScore = Number(process.env.RECAPTCHA_MIN_SCORE || "0.5");
    const allowedHostnames = getAllowedHostnames(requestHostname);

    return (
      result.success === true &&
      result.action === expectedAction &&
      typeof result.score === "number" &&
      result.score >= minimumScore &&
      typeof result.hostname === "string" &&
      allowedHostnames.has(result.hostname.toLowerCase())
    );
  } catch {
    return false;
  }
}
