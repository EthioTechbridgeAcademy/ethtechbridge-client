/**
 * Client-side Microsoft Teams Meeting URL Validator
 */

const DEFAULT_APPROVED_DOMAINS = [
  "teams.microsoft.com",
  "teams.live.com",
  "meet.microsoft.com",
  "gov.teams.microsoft.us",
  "dod.teams.microsoft.us"
];

export function validateTeamsMeetingUrl(url) {
  if (!url || typeof url !== "string") {
    return { valid: false, error: "Teams meeting URL is required." };
  }

  const trimmed = url.trim();

  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) {
    return { valid: false, error: "Invalid URL scheme. Only secure HTTPS Microsoft Teams links are permitted." };
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: "Please enter a valid URL (e.g. https://teams.microsoft.com/l/meetup-join/...)." };
  }

  if (parsed.protocol !== "https:") {
    return { valid: false, error: "Teams meeting link must start with https://." };
  }

  if (parsed.username || parsed.password) {
    return { valid: false, error: "Credentials must not be embedded in the meeting link." };
  }

  const hostname = parsed.hostname.toLowerCase();
  const isApproved = DEFAULT_APPROVED_DOMAINS.some((domain) => {
    return hostname === domain || hostname.endsWith(`.${domain}`);
  });

  if (!isApproved) {
    return {
      valid: false,
      error: `"${hostname}" is not recognized as a Microsoft Teams meeting host. Please use an official Teams meeting link.`
    };
  }

  if (!parsed.pathname || parsed.pathname === "/") {
    return { valid: false, error: "Please provide the complete meeting link." };
  }

  return { valid: true, normalizedUrl: parsed.toString() };
}

