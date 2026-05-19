// @ts-nocheck
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'BelaCasa'
const SITE_URL = 'https://belacasaoficial.online'

interface Props {
  customerName?: string
  orderNumber?: string
  productSummary?: string
  total?: string
}

const OrderCreatedEmail = ({ customerName, orderNumber, productSummary, total }: Props) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Recebemos seu pedido {orderNumber ? `#${orderNumber}` : ''} na BelaCasa</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Pedido recebido com sucesso!</Heading>
        <Text style={text}>
          {customerName ? `Olá ${customerName},` : 'Olá,'} obrigado pela sua compra na {SITE_NAME}.
        </Text>
        <Text style={text}>
          Confirmamos o recebimento do seu pedido. Estamos preparando tudo com muito cuidado.
        </Text>
        <Section style={card}>
          <Text style={cardLabel}>Número do pedido</Text>
          <Text style={cardValue}>{orderNumber || '—'}</Text>
          {productSummary && (<><Text style={cardLabel}>Itens</Text><Text style={cardValue}>{productSummary}</Text></>)}
          {total && (<><Text style={cardLabel}>Total</Text><Text style={cardValue}>{total}</Text></>)}
        </Section>
        <Button href={`${SITE_URL}/rastreio`} style={button}>Acompanhar pedido</Button>
        <Hr style={hr} />
        <Text style={footer}>{SITE_NAME} • Sua loja de confiança</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderCreatedEmail,
  subject: (d: Record<string, any>) => `Pedido recebido${d?.orderNumber ? ` #${d.orderNumber}` : ''} • BelaCasa`,
  displayName: 'Pedido criado',
  previewData: { customerName: 'João Silva', orderNumber: 'AO12345678', productSummary: '1x Camiseta Premium', total: 'R$ 149,90' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#000000', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 16px' }
const card = { backgroundColor: '#f7f7f7', borderRadius: '8px', padding: '20px', margin: '20px 0' }
const cardLabel = { fontSize: '12px', color: '#666', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '8px 0 4px' }
const cardValue = { fontSize: '15px', color: '#000', fontWeight: '600' as const, margin: '0 0 8px' }
const button = { backgroundColor: '#000000', color: '#ffffff', padding: '14px 28px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' as const, display: 'inline-block', margin: '16px 0' }
const hr = { borderColor: '#e6e6e6', margin: '32px 0 16px' }
const footer = { fontSize: '12px', color: '#999', textAlign: 'center' as const }
