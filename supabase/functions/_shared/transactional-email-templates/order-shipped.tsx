// @ts-nocheck
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'BelaCasa'
const SITE_URL = 'https://belacasaoficial.online'

interface Props { customerName?: string; orderNumber?: string; trackingCode?: string }

const OrderShippedEmail = ({ customerName, orderNumber, trackingCode }: Props) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Seu pedido foi enviado! 📦</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Seu pedido foi enviado! 📦</Heading>
        <Text style={text}>{customerName ? `${customerName}, ` : ''}boas notícias! Seu pedido já está a caminho.</Text>
        <Section style={card}>
          <Text style={cardLabel}>Pedido</Text>
          <Text style={cardValue}>{orderNumber || '—'}</Text>
          <Text style={cardLabel}>Código de rastreio</Text>
          <Text style={trackingValue}>{trackingCode || '—'}</Text>
        </Section>
        <Button href={`${SITE_URL}/rastreio`} style={button}>Acompanhar pedido</Button>
        <Text style={smallText}>Use o código acima na nossa página de rastreio para acompanhar a entrega em tempo real.</Text>
        <Hr style={hr} />
        <Text style={footer}>{SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderShippedEmail,
  subject: (d: Record<string, any>) => `Pedido enviado${d?.orderNumber ? ` • ${d.orderNumber}` : ''} 📦`,
  displayName: 'Pedido enviado',
  previewData: { customerName: 'João Silva', orderNumber: 'AO12345678', trackingCode: 'LV123456789BR' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#000000', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 16px' }
const smallText = { fontSize: '13px', color: '#666', lineHeight: '1.5', margin: '12px 0' }
const card = { backgroundColor: '#f7f7f7', borderRadius: '8px', padding: '20px', margin: '20px 0' }
const cardLabel = { fontSize: '12px', color: '#666', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '8px 0 4px' }
const cardValue = { fontSize: '15px', color: '#000', fontWeight: '600' as const, margin: '0 0 8px' }
const trackingValue = { fontSize: '18px', color: '#000', fontWeight: 'bold' as const, fontFamily: 'monospace', margin: '0 0 8px', letterSpacing: '1px' }
const button = { backgroundColor: '#000000', color: '#ffffff', padding: '14px 28px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' as const, display: 'inline-block', margin: '16px 0' }
const hr = { borderColor: '#e6e6e6', margin: '32px 0 16px' }
const footer = { fontSize: '12px', color: '#999', textAlign: 'center' as const }
