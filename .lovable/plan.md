## Objetivo

Adicionar ao painel **PIX Pendentes** (`/painel` → aba PIX) um seletor de data que permita escolher **qual dia de criação** dos pedidos não pagos você quer atingir antes de disparar os lembretes por e-mail. Hoje só dá pra enviar para "todos" os PIX pendentes, sem distinção de quando o pedido foi gerado.

## O que muda na UI

Em `src/components/painel/PixPendentes.tsx`, na barra de ferramentas (acima da lista), adiciono:

1. **Botões rápidos de período**:
   - Hoje
   - Ontem
   - Últimos 7 dias
   - Tudo
2. **Date range picker customizado** (Popover + Calendar do shadcn, padrão pt-BR — igual ao que já existe no `Painel.tsx`):
   - Permite escolher um único dia (ex.: pedidos gerados em 28/04) ou um intervalo (ex.: 25/04 a 28/04).
3. **Stat cards** já existentes recalculam com base no filtro selecionado.
4. **Botão "Enviar para todos (N)"** passa a refletir só os pedidos do período escolhido — ou seja, dispara o lembrete somente para esse grupo.
5. **Botão "Exportar CSV"** também passa a exportar só o período escolhido.

## Exemplo de fluxo

```text
[ Hoje ] [ Ontem ] [ 7 dias ] [ Tudo ]   [📅 28/04/2026 ▾]    [ 🔄 ] [ Exportar ] [ ✉ Enviar para 12 ]
```

- Você clica em "Ontem" → lista mostra só os 12 PIX gerados ontem que continuam pendentes.
- Clica em "Enviar para 12" → dispara lembrete apenas para esses 12.

## Detalhes técnicos

- Filtro aplicado **em memória** sobre o array `orders` (já carregado da tabela `orders`, campo `created_at`), antes do filtro de busca por nome/e-mail/pedido que já existe.
- Reuso dos componentes `Calendar`, `Popover` e `date-fns/locale ptBR` que já estão no projeto (mesma stack usada em `src/pages/Painel.tsx`).
- Tipo `DateRange` do `react-day-picker` (já é dependência).
- Nenhuma mudança em backend, edge functions, banco de dados ou permissões — só front-end.
- Nenhuma mudança no template de e-mail `pix-reminder` nem no envio em si: o seletor apenas restringe o conjunto de destinatários do botão "Enviar para todos" e do envio individual continua funcionando como hoje.

## Arquivos afetados

- `src/components/painel/PixPendentes.tsx` (única alteração)
