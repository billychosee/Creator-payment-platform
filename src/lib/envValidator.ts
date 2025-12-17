import { SecurityLogger, SecurityEventType } from './securityLogger';

// Environment variable validation and security checks
export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missing: string[];
  insecure: string[];
}

export interface EnvConfig {
  // Required environment variables
  required: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean' | 'url' | 'email' | 'secret';
      description: string;
      validation?: (value: string) => boolean;
      secure?: boolean; // If true, value should not be logged
    };
  };
  
  // Optional environment variables
  optional: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean' | 'url' | 'email' | 'secret';
      description: string;
      validation?: (value: string) => boolean;
      default?: string;
      secure?: boolean;
    };
  };
}

export class EnvironmentValidator {
  private static config: EnvConfig = {
    required: {
      NODE_ENV: {
        type: 'string',
        description: 'Application environment (development, production, test)',
        validation: (value: string) => ['development', 'production', 'test'].includes(value),
      },
    },
    optional: {
      // API Configuration
      NEXT_PUBLIC_API_URL: {
        type: 'url',
        description: 'Public API endpoint URL',
        validation: (value: string) => {
          try {
            const url = new URL(value);
            return ['http:', 'https:'].includes(url.protocol);
          } catch {
            return false;
          }
        },
        secure: false,
      },
      NEXT_PUBLIC_API_KEY: {
        type: 'secret',
        description: 'API authentication key',
        secure: true,
      },
      NEXT_PUBLIC_API_PROVIDER: {
        type: 'string',
        description: 'API provider (localStorage, supabase, custom, mock)',
        validation: (value: string) => ['localStorage', 'supabase', 'custom', 'mock'].includes(value),
        default: 'localStorage',
      },
      
      // Supabase Configuration
      NEXT_PUBLIC_SUPABASE_URL: {
        type: 'url',
        description: 'Supabase project URL',
        validation: (value: string) => value.includes('.supabase.co'),
        secure: false,
      },
      NEXT_PUBLIC_SUPABASE_ANON_KEY: {
        type: 'secret',
        description: 'Supabase anonymous key',
        secure: true,
      },
      SUPABASE_SERVICE_ROLE_KEY: {
        type: 'secret',
        description: 'Supabase service role key',
        secure: true,
      },
      
      // Security Configuration
      NEXTAUTH_SECRET: {
        type: 'secret',
        description: 'NextAuth.js secret for JWT encryption',
        validation: (value: string) => value.length >= 32,
        secure: true,
      },
      JWT_SECRET: {
        type: 'secret',
        description: 'JWT signing secret',
        validation: (value: string) => value.length >= 32,
        secure: true,
      },
      ENCRYPTION_KEY: {
        type: 'secret',
        description: 'Data encryption key',
        validation: (value: string) => value.length >= 32,
        secure: true,
      },
      
      // External Services
      STRIPE_SECRET_KEY: {
        type: 'secret',
        description: 'Stripe payment processing secret key',
        validation: (value: string) => value.startsWith('sk_'),
        secure: true,
      },
      STRIPE_PUBLISHABLE_KEY: {
        type: 'secret',
        description: 'Stripe publishable key',
        validation: (value: string) => value.startsWith('pk_'),
        secure: false,
      },
      
      PAYPAL_CLIENT_ID: {
        type: 'string',
        description: 'PayPal client ID',
        secure: false,
      },
      PAYPAL_CLIENT_SECRET: {
        type: 'secret',
        description: 'PayPal client secret',
        secure: true,
      },
      
      // Monitoring and Logging
      SECURITY_WEBHOOK_URL: {
        type: 'url',
        description: 'Security event webhook URL',
        validation: (value: string) => {
          try {
            new URL(value);
            return true;
          } catch {
            return false;
          }
        },
        secure: false,
      },
      SECURITY_WEBHOOK_TOKEN: {
        type: 'secret',
        description: 'Security webhook authentication token',
        secure: true,
      },
      ALERT_WEBHOOK_URL: {
        type: 'url',
        description: 'Security alert webhook URL',
        validation: (value: string) => {
          try {
            new URL(value);
            return true;
          } catch {
            return false;
          }
        },
        secure: false,
      },
      
      // Feature Flags
      NEXT_PUBLIC_ENABLE_PAYMENTS: {
        type: 'boolean',
        description: 'Enable payment functionality',
        validation: (value: string) => ['true', 'false'].includes(value),
        default: 'true',
      },
      NEXT_PUBLIC_ENABLE_PAYOUTS: {
        type: 'boolean',
        description: 'Enable payout functionality',
        validation: (value: string) => ['true', 'false'].includes(value),
        default: 'true',
      },
      NEXT_PUBLIC_ENABLE_PAYMENT_REQUESTS: {
        type: 'boolean',
        description: 'Enable payment request functionality',
        validation: (value: string) => ['true', 'false'].includes(value),
        default: 'true',
      },
      
      // Debug and Development
      NEXT_PUBLIC_DEBUG_MODE: {
        type: 'boolean',
        description: 'Enable debug mode',
        validation: (value: string) => ['true', 'false'].includes(value),
        default: 'false',
      },
      NEXT_PUBLIC_LOG_API_CALLS: {
        type: 'boolean',
        description: 'Log API calls for debugging',
        validation: (value: string) => ['true', 'false'].includes(value),
        default: 'false',
      },
    },
  };

