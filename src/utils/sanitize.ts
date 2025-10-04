/**
 * Utility functions for sanitizing user input to prevent XSS attacks and other security vulnerabilities
 */

/**
 * Sanitizes text content by removing or escaping potentially dangerous HTML/JavaScript
 * @param text - The text to sanitize
 * @returns Sanitized text safe for display and storage
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Remove HTML tags
  let sanitized = text.replace(/<[^>]*>/g, '');
  
  // Escape HTML entities
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  // Remove potentially dangerous JavaScript patterns
  sanitized = sanitized
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<script/gi, '')
    .replace(/<\/script>/gi, '');

  // Remove excessive whitespace and normalize
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  return sanitized;
}

/**
 * Sanitizes a filename to prevent path traversal attacks
 * @param filename - The filename to sanitize
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return '';
  }

  // Remove path traversal characters
  let sanitized = filename
    .replace(/\.\./g, '')
    .replace(/[\/\\]/g, '')
    .replace(/[<>:"|?*]/g, '');

  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.split('.').pop();
    const name = sanitized.split('.')[0];
    sanitized = name.substring(0, 255 - ext.length - 1) + '.' + ext;
  }

  return sanitized;
}

/**
 * Validates and sanitizes a URL to prevent open redirect attacks
 * @param url - The URL to validate and sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  try {
    const parsed = new URL(url);
    
    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }

    // Basic validation - you might want to add more specific domain restrictions
    return parsed.toString();
  } catch {
    // If URL parsing fails, return empty string
    return '';
  }
}

/**
 * Sanitizes message content specifically for chat messages
 * @param content - The message content to sanitize
 * @returns Sanitized message content
 */
export function sanitizeMessageContent(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // First apply general text sanitization
  let sanitized = sanitizeText(content);

  // Additional chat-specific sanitization
  // Remove excessive newlines (keep max 3 consecutive)
  sanitized = sanitized.replace(/\n{4,}/g, '\n\n\n');
  
  // Remove excessive spaces
  sanitized = sanitized.replace(/ {3,}/g, '  ');
  
  // Limit message length (adjust as needed)
  const MAX_LENGTH = 10000;
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.substring(0, MAX_LENGTH);
  }

  return sanitized;
}

/**
 * Sanitizes an object containing user input
 * @param obj - Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: Record<string, any> = { ...obj };
  
  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    }
  }
  
  return sanitized as T;
}

