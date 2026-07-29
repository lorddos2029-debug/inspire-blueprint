## Objetivo

Recriar o layout do casaprestige.com.br na loja, em desktop e mobile: home completa, página de produto, paleta, catálogo de 17 produtos, sem a seção "Seja um revendedor" e com as fotos geradas por IA substituídas pelas fotos reais.

> Observação: não consigo executar este plano na sessão atual (modo de revisão de segurança, sem ferramentas de escrita). Troque para o modo **Build** no seletor ao lado do campo de mensagem e aprove este plano.

## Design system

Novos tokens em `src/index.css` e `tailwind.config.ts`:

| Token | Valor | Uso |
|---|---|---|
| `--background` | `#F7EDE3` creme | fundo geral |
| `--topbar` | `#EBC49F` bege pêssego | barra de aviso e campo de busca |
| `--primary` | `#E8845C` coral-terracota | CTAs, preços, destaques |
| `--foreground` | `#2E2E2E` grafite | texto |
| `--card` | `#FFFFFF` | cards de produto |
| `--radius` | `0.75rem` | cantos arredondados |

Tipografia: Poppins (títulos e corpo), pesos 400/600/700.

## Home

1. `TopBar` — faixa `#EBC49F`, texto centralizado "FRETE GRÁTIS NA COMPRA DE AIR FRYER PARA TODO O BRASIL".
2. `Header` — grid de 3 colunas: campo de busca em pill bege | logo centralizada | login/cadastro + carrinho com contador e total. No mobile vira hambúrguer + logo + carrinho.
3. `MainNav` — barra branca flutuante, cantos arredondados, links centralizados: Início · Air Fryer Innovare · Todos os Produtos · Como Comprar. **Sem "Seja um revendedor".**
4. `Hero` — imagem full-bleed, título gigante bicolor (grafite + coral), subtítulo, CTA preto retangular "EU QUERO >>", dois selos com ícone circular ("CESTO EM VIDRO", "PAINEL DIGITAL"). No mobile: texto acima, imagem abaixo.
5. `ProductGrid` "Tudo para a sua Casa" — 4 colunas no desktop, 2 no mobile. Card com: troca de imagem no hover, selo "Grátis" (frete), nome, preço riscado, preço atual, badge de % OFF, parcelamento e preço no Pix.
6. `Footer` + botão flutuante de WhatsApp.

## Página de produto

- Galeria com miniaturas laterais (carrossel no mobile) e contador "1 / 7".
- Badge "+80 vendidos".
- Bloco de preço: riscado, atual, % OFF, preço no Pix e parcelamento sem juros.
- Avisos: "10% de desconto pagando com Pix" e "Frete grátis".
- Seletor de variante em pills (ex.: Voltagem 110v / 220v).
- Escassez: "Só restam 15 em estoque!".
- Botão "Comprar" em destaque coral, largura total.
- Descrição rica com subtítulos e lista de características.

## Catálogo

Substituir `src/data/products.ts` e `src/data/categoryProducts.ts` pelos 17 produtos, com preço, preço original e % OFF:

Air Fryer Innovare R$650 (21%) · Aparador Buffet R$69,90 (29%) · Suporte Duplo de Parede R$99 (24%) · 6 Taças Diamond R$39,90 (32%) · Sapateira Industrial R$129,90 (27%) · Sapateira Simples R$59,90 (19%) · Mesa Cabeceira R$35,90 (32%) · Prateleira Infantil R$59,90 (33%) · Suporte Micro-ondas R$99,90 (26%) · Mesa de Centro R$99,90 (29%) · Mini Tábua Térmica R$49,90 (33%) · Armário Suspenso R$55,90 (30%) · Suporte Monitor R$59,90 (24%) · Rack Sapateira R$59,90 (20%) · Cabeceira Safira R$49,90 (24%) · Mop Spray R$36,40 (30%) · Mop Inox Balde R$50 (38%).

Imagens: baixar as fotos reais e gravar em `public/assets/casaprestige/`. Para os 6 itens cuja imagem principal é gerada por IA (Aparador Buffet, Prateleira Infantil, Mini Tábua, Suporte Monitor, Cabeceira Safira, Mop Inox), usar a segunda imagem do card, que é foto real de marketplace, como principal.

## Ajustes técnicos

- Reescrever `Header`, `HeroBanner`, `ProductCard`, `ProductGrid`, `CategorySections`, `Footer` e `ProductPage`.
- Manter intactos: carrinho, checkout de 3 etapas, rastreamento (Pixel/UTM), integrações de pagamento e o painel `/painel`.
- Atualizar `index.html` com title e meta description da loja.
- Testes mobile em 390px e desktop em 1440px via Playwright.

## Sequência

1. Tokens e tipografia.
2. Download e organização das imagens dos 17 produtos.
3. Dados do catálogo.
4. Header, TopBar e MainNav.
5. Hero e grid da home.
6. Página de produto.
7. Footer e revisão responsiva.
