import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Mapa SVG estilizado do Brasil com rota animada de São Paulo até a cidade do cliente.
 * Coordenadas dos estados em projeção aproximada (não geográfica precisa, mas didática).
 */

// Coordenadas aproximadas de cada UF dentro do viewBox 0 0 600 600
// Origem (SP): aprox x=380 y=400
const STATE_COORDS: Record<string, { x: number; y: number; name: string }> = {
  AC: { x: 80, y: 280, name: "Acre" },
  AL: { x: 530, y: 270, name: "Alagoas" },
  AP: { x: 350, y: 90, name: "Amapá" },
  AM: { x: 180, y: 220, name: "Amazonas" },
  BA: { x: 470, y: 290, name: "Bahia" },
  CE: { x: 490, y: 200, name: "Ceará" },
  DF: { x: 400, y: 320, name: "Distrito Federal" },
  ES: { x: 470, y: 380, name: "Espírito Santo" },
  GO: { x: 380, y: 340, name: "Goiás" },
  MA: { x: 430, y: 200, name: "Maranhão" },
  MT: { x: 290, y: 300, name: "Mato Grosso" },
  MS: { x: 320, y: 380, name: "Mato Grosso do Sul" },
  MG: { x: 420, y: 370, name: "Minas Gerais" },
  PA: { x: 340, y: 200, name: "Pará" },
  PB: { x: 540, y: 230, name: "Paraíba" },
  PR: { x: 350, y: 450, name: "Paraná" },
  PE: { x: 525, y: 245, name: "Pernambuco" },
  PI: { x: 460, y: 230, name: "Piauí" },
  RJ: { x: 440, y: 410, name: "Rio de Janeiro" },
  RN: { x: 545, y: 215, name: "Rio Grande do Norte" },
  RS: { x: 320, y: 520, name: "Rio Grande do Sul" },
  RO: { x: 200, y: 290, name: "Rondônia" },
  RR: { x: 230, y: 100, name: "Roraima" },
  SC: { x: 360, y: 490, name: "Santa Catarina" },
  SP: { x: 380, y: 400, name: "São Paulo" },
  SE: { x: 525, y: 280, name: "Sergipe" },
  TO: { x: 400, y: 250, name: "Tocantins" },
};

const ORIGIN = STATE_COORDS.SP;

interface Props {
  destinationState: string;
  destinationCity?: string;
  /** 0 a 1: progresso da viagem (0 = origem, 1 = entregue) */
  progress: number;
  status: string;
  statusLabel: string;
}

