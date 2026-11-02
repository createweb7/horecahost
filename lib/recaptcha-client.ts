type RecaptchaClient = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: RecaptchaClient;
  }
}

export async function getRecaptchaToken(action: string): Promise<string> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey || typeof window === "undefined") {
    throw new Error("Security check is unavailable. Please refresh and try again.");
  }

  const deadline = Date.now() + 8000;
  let api: RecaptchaClient | undefined;

  while (Date.now() < deadline) {
    api = window.grecaptcha;
    if (api) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  if (!api) {
    throw new Error("Security check is unavailable. Please refresh and try again.");
  }

  return new Promise((resolve, reject) => {
    api!.ready(() => {
      api!.execute(siteKey, { action }).then((token) => {
        if (token) resolve(token);
        else reject(new Error("Security check failed. Please try again."));
      }).catch(() => reject(new Error("Security check failed. Please try again.")));
    });
  });
}
