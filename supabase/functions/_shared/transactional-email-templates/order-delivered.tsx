// @ts-nocheck
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Img, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'BelaCasa'
const SITE_URL = 'https://belacasaoficial.online'

interface Props { customerName?: string; orderNumber?: string }

const OrderDeliveredEmail = ({ customerName, orderNumber }: Props) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Seu pedido foi entregue! Esperamos que ame ✨</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={{textAlign:'center',padding:'8px 0 24px'}}><Img src='https://norpnhvszwfbwqmvwmlf.supabase.co/storage/v1/object/public/email-assets/belacasa-logo.png' alt='BelaCasa' width='200' style={{margin:'0 auto',display:'block'}}/></Section>
        <Heading style={h1}>Pedido entregue! ✨</Heading>
        <Text style={text}>{customerName ? `${customerName}, ` : ''}seu pedido foi entregue com sucesso.</Text>
        <Text style={text}>Esperamos que você ame seus produtos. Obrigado por escolher a {SITE_NAME}!</Text>
        <Section style={card}>
          <Text style={cardLabel}>Pedido</Text>
          <Text style={cardValue}>{orderNumber || '—'}</Text>
        </Section>
        <Button href={SITE_URL} style={button}>Voltar à loja</Button>
        <Hr style={hr} />
        <Text style={footer}>{SITE_NAME} • Conte com a gente sempre 💛</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderDeliveredEmail,
  subject: (d: Record<string, any>) => `Pedido entregue${d?.orderNumber ? ` • ${d.orderNumber}` : ''} ✨`,
  displayName: 'Pedido entregue',
  previewData: { customerName: 'João Silva', orderNumber: 'AO12345678' },
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
