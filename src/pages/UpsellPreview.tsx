import { useState } from "react";

const FUNNELS = [
  {
    label: "Funil Perfume",
    steps: [
      { path: "/upsell-perfume1", title: "Upsell Perfume 1" },
      { path: "/downsell-perfume1", title: "Downsell Perfume 1" },
      { path: "/upsell-perfume2", title: "Upsell Perfume 2" },
      { path: "/downsell-perfume2", title: "Downsell Perfume 2" },
      { path: "/upsell-perfume3", title: "Upsell Perfume 3" },
      { path: "/downsell-perfume3", title: "Downsell Perfume 3" },
    ],
  },
  {
    label: "Funil Tênis",
    steps: [
      { path: "/upsell-tenis1", title: "Upsell Tênis 1" },
      { path: "/downsell-tenis1", title: "Downsell Tênis 1" },
      { path: "/upsell-tenis2", title: "Upsell Tênis 2" },
      { path: "/downsell-tenis2", title: "Downsell Tênis 2" },
      { path: "/upsell-tenis3", title: "Upsell Tênis 3" },
      { path: "/downsell-tenis3", title: "Downsell Tênis 3" },
    ],
  },
  {
    label: "Funil Jaqueta",
    steps: [
      { path: "/upselljaqueta", title: "Upsell Jaqueta 1" },
      { path: "/upselljaqueta2", title: "Upsell Jaqueta 2" },
    ],
  },
  {
    label: "Antigos",
    steps: [
      { path: "/upselltenis", title: "Upsell Tênis (antigo)" },
      { path: "/upsellperfume", title: "Upsell Perfume (antigo)" },
      { path: "/upsellperfume2", title: "Upsell Perfume 2 (antigo)" },
      { path: "/downsellperfume", title: "Downsell Perfume (antigo)" },
    ],
  },
];

const UpsellPreview = () => {
  const [selected, setSelected] = useState(FUNNELS[0].steps[0].path);
  const url = `${selected}?preview=1`;

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      <header className="bg-black text-white px-4 py-3 flex flex-wrap items-center gap-3">
        <h1 className="font-semibold text-sm tracking-wider">VISUALIZADOR DE UPSELLS</h1>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="bg-neutral-900 border border-neutral-700 text-white text-sm rounded px-3 py-1.5 ml-auto"
        >
          {FUNNELS.map((g) => (
            <optgroup key={g.label} label={g.label}>
              {g.steps.map((s) => (
                <option key={s.path} value={s.path}>{s.title} — {s.path}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-xs underline text-neutral-300 hover:text-white"
        >
          Abrir em nova aba
        </a>
      </header>

      <div className="flex-1 flex items-start justify-center p-4 overflow-auto">
        <div
          className="bg-black rounded-[40px] p-3 shadow-2xl"
          style={{ width: 414 }}
        >
          <iframe
            key={url}
            src={url}
            title="Preview do upsell"
            className="bg-white rounded-[28px] block"
            style={{ width: 390, height: 780, border: 0 }}
          />
        </div>
      </div>

      <footer className="bg-white border-t px-4 py-2 text-xs text-neutral-600 text-center">
        Modo preview ativo (?preview=1) — dados fictícios. Botões de pagamento real não disparam cobrança sem dados reais.
      </footer>
    </div>
  );
};

export default UpsellPreview;