export default function BrazilRouteMap({ destinationState, destinationCity, progress, status, statusLabel }: Props) {
  const dest = STATE_COORDS[destinationState?.toUpperCase()] || STATE_COORDS.SP;
  const isSameState = destinationState?.toUpperCase() === "SP";

  // Para SP→SP, cria uma pequena curva interna para visualizar movimento
  const target = isSameState ? { x: ORIGIN.x + 35, y: ORIGIN.y + 25, name: "São Paulo" } : dest;

  // Curva quadrática suave entre origem e destino
  const ctrlX = (ORIGIN.x + target.x) / 2 + (target.y - ORIGIN.y) * 0.25;
  const ctrlY = (ORIGIN.y + target.y) / 2 - Math.abs(target.x - ORIGIN.x) * 0.25;

  const pathD = `M ${ORIGIN.x} ${ORIGIN.y} Q ${ctrlX} ${ctrlY} ${target.x} ${target.y}`;

  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [pin, setPin] = useState({ x: ORIGIN.x, y: ORIGIN.y });

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
      const point = pathRef.current.getPointAtLength(len * Math.max(0, Math.min(1, progress)));
      setPin({ x: point.x, y: point.y });
    }
  }, [progress, pathD]);

  const drawnLength = useMemo(() => pathLength * Math.max(0, Math.min(1, progress)), [pathLength, progress]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Cabeçalho do mapa */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3 bg-gradient-to-b from-background/90 to-transparent backdrop-blur-sm flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Rota da entrega</p>
          <p className="text-sm font-semibold">São Paulo / SP → {destinationCity || target.name}/{destinationState}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Ao vivo</span>
        </div>
      </div>

      <svg viewBox="0 0 600 600" className="w-full h-auto" style={{ maxHeight: 500 }}>
        <defs>
          <linearGradient id="bg-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(220 30% 96%)" />
            <stop offset="100%" stopColor="hsl(210 40% 92%)" />
          </linearGradient>
          <linearGradient id="route-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <radialGradient id="pin-glow">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
          </pattern>
        </defs>

        <rect width="600" height="600" fill="url(#grid)" className="text-foreground" />

        {/* Silhueta simplificada do Brasil */}
        <path
          d="M 180,90 L 270,80 L 360,85 L 410,140 L 470,170 L 530,200 L 555,240 L 555,290 L 530,330 L 490,360 L 470,400 L 440,440 L 380,490 L 330,530 L 290,540 L 280,500 L 250,480 L 220,440 L 200,400 L 170,360 L 140,310 L 100,270 L 80,220 L 100,170 L 140,120 Z"
          fill="hsl(var(--muted))"
          opacity="0.5"
          stroke="hsl(var(--border))"
          strokeWidth="1.5"
        />

        {/* Pontos de todos os estados (faint) */}
        {Object.entries(STATE_COORDS).map(([uf, c]) => (
          <circle
            key={uf}
            cx={c.x}
            cy={c.y}
            r={uf === destinationState?.toUpperCase() || uf === "SP" ? 0 : 2.5}
            fill="hsl(var(--muted-foreground))"
            opacity="0.3"
          />
        ))}

        {/* Linha cinza de fundo (rota total) */}
        <path
          d={pathD}
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="2.5"
          strokeDasharray="4 6"
          opacity="0.4"
        />

        {/* Linha colorida (progresso) */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="url(#route-grad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength - drawnLength}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />

        {/* Marcador de origem (SP) */}
        <g>
          <circle cx={ORIGIN.x} cy={ORIGIN.y} r="14" fill="url(#pin-glow)" />
          <circle cx={ORIGIN.x} cy={ORIGIN.y} r="7" fill="#10b981" stroke="white" strokeWidth="2.5" />
          <text x={ORIGIN.x} y={ORIGIN.y + 26} textAnchor="middle" className="fill-foreground" fontSize="11" fontWeight="700">
            SP • Origem
          </text>
        </g>

        {/* Marcador de destino */}
        {!isSameState && (
          <g>
            <circle cx={dest.x} cy={dest.y} r="16" fill="url(#pin-glow)" opacity="0.7" />
            <circle cx={dest.x} cy={dest.y} r="8" fill="#3b82f6" stroke="white" strokeWidth="2.5" />
            <text x={dest.x} y={dest.y + 28} textAnchor="middle" className="fill-foreground" fontSize="11" fontWeight="700">
              {destinationCity ? `${destinationCity}/${destinationState}` : destinationState}
            </text>
          </g>
        )}

        {/* Pino animado da posição atual */}
        <g style={{ transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }} transform={`translate(${pin.x}, ${pin.y})`}>
          <circle r="22" fill="url(#pin-glow)">
            <animate attributeName="r" values="18;26;18" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle r="11" fill="white" stroke="#3b82f6" strokeWidth="3" />
          <path d="M 0,-6 L 0,6 M -6,0 L 6,0" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>

      {/* Rodapé com status atual */}
      <div className="px-4 py-3 border-t border-border bg-card/50 backdrop-blur">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Status atual</p>
            <p className="text-sm font-bold">{statusLabel}</p>
          </div>
          <div className="flex-1 max-w-xs">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-1000"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 text-right font-mono">{Math.round(progress * 100)}% do trajeto</p>
          </div>
        </div>
      </div>
    </div>
  );
}
