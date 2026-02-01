// src/utils/CookieManager.ts

type CookieConfig = {
  [key: string]: string;
};

class CookieManager {
  private static instance: CookieManager;
  private cookieConfig: CookieConfig;

  // ✅ Default max age (in days)
  private readonly DEFAULT_MAX_AGE = 7;

  private constructor() {
    // Predefined cookie keys
    this.cookieConfig = {
      AUTH_TOKEN: "auth_token",
      REFRESH_TOKEN: "refresh_token",
      USER_PREFS: "user_prefs",
      THEME: "theme",
      SESSION_ID: "session_id",
    };
  }

  public static getInstance(): CookieManager {
    if (!CookieManager.instance) {
      CookieManager.instance = new CookieManager();
    }
    return CookieManager.instance;
  }

  private serialize(value: any): string {
    return encodeURIComponent(JSON.stringify(value));
  }

  private deserialize(value: string): any {
    try {
      return JSON.parse(decodeURIComponent(value));
    } catch {
      return value;
    }
  }

  private setCookie(name: string, value: string, days = this.DEFAULT_MAX_AGE): void {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  private getCookie(name: string): string | null {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [key, val] = cookie.split("=");
      if (key === name) {
        return val;
      }
    }
    return null;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }

  public set(key: keyof CookieConfig, value: any, days = this.DEFAULT_MAX_AGE): void {
    this.setCookie(this.cookieConfig[key], this.serialize(value), days);
  }

  public get(key: keyof CookieConfig): any {
    const raw = this.getCookie(this.cookieConfig[key]);
    return raw ? this.deserialize(raw) : null;
  }

  public remove(key: keyof CookieConfig): void {
    this.deleteCookie(this.cookieConfig[key]);
  }

  public keys(): string[] {
    return Object.keys(this.cookieConfig);
  }

  // ✅ Expose default max age
  public getDefaultMaxAge(): number {
    return this.DEFAULT_MAX_AGE;
  }
}

export const cookieManager = CookieManager.getInstance();
export type CookieKey = keyof CookieConfig;
