import { clsx, type ClassValue } from 'clsx';

export class SecurityUtils {
  static sanitizeHTML(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }

    return input
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  static sanitizeAttribute(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }

    return input
      .replace(/&/g, '&')
      .replace(/"/g, '"')
      .replace(/'/g, '&#x27;')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/\//g, '&#x2F;')
      .replace(/`/g, '&#x60;')
      .replace(/=/g, '&#x3D;');
  }

  static sanitizeCSS(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }

    return input
      .replace(/expression\s*\(/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/@import/gi, '')
      .replace(/url\s*\(/gi, '')
      .replace(/<\//g, '</');
  }

  static sanitizeJS(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }

    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/eval\s*\(/gi, '')
      .replace(/Function\s*\(/gi, '');
  }

  static sanitizeEmail(email: string): { isValid: boolean; sanitized: string } {
    if (typeof email !== 'string') {
      return { isValid: false, sanitized: '' };
    }

    const sanitized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return {
      isValid: emailRegex.test(sanitized),
      sanitized: sanitized
    };
  }

  static sanitizeURL(url: string): { isValid: boolean; sanitized: string } {
    if (typeof url !== 'string') {
      return { isValid: false, sanitized: '' };
    }

    const sanitized = url.trim();
    
    try {
      const urlObj = new URL(sanitized);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { isValid: false, sanitized: '' };
      }
      return { isValid: true, sanitized: urlObj.toString() };
    } catch {
      return { isValid: false, sanitized: '' };
    }
  }

  static sanitizeFilename(filename: string): string {
    if (typeof filename !== 'string') {
      return '';
    }

    return filename
      .replace(/[/\\?%*:|"<>]/g, '')
      .replace(/\.\./g, '')
      .replace(/^\./, '')
      .substring(0, 255);
  }

  static sanitizePhoneNumber(phone: string): { isValid: boolean; sanitized: string } {
    if (typeof phone !== 'string') {
      return { isValid: false, sanitized: '' };
    }

    const sanitized = phone.replace(/[^\d+]/g, '');
    const digitCount = sanitized.replace(/\D/g, '').length;
    return {
      isValid: digitCount >= 7 && digitCount <= 15,
      sanitized: sanitized
    };
  }

  static sanitizeForSQL(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }

    return input
      .replace(/'/g, "''")
      .replace(/"/g, '""')
      .replace(/;/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '')
      .replace(/\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b/gi, '');
  }

  static validateLength(input: string, min: number = 0, max: number = 1000): boolean {
    return typeof input === 'string' && input.length >= min && input.length <= max;
  }

  static containsSuspiciousPatterns(input: string): { isSuspicious: boolean; patterns: string[] } {
    if (typeof input !== 'string') {
      return { isSuspicious: true, patterns: ['not-string'] };
    }

    const suspiciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
      /(\b(UNION|JOIN|WHERE|OR|AND)\b)/gi,
      /('|"|;|--|\/\*|\*\/)/g,
      /eval\s*\(/gi,
      /Function\s*\(/gi,
      /expression\s*\(/gi,
      /@import/gi,
      /url\s*\(/gi,
    ];

    const foundPatterns: string[] = [];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(input)) {
        foundPatterns.push(pattern.source);
      }
    }

    return {
      isSuspicious: foundPatterns.length > 0,
      patterns: foundPatterns
    };
  }

  private static inputAttempts = new Map<string, { count: number; resetTime: number }>();
  
  static checkInputRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.inputAttempts.get(identifier);
    
    if (!attempts || now > attempts.resetTime) {
      this.inputAttempts.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (attempts.count >= maxAttempts) {
      return false;
    }
    
    attempts.count++;
    this.inputAttempts.set(identifier, attempts);
    return true;
  }

  static generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async encryptData(data: string, key: CryptoKey): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );
    
    const encryptedArray = new Uint8Array(encryptedBuffer);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);
    
    return btoa(String.fromCharCode(...combined));
  }

  static async decryptData(encryptedData: string, key: CryptoKey): Promise<string> {
    const combined = new Uint8Array(
      atob(encryptedData).split('').map(char => char.charCodeAt(0))
    );
    
    const iv = combined.slice(0, 12);
    const encryptedArray = combined.slice(12);
    
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedArray
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  }

  static async generateEncryptionKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  static validateWithWhitelist(input: string, allowedPattern: RegExp): boolean {
    if (typeof input !== 'string') {
      return false;
    }
    
    return allowedPattern.test(input);
  }

  static sanitizeCreditCard(cardNumber: string): { isValid: boolean; sanitized: string } {
    if (typeof cardNumber !== 'string') {
      return { isValid: false, sanitized: '' };
    }

    const sanitized = cardNumber.replace(/\D/g, '');
    
    if (sanitized.length < 13 || sanitized.length > 19) {
      return { isValid: false, sanitized: '' };
    }
    
    let sum = 0;
    let isEven = false;
    
    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized.charAt(i));
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return {
      isValid: sum % 10 === 0,
      sanitized: sanitized
    };
  }
}

export function useSecureInput() {
  const validateInput = (input: string, options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    sanitize?: boolean;
    allowHTML?: boolean;
  }) => {
    const {
      required = false,
      minLength = 0,
      maxLength = 1000,
      pattern,
      sanitize = true,
      allowHTML = false
    } = options;

    if (required && (!input || input.trim().length === 0)) {
      return { isValid: false, error: 'This field is required', sanitized: '' };
    }

    if (!input) {
      return { isValid: !required, error: '', sanitized: '' };
    }

    if (input.length < minLength) {
      return { isValid: false, error: `Minimum length is ${minLength} characters`, sanitized: '' };
    }

    if (input.length > maxLength) {
      return { isValid: false, error: `Maximum length is ${maxLength} characters`, sanitized: '' };
    }

    if (pattern && !pattern.test(input)) {
      return { isValid: false, error: 'Invalid format', sanitized: '' };
    }

    const suspiciousCheck = SecurityUtils.containsSuspiciousPatterns(input);
    if (suspiciousCheck.isSuspicious) {
      return { isValid: false, error: 'Input contains suspicious patterns', sanitized: '' };
    }

    let sanitized = input;
    if (sanitize && !allowHTML) {
      sanitized = SecurityUtils.sanitizeHTML(input);
    }

    return { isValid: true, error: '', sanitized };
  };

  const sanitizeOutput = (input: string, type: 'html' | 'attribute' | 'css' | 'js' = 'html'): string => {
    switch (type) {
      case 'html':
        return SecurityUtils.sanitizeHTML(input);
      case 'attribute':
        return SecurityUtils.sanitizeAttribute(input);
      case 'css':
        return SecurityUtils.sanitizeCSS(input);
      case 'js':
        return SecurityUtils.sanitizeJS(input);
      default:
        return SecurityUtils.sanitizeHTML(input);
    }
  };

  return { validateInput, sanitizeOutput };
}

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}