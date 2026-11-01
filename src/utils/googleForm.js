/**
 * Google Forms URL verification & helper
 * Ensures that only public responder links (viewform / forms.gle) are used,
 * preventing accidental exposure of form editor or administrative links.
 */

export function verifyGoogleFormUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") {
    return null;
  }

  const url = rawUrl.trim();

  // Must begin with secure HTTPS
  if (!url.startsWith("https://")) {
    return null;
  }

  // Reject editor, creator, or response-management links
  const forbiddenPatterns = ["/edit", "usp=drivesdk", "usp=sharing_eip", "/edit#responses", "analytics"];
  for (const pattern of forbiddenPatterns) {
    if (url.toLowerCase().includes(pattern)) {
      console.warn("[GoogleForm] Rejected non-public or editor Google Form URL:", url);
      return null;
    }
  }

  // Allow official short links (forms.gle) or full viewform URLs
  const isFormsGle = url.startsWith("https://forms.gle/");
  const isGoogleFormsView =
    url.includes("docs.google.com/forms") && (url.includes("/viewform") || url.includes("/formResponse"));

  if (isFormsGle || isGoogleFormsView) {
    return url;
  }

  return null;
}

export function getPublicGoogleFormUrl() {
  const envUrl = import.meta.env.VITE_GOOGLE_FORM_URL;
  return verifyGoogleFormUrl(envUrl);
}

