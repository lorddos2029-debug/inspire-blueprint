// @ts-nocheck
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Img, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Alpha Oficial'

interface Props {
  customerName?: string
  orderNumber?: string
  total?: string
  productSummary?: string
  productImage?: string
  checkoutUrl?: string
}

const PixReminderEmail = ({ customerName, orderNumber, total, productSummary, productImage, checkoutUrl }: Props) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>{`Você esqueceu seu pedido ${orderNumber || ''} na ${SITE_NAME}`.trim()}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Olá{customerName ? `, ${customerName}` : ''} 👋</Heading>
        <Text style={text}>
          Notamos que você iniciou um pedido na <strong>{SITE_NAME}</strong> hoje, mas ainda não finalizou o pagamento.
        </Text>
        <Text style={text}>
          Seu carrinho ainda está reservado! Volte para concluir a compra em apenas 1 clique:
        </Text>

        {(productImage || productSummary) && (
          <Section style={productCard}>
            {productImage && (
              <Img src={productImage} alt={productSummary || 'Produto'} width="120" height="120" style={productImg} />
            )}
            {productSummary && <Text style={productName}>{productSummary}</Text>}
          </Section>
        )}

        <Section style={card}>
          <Text style={cardLabel}>Pedido</Text>
          <Text style={cardValue}>{orderNumber || '—'}</Text>
          {total && (<><Text style={cardLabel}>Valor</Text><Text style={cardValueLarge}>{total}</Text></>)}
        </Section>

        {checkoutUrl && (
          <Section style={{ textAlign: 'center' as const, margin: '32px 0' }}>
            <Button href={checkoutUrl} style={button}>Voltar e finalizar compra</Button>
          </Section>
        )}

        <Text style={textSmall}>
          Ao clicar no botão acima, seu carrinho será restaurado automaticamente — sem precisar digitar nada de novo.
        </Text>

        <Hr style={hr} />
        <Text style={footer}>
          {SITE_NAME}
          <br />
          Este e-mail foi enviado porque você iniciou um pedido em nosso site hoje.
          <br />
          Se já efetuou o pagamento, por favor desconsidere esta mensagem.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PixReminderEmail,
  subject: (d: Record<string, any>) =>
    d?.orderNumber ? `Você esqueceu seu pedido ${d.orderNumber} 🛒` : `Você esqueceu seu pedido na ${SITE_NAME} 🛒`,
  displayName: 'Lembrete de carrinho (PIX pendente)',
  previewData: {
    customerName: 'João Silva',
    orderNumber: 'AO12345678',
    total: 'R$ 149,90',
    productSummary: '1x Tênis Masculino',
    productImage: 'https://alphaoficial.online/placeholder.svg',
    checkoutUrl: 'https://alphaoficial.online/checkout?restore=abc-123',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#000000', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 16px' }
const textSmall = { fontSize: '13px', color: '#666', lineHeight: '1.5', margin: '16px 0 0', textAlign: 'center' as const }
const card = { backgroundColor: '#f7f7f7', borderRadius: '8px', padding: '20px', margin: '20px 0' }
const productCard = { backgroundColor: '#fafafa', borderRadius: '8px', padding: '16px', margin: '16px 0', textAlign: 'center' as const, border: '1px solid #eee' }
const productImg = { borderRadius: '6px', margin: '0 auto', display: 'block', objectFit: 'cover' as const }
const productName = { fontSize: '14px', color: '#000', fontWeight: '600' as const, margin: '12px 0 0' }
const cardLabel = { fontSize: '12px', color: '#666', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '8px 0 4px' }
const cardValue = { fontSize: '15px', color: '#000', fontWeight: '600' as const, margin: '0 0 8px' }
const cardValueLarge = { fontSize: '22px', color: '#000', fontWeight: 'bold' as const, margin: '0 0 8px' }
const button = { backgroundColor: '#000000', color: '#ffffff', padding: '16px 36px', borderRadius: '6px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold' as const, display: 'inline-block' }
const hr = { borderColor: '#e6e6e6', margin: '32px 0 16px' }
const footer = { fontSize: '12px', color: '#999', textAlign: 'center' as const, lineHeight: '1.6' }
