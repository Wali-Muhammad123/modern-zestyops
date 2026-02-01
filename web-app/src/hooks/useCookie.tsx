// src/hooks/useCookie.ts
import { useState, useEffect, useCallback } from "react";
import { cookieManager, CookieKey } from "../lib/cookies";

export function useCookie(key: CookieKey) {
  const [value, setValue] = useState(() => cookieManager.get(key));

  useEffect(() => {
    const checkCookie = () => {
      setValue(cookieManager.get(key));
    };

    window.addEventListener("focus", checkCookie);
    const interval = setInterval(checkCookie, 5000);

    return () => {
      window.removeEventListener("focus", checkCookie);
      clearInterval(interval);
    };
  }, [key]);

  const update = useCallback(
    (newValue: any, days = cookieManager.getDefaultMaxAge()) => {
      cookieManager.set(key, newValue, days);
      setValue(newValue);
    },
    [key]
  );

  const remove = useCallback(() => {
    cookieManager.remove(key);
    setValue(null);
  }, [key]);

  return [value, update, remove] as const;
}
