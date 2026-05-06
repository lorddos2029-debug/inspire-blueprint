// @ts-nocheck
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Img, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Alpha Oficial'
const SITE_URL = 'https://alphaoficial.online'

interface Props {
  customerName?: string
  orderNumber?: string
  total?: string
  pixCode?: string
  productSummary?: string
  productImage?: string
}

const PixGeneratedEmail = ({ customerName, orderNumber, total, pixCode, productSummary, productImage }: Props) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Seu PIX foi gerado — finalize o pagamento</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Aguardando pagamento via PIX</Heading>
        <Text style={text}>
          {customerName ? `Olá ${customerName},` : 'Olá,'} seu pedido foi registrado e o PIX foi gerado.
        </Text>
        <Text style={text}>Para garantir seu pedido, finalize o pagamento o quanto antes.</Text>

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
          {total && (<><Text style={cardLabel}>Valor</Text><Text style={cardValue}>{total}</Text></>)}
          {pixCode && (
            <>
              <Text style={cardLabel}>Código PIX (copia e cola)</Text>
              <Text style={pixCodeStyle}>{pixCode}</Text>
            </>
          )}
        </Section>
        <Button href={`${SITE_URL}/rastreio`} style={button}>Acompanhar pedido</Button>
        <Hr style={hr} />
        <Text style={footer}>{SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PixGeneratedEmail,
  subject: (d: Record<string, any>) => `PIX gerado${d?.orderNumber ? ` • Pedido ${d.orderNumber}` : ''}`,
  displayName: 'PIX gerado',
  previewData: { customerName: 'João Silva', orderNumber: 'AO12345678', total: 'R$ 149,90', pixCode: '00020126...exemplo', productSummary: '1x Tênis Masculino', productImage: 'https://alphaoficial.online/placeholder.svg' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#000000', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 16px' }
const card = { backgroundColor: '#f7f7f7', borderRadius: '8px', padding: '20px', margin: '20px 0' }
const productCard = { backgroundColor: '#fafafa', borderRadius: '8px', padding: '16px', margin: '16px 0', textAlign: 'center' as const, border: '1px solid #eee' }
const productImg = { borderRadius: '6px', margin: '0 auto', display: 'block', objectFit: 'cover' as const }
const productName = { fontSize: '14px', color: '#000', fontWeight: '600' as const, margin: '12px 0 0' }
const cardLabel = { fontSize: '12px', color: '#666', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '8px 0 4px' }
const cardValue = { fontSize: '15px', color: '#000', fontWeight: '600' as const, margin: '0 0 8px' }
const pixCodeStyle = { fontSize: '12px', color: '#000', wordBreak: 'break-all' as const, fontFamily: 'monospace', backgroundColor: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', margin: '0' }
const button = { backgroundColor: '#000000', color: '#ffffff', padding: '14px 28px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' as const, display: 'inline-block', margin: '16px 0' }
const hr = { borderColor: '#e6e6e6', margin: '32px 0 16px' }
const footer = { fontSize: '12px', color: '#999', textAlign: 'center' as const }
