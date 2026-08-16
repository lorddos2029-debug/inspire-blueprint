# Plano de Reestruturação para Conversão (BelaCasa)

Aumentar a confiança e autoridade da loja transformando o layout "básico" em uma experiência de grande varejo.

## Mudanças Propostas

### 1. Home "Lifestyle" e Coleções
- **Barra de Benefícios VIP:** Substituir o marquee simples por blocos visuais grandes logo abaixo do banner (Frete Grátis, 12x Sem Juros, Troca Fácil, Compra Garantida).
- **Seções Temáticas:** Criar agrupamentos de produtos com banners de contexto:
  *   "Inverno Aconchegante" (Coberdrom, Mantas).
  *   "Cozinha de Chef" (Panelas, Liquidificadores).
  *   "Organização e Praticidade" (Escovas 9 em 1, Organizadores).
- **Banner de Categoria:** Adicionar carrossel de círculos com ícones/fotos para navegação rápida por categorias (Cama, Mesa, Banho, Eletro).

### 2. Gatilhos de Confiança e Urgência
- **Escassez Real:** Adicionar contador de estoque baixo (ex: "Apenas 4 unidades restantes") em produtos populares.
- **Social Proof em Tempo Real:** Pequeno balão/toast notificando compras recentes (ex: "Maria de SP acabou de comprar um Coberdrom").
- **Garantia Estendida:** Destacar o selo de "7 dias de satisfação ou seu dinheiro de volta" de forma mais agressiva na página de produto.

### 3. Melhoria Institucional
- **Sobre Nós Visual:** Adicionar fotos de alta qualidade e textos que humanizem a marca.
- **Footer de Autoridade:** Incluir logos de transportadoras (Correios, Jadlog) e selos de segurança (Google Safe, Reclame Aqui - mockup).

## Detalhes Técnicos
- **Componentes:** Criar `BenefitGrid.tsx`, `CategoryIcons.tsx` e `LifestyleSection.tsx`.
- **Estética:** Manter o padrão B&W/Coral, mas usar mais espaços brancos e imagens de contexto (mockups de lifestyle).
- **Mobile:** Priorizar o carregamento dos `CategoryIcons` para navegação por polegar.

---
**Deseja aprovar este plano para iniciarmos a reestruturação agora?**