  /**
   * Validate all environment variables
   */
  static validateEnvironment(): EnvValidationResult {
    const result: EnvValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      missing: [],
      insecure: [],
    };

    // Validate required variables
    for (const [key, config] of Object.entries(this.config.required)) {
      const value = process.env[key];
      
      if (!value) {
        result.errors.push(`Missing required environment variable: ${key} (${config.description})`);
        result.missing.push(key);
        result.isValid = false;
        continue;
      }

      this.validateVariable(key, value, config, result);
    }

    // Validate optional variables
    for (const [key, config] of Object.entries(this.config.optional)) {
      const value = process.env[key] || config.default;
      
      if (!value && !config.default) {
        continue; // Skip if no value and no default
      }

      if (value) {
        this.validateVariable(key, value, config, result);
      }
    }

    // Additional security checks
    this.performSecurityChecks(result);

    // Log validation results
    this.logValidationResults(result);

    return result;
  }

  /**
   * Validate a specific environment variable
   */
  private static validateVariable(
    key: string,
    value: string,
    config: any,
    result: EnvValidationResult
  ): void {
    // Type validation
    if (!this.validateType(value, config.type)) {
      result.errors.push(`Invalid type for ${key}: expected ${config.type}, got ${typeof value}`);
      result.isValid = false;
      return;
    }

    // Custom validation
    if (config.validation && !config.validation(value)) {
      result.errors.push(`Invalid value for ${key}: ${config.description}`);
      result.isValid = false;
      return;
    }

    // Security validation
    if (config.secure && this.containsSensitiveData(value)) {
      result.insecure.push(key);
      result.warnings.push(`Potentially insecure value for ${key}: should be more secure`);
    }

    // Check for hardcoded values
    if (this.isHardcodedValue(value)) {
      result.warnings.push(`${key} appears to be a hardcoded value`);
    }
  }

  /**
   * Validate variable type
   */
  private static validateType(value: string, type: string): boolean {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return !isNaN(Number(value));
      case 'boolean':
        return ['true', 'false', '1', '0', 'true', 'false'].includes(value.toLowerCase());
      case 'url':
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      case 'secret':
        return value.length > 0;
      default:
        return true;
    }
  }

  /**
   * Check if value contains sensitive data patterns
   */
  private static containsSensitiveData(value: string): boolean {
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /key/i,
      /token/i,
      /private/i,
      /sk_[a-zA-Z0-9]+/, // Stripe secret keys
      /pk_[a-zA-Z0-9]+/, // Stripe public keys
      /AKIA[0-9A-Z]{16}/, // AWS Access Key ID
      /[a-f0-9]{32}/i, // MD5 hashes (potential secrets)
      /[a-zA-Z0-9+/]{40}={0,2}/, // Base64 encoded data
    ];

    return sensitivePatterns.some(pattern => pattern.test(value));
  }

  /**
   * Check if value appears to be hardcoded
   */
  private static isHardcodedValue(value: string): boolean {
    // Check for common hardcoded patterns
    const hardcodedPatterns = [
      /^changeme/i,
      /^example/i,
      /^demo/i,
      /^test/i,
      /^your-/i,
      /localhost/,
      /^127\.0\.0\.1/,
      /^0\.0\.0\.0/,
    ];

    return hardcodedPatterns.some(pattern => pattern.test(value));
  }

  /**
   * Perform additional security checks
   */
  private static performSecurityChecks(result: EnvValidationResult): void {
    const nodeEnv = process.env.NODE_ENV;
    
    if (nodeEnv === 'production') {
      // Production-specific checks
      if (!process.env.NEXTAUTH_SECRET) {
        result.errors.push('NEXTAUTH_SECRET is required in production');
        result.isValid = false;
      }

      if (!process.env.JWT_SECRET) {
        result.errors.push('JWT_SECRET is required in production');
        result.isValid = false;
      }

      // Check for development-only flags in production
      if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
        result.warnings.push('Debug mode is enabled in production');
      }

      if (process.env.NEXT_PUBLIC_LOG_API_CALLS === 'true') {
        result.warnings.push('API logging is enabled in production');
      }
    }

    // Check for secure configuration
    const secureVars = Object.entries(this.config)
      .flatMap(([category, vars]) => Object.entries(vars))
      .filter(([, config]) => (config as any).secure)
      .map(([key]) => key);

    for (const secureVar of secureVars) {
      const value = process.env[secureVar];
      if (value && value.length < 16) {
        result.warnings.push(`${secureVar} should be at least 16 characters long`);
      }
    }
  }

  /**
   * Log validation results
   */
  private static logValidationResults(result: EnvValidationResult): void {
    if (result.errors.length > 0) {
      SecurityLogger.log({
        type: SecurityEventType.CONFIGURATION_ERROR,
        severity: 'critical',
        source: {
          ip: 'server',
          userAgent: 'environment-validator',
        },
        target: {
          path: '/environment-validation',
          method: 'POST',
        },
        details: {
          message: `Environment validation failed with ${result.errors.length} errors`,
          data: {
            errors: result.errors,
            missing: result.missing,
          },
        },
        risk: {
          score: 90,
          factors: ['configuration_error', 'missing_env_vars'],
        },
        response: {
          statusCode: 500,
          action: 'validation_failed',
        },
      });
    }

    if (result.warnings.length > 0) {
      SecurityLogger.log({
        type: SecurityEventType.CONFIGURATION_ERROR,
        severity: 'low',
        source: {
          ip: 'server',
          userAgent: 'environment-validator',
        },
        target: {
          path: '/environment-validation',
          method: 'POST',
        },
        details: {
          message: `Environment validation completed with ${result.warnings.length} warnings`,
          data: {
            warnings: result.warnings,
            insecure: result.insecure,
          },
        },
        risk: {
          score: 20,
          factors: ['configuration_warning', 'potential_issues'],
        },
        response: {
          statusCode: 200,
          action: 'validation_with_warnings',
        },
      });
    }
  }

  /**
   * Get environment information (without sensitive data)
   */
  static getEnvironmentInfo(): Record<string, any> {
    const info: Record<string, any> = {
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    };

    // Add non-sensitive environment info
    for (const [category, vars] of Object.entries(this.config)) {
      for (const key of Object.keys(vars)) {
        const config = (vars as any)[key];
        if (!config.secure) {
          info[key] = process.env[key] || config.default || 'not_set';
        } else {
          info[key] = process.env[key] ? '[REDACTED]' : 'not_set';
        }
      }
    }

    return info;
  }

  /**
   * Validate environment on server start
   */
  static validateOnStartup(): void {
    const result = this.validateEnvironment();
    
    if (!result.isValid) {
      console.error('Environment validation failed:', result.errors);
      
      if (process.env.NODE_ENV === 'production') {
        // In production, don't start the server if validation fails
        process.exit(1);
      } else {
        // In development, log warnings but continue
        console.warn('Environment validation warnings:', result.warnings);
      }
    } else if (result.warnings.length > 0) {
      console.warn('Environment validation warnings:', result.warnings);
    }
  }
}

// Auto-validate on import in production
if (process.env.NODE_ENV === 'production') {
  EnvironmentValidator.validateOnStartup();
}