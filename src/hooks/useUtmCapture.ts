import { useEffect } from "react";

const UTM_KEYS = ["utm_source", "utm_campaign", "utm_medium", "utm_content", "utm_term", "src", "sck"];
const STORAGE_KEY = "utm_params";

const readStoredParams = () => {
  try {
    const sessionValue = sessionStorage.getItem(STORAGE_KEY);
    const localValue = localStorage.getItem(STORAGE_KEY);

    return {
      ...(localValue ? JSON.parse(localValue) : {}),
      ...(sessionValue ? JSON.parse(sessionValue) : {}),
    };
  } catch {
    return {};
  }
};

export const captureUtmParams = () => {
  const params = new URLSearchParams(window.location.search);
  const hasUtm = UTM_KEYS.some((key) => params.has(key));
  if (hasUtm) {
    const utmData: Record<string, string> = readStoredParams();
    UTM_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) utmData[key] = value;
    });
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utmData));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(utmData));
  }
};

export const getStoredUtmParams = () => {
  return readStoredParams();
};

export const useUtmCapture = () => {
  useEffect(() => {
    captureUtmParams();
  }, []);
};
