import { useEffect, useRef, useState } from "react";

/**
 * Retém o usuário na página de upsell:
 *  - Bloqueia o botão "voltar" do navegador (history pinning).
 *  - Dispara onExit quando o usuário tenta sair (mouse leave para cima no desktop,
 *    ou tab visibility change / pageshow no mobile) — apenas 1x por sessão por step.
 *  - Aciona window.confirm via beforeunload se ele tentar fechar a aba.
 *
 * O caller controla o modal de retenção via o callback onExit (ex.: abrir um Dialog).
 */
export function useUpsellRetention({
  storageKey,
  onExit,
  enabled = true,
}: {
  storageKey: string;
  onExit: () => void;
  enabled?: boolean;
}) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    // 1) History pinning — empurra um state extra; ao tentar voltar, dispara onExit
    //    e re-empurra para travar o usuário na página.
    try {
      window.history.pushState({ upsellLock: true }, "");
    } catch {}

    const onPop = (_e: PopStateEvent) => {
      try {
        window.history.pushState({ upsellLock: true }, "");
      } catch {}
      maybeFire();
    };

    // 2) Exit intent desktop — mouse subindo para fora da viewport
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) maybeFire();
    };

    // 3) Mobile / aba — visibilitychange (sai pra outra aba/app)
    const onVisibility = () => {
      if (document.visibilityState === "hidden") maybeFire();
    };

    // 4) Tentativa de fechar / recarregar
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    const maybeFire = () => {
      if (firedRef.current) return;
      try {
        if (sessionStorage.getItem(storageKey) === "1") {
          firedRef.current = true;
          return;
        }
      } catch {}
      firedRef.current = true;
      try { sessionStorage.setItem(storageKey, "1"); } catch {}
      onExit();
    };

    window.addEventListener("popstate", onPop);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, storageKey]);
}

/** Helper de estado: ativa um desconto extra de retenção (5%). */
export function useRetentionDiscount() {
  const [active, setActive] = useState(false);
  return { active, activate: () => setActive(true) };
}
