/**
 * Input validation and sanitization utilities to prevent injection attacks
 */

/**
 * Sanitize search query to prevent GraphQL injection
 * Removes special GraphQL characters and limits length
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query || typeof query !== 'string') {
    return '';
  }

  // Remove leading/trailing whitespace
  let sanitized = query.trim();

  // Limit maximum length to prevent DoS
  const MAX_QUERY_LENGTH = 100;
  if (sanitized.length > MAX_QUERY_LENGTH) {
    sanitized = sanitized.substring(0, MAX_QUERY_LENGTH);
  }

  // Remove or escape GraphQL special characters that could be used for injection
  // Shopify's search already handles wildcards (*), but we sanitize other special chars
  const dangerousChars = /[{}[\]()<>;"'`\\]/g;
  sanitized = sanitized.replace(dangerousChars, '');

  // Remove multiple spaces
  sanitized = sanitized.replace(/\s+/g, ' ');

  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

  return sanitized;
}

/**
 * Validate search query before processing
 * Returns null if invalid, sanitized query if valid
 */
export function validateSearchQuery(query: string): string | null {
  const sanitized = sanitizeSearchQuery(query);

  // Minimum length check (at least 1 character after sanitization)
  if (sanitized.length === 0) {
    return null;
  }

  // Check for suspicious patterns that might indicate injection attempts
  const suspiciousPatterns = [
    /(__schema|__type)/i,  // GraphQL introspection
    /(query|mutation|subscription)\s*{/i,  // GraphQL operations
    /\.\.\./,  // GraphQL spread operator
    /@/,  // GraphQL directives
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sanitized)) {
      return null;  // Reject suspicious queries
    }
  }

  return sanitized;
}

/**
 * Sanitize product ID/handle for URL params
 */
export function sanitizeProductId(id: string): string {
  if (!id || typeof id !== 'string') {
    return '';
  }

  // Product handles should only contain alphanumeric, dash, underscore
  return id.replace(/[^a-zA-Z0-9\-_]/g, '').trim();
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 320;
}

/**
 * Sanitize user text input (names, addresses, etc.)
 */
export function sanitizeTextInput(input: string, maxLength: number = 255): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  let sanitized = input.trim();

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Remove control characters but allow common punctuation
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

  // Remove script tags and other HTML
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<[^>]+>/g, '');

  return sanitized;
}
