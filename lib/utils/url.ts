/**
 * Utility functions for URL normalization, validation, and sanitization.
 */

export function normalizeUrl(input: string): string {
  if (!input) return '';

  let trimmed = input.trim();

  // Handle social handles (@username)
  if (trimmed.startsWith('@')) {
    const handle = trimmed.substring(1).toLowerCase();
    return `x.com/${handle}`;
  }

  // Prepend https:// if no protocol supplied for parsing
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    let hostname = parsed.hostname.toLowerCase();
    
    // Strip www. prefix
    if (hostname.startsWith('www.')) {
      hostname = hostname.slice(4);
    }

    let pathname = parsed.pathname;
    // Strip trailing slashes
    if (pathname.endsWith('/') && pathname.length > 1) {
      pathname = pathname.slice(0, -1);
    }

    return `${hostname}${pathname !== '/' ? pathname : ''}`;
  } catch {
    return trimmed.toLowerCase();
  }
}

export function formatTargetUrl(input: string): string {
  if (!input) return '#';
  const trimmed = input.trim();

  if (trimmed.startsWith('@')) {
    const handle = trimmed.substring(1);
    return `https://x.com/${handle}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function validateUrlSafety(input: string): { valid: boolean; error?: string } {
  if (!input || input.trim().length === 0) {
    return { valid: false, error: 'URL or handle is required' };
  }

  const trimmed = input.trim();

  // Check for malicious protocols
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return { valid: false, error: 'Unsafe URL protocol detected' };
  }

  // Validate handle format or URL format
  if (trimmed.startsWith('@')) {
    const handleRegex = /^@[a-zA-Z0-9_]{1,30}$/;
    if (!handleRegex.test(trimmed)) {
      return { valid: false, error: 'Invalid handle format (alphanumeric & underscore only, max 30 chars)' };
    }
    return { valid: true };
  }

  // Ensure valid web URL
  try {
    const fullUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(fullUrl);

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'Only http and https protocols are supported' };
    }

    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      return { valid: false, error: 'Please enter a valid domain name (e.g. example.com)' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

export function sanitizeText(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .replace(/[<>]/g, '') // Basic HTML tag strip
    .slice(0, 150); // Enforce max length
}
