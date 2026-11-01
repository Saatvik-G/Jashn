/**
 * Privacy Sanitizer
 * Enforces Rule 6: Never send user PII (names, phone numbers, emails, street addresses) to external LLM services.
 */

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
// Indian and international phone numbers
const PHONE_REGEX = /(\+?91[\-\s]?)?[6789]\d{9}|\b\d{3}[-.\s]??\d{3}[-.\s]??\d{4}\b/g;
// Common address keywords in Indian context
const ADDRESS_KEYWORDS_REGEX = /(flat\s*(?:no|#)?\s*\d+|house\s*(?:no|#)?\s*\d+|sector\s*\d+|road\s*\d+|plot\s*\d+)/gi;

/**
 * Strips identifiable PII from free-text prompts
 */
export function scrubPII(text: string): { sanitizedText: string; hasRedactions: boolean } {
  if (!text) return { sanitizedText: "", hasRedactions: false };

  let sanitized = text;
  let hasRedactions = false;

  if (EMAIL_REGEX.test(sanitized)) {
    sanitized = sanitized.replace(EMAIL_REGEX, "{{ContactEmail}}");
    hasRedactions = true;
  }

  if (PHONE_REGEX.test(sanitized)) {
    sanitized = sanitized.replace(PHONE_REGEX, "{{ContactPhone}}");
    hasRedactions = true;
  }

  if (ADDRESS_KEYWORDS_REGEX.test(sanitized)) {
    sanitized = sanitized.replace(ADDRESS_KEYWORDS_REGEX, "{{AddressLocation}}");
    hasRedactions = true;
  }

  return {
    sanitizedText: sanitized,
    hasRedactions,
  };
}

/**
 * Client-side template hydrator: replaces placeholders with local state
 */
export function hydrateOutreachTemplate(
  template: string,
  data: {
    yourName?: string;
    vendorName?: string;
    eventDate?: string;
    guestCount?: number | string;
    eventType?: string;
    location?: string;
  }
): string {
  return template
    .replace(/\{\{YourName\}\}/g, data.yourName || "[Your Name]")
    .replace(/\{\{VendorName\}\}/g, data.vendorName || "[Vendor Name]")
    .replace(/\{\{EventDate\}\}/g, data.eventDate || "[Event Date]")
    .replace(/\{\{GuestCount\}\}/g, String(data.guestCount || "[Guest Count]"))
    .replace(/\{\{EventType\}\}/g, data.eventType || "[Celebration]")
    .replace(/\{\{VenueLocation\}\}/g, data.location || "[Venue / City]")
    .replace(/\{\{ContactEmail\}\}/g, "[Your Email]")
    .replace(/\{\{ContactPhone\}\}/g, "[Your Phone]");
}
