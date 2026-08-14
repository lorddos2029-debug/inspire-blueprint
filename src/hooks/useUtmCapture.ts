import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const UTM_KEYS = ["utm_source", "utm_campaign", "utm_medium", "utm_content", "utm_term", "src", "sck"];
const CLICK_ID_KEYS = ["fbclid", "gclid", "ttclid", "kwai_click_id"];
const STORAGE_KEY = "utm_params";

/** Chaves usadas pelo próprio script da UTMify para persistir os parâmetros. */
const UTMIFY_STORAGE_KEYS = ["utmify", "utmify-utms", "utmify_utms", "_utmify", "utms"];

type UtmRecord = Record<string, string>;

const parseJson = (value: string | null): unknown => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

/** Extrai chaves utm_* de um objeto arbitrário (a UTMify aninha em `utm` ou na raiz). */
const extractUtms = (input: unknown): UtmRecord => {
  if (!input || typeof input !== "object") return {};
  const source = input as Record<string, unknown>;
  const nested = (source.utm && typeof source.utm === "object" ? source.utm : {}) as Record<string, unknown>;
  const merged = { ...source, ...nested };
  const out: UtmRecord = {};
  [...UTM_KEYS, ...CLICK_ID_KEYS].forEach((key) => {
    const value = merged[key];
    if (typeof value === "string" && value.trim()) out[key] = value.trim();
  });
  return out;
};

const readUtmifyStorage = (): UtmRecord => {
  let result: UtmRecord = {};
  for (const key of UTMIFY_STORAGE_KEYS) {
    try {
      result = { ...extractUtms(parseJson(localStorage.getItem(key))), ...result };
      result = { ...extractUtms(parseJson(sessionStorage.getItem(key))), ...result };
    } catch {
      /* storage indisponível */
    }
  }
  return result;
};

const readStoredParams = (): UtmRecord => {
  try {
    const sessionValue = parseJson(sessionStorage.getItem(STORAGE_KEY));
    const localValue = parseJson(localStorage.getItem(STORAGE_KEY));

    return {
      ...readUtmifyStorage(),
      ...(localValue && typeof localValue === "object" ? (localValue as UtmRecord) : {}),
      ...(sessionValue && typeof sessionValue === "object" ? (sessionValue as UtmRecord) : {}),
    };
  } catch {
    return {};
  }
};

const persist = (data: UtmRecord) => {
  try {
    const payload = JSON.stringify(data);
    sessionStorage.setItem(STORAGE_KEY, payload);
    localStorage.setItem(STORAGE_KEY, payload);
  } catch {
    /* storage indisponível */
  }
};

export const captureUtmParams = () => {
  const params = new URLSearchParams(window.location.search);
  const incoming: UtmRecord = {};
  [...UTM_KEYS, ...CLICK_ID_KEYS].forEach((key) => {
    const value = params.get(key);
    if (value && value.trim()) incoming[key] = value.trim();
  });

  const utmifyData = readUtmifyStorage();
  const merged: UtmRecord = { ...readStoredParams(), ...utmifyData, ...incoming };

  if (Object.keys(merged).length === 0) return;
  persist(merged);
};

/**
 * Garante um utm_source válido: sem ele a UTMify classifica a venda como "Outra Fonte".
 * Quando existe um click id conhecido, inferimos a origem paga correspondente.
 */
export const getStoredUtmParams = (): UtmRecord => {
  const stored = { ...readStoredParams() };

  // Priorizar click IDs para backfill
  if (!stored.utm_source) {
    if (stored.fbclid) stored.utm_source = "facebook";
    else if (stored.gclid) stored.utm_source = "google";
    else if (stored.ttclid) stored.utm_source = "tiktok";
    else if (stored.kwai_click_id) stored.utm_source = "kwai";
  }

  // Se ainda estiver vazio, verificamos se veio de alguma origem conhecida via referer ou se é tráfego direto/orgânico
  if (!stored.utm_source) {
    const referrer = document.referrer.toLowerCase();
    if (referrer.includes("facebook.com") || referrer.includes("fb.me")) stored.utm_source = "facebook";
    else if (referrer.includes("google.com")) stored.utm_source = "google";
    else if (referrer.includes("tiktok.com")) stored.utm_source = "tiktok";
    else if (referrer.includes("instagram.com")) stored.utm_source = "instagram";
  }

  // Fallback final para evitar "Outra Fonte" na UTMify
  if (stored.utm_source) {
    if (!stored.utm_medium) stored.utm_medium = "paid";
    if (!stored.utm_campaign) stored.utm_campaign = "ads_campaign";
  } else {
    // Se não conseguimos identificar nada, marcamos como tráfego direto para que a UTMify processe
    stored.utm_source = "direct";
    stored.utm_medium = "none";
    stored.utm_campaign = "organic";
  }

  return stored;
};

export const useUtmCapture = () => {
  const location = useLocation();

  useEffect(() => {
    captureUtmParams();
    // o script da UTMify carrega de forma assíncrona: recaptura após o boot
    const timers = [400, 1500, 4000].map((ms) => window.setTimeout(captureUtmParams, ms));
    return () => timers.forEach(window.clearTimeout);
  }, [location.pathname, location.search]);
};
