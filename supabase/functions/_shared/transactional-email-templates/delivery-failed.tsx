// @ts-nocheck
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr, Img, Row, Column,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'BelaCasa'
const SITE_URL = 'https://belacasaoficial.online'

interface Item { name?: string; image?: string; quantity?: number }
interface Props {
  customerName?: string
  orderNumber?: string
  items?: Item[]
  errorUrl?: string
}

const DeliveryFailedEmail = ({ customerName, orderNumber, items, errorUrl }: Props) => {
  const safeItems = Array.isArray(items) ? items.slice(0, 4) : []
  const ctaUrl = errorUrl || `${SITE_URL}/erro${orderNumber ? `?pedido=${orderNumber}` : ''}`
  return (
    <Html lang="pt-BR" dir="ltr">
      <Head />
      <Preview>Não foi possível entregar o seu pedido</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Não foi possível entregar o seu pedido</Heading>
          <Text style={text}>
            {customerName ? `${customerName}, ` : ''}a transportadora não conseguiu concluir
            a entrega do seu pedido{orderNumber ? ` ${orderNumber}` : ''}.
          </Text>
          <Text style={text}>
            Para que possamos reenviar, é necessário o pagamento da taxa de reentrega.
            Clique no botão abaixo para regularizar e receber o seu pedido.
          </Text>

          {safeItems.length > 0 && (
            <Section style={card}>
              <Text style={cardLabel}>Itens do pedido</Text>
              {safeItems.map((it, i) => (
                <Row key={i} style={itemRow}>
                  {it.image && (
                    <Column style={imgCol}>
                      <Img src={it.image} alt="" width="56" height="56" style={itemImg} />
                    </Column>
                  )}
                  <Column>
                    <Text style={itemName}>{it.name || '—'}</Text>
                    {it.quantity ? <Text style={itemQty}>Qtd: {it.quantity}</Text> : null}
                  </Column>
                </Row>
              ))}
            </Section>
          )}

          <Section style={{ textAlign: 'center' as const }}>
            <Button href={ctaUrl} style={button}>RECEBER MEU PEDIDO</Button>
          </Section>

          <Text style={smallText}>
            Caso o pagamento da taxa não seja realizado, o pedido não será reenviado.
          </Text>

          <Hr style={hr} />
          <Text style={footer}>{SITE_NAME}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: DeliveryFailedEmail,
  subject: (d: Record<string, any>) =>
    `Falha na entrega${d?.orderNumber ? ` • ${d.orderNumber}` : ''} — ação necessária`,
  displayName: 'Falha na entrega',
  previewData: {
    customerName: 'João Silva',
    orderNumber: 'AO12345678',
    items: [{ name: 'Jaqueta Sarja Masculina', quantity: 1, image: 'https://via.placeholder.com/56' }],
    errorUrl: 'https://belacasaoficial.online/erro?pedido=AO12345678',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#000000', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 14px' }
const smallText = { fontSize: '12px', color: '#666', lineHeight: '1.5', margin: '16px 0 0', textAlign: 'center' as const }
const card = { backgroundColor: '#f7f7f7', borderRadius: '8px', padding: '16px 18px', margin: '20px 0' }
const cardLabel = { fontSize: '11px', color: '#666', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '0 0 10px' }
const itemRow = { marginBottom: '8px' }
const imgCol = { width: '64px', verticalAlign: 'top' as const }
const itemImg = { borderRadius: '6px', objectFit: 'cover' as const, display: 'block' as const }
const itemName = { fontSize: '13px', color: '#000', fontWeight: '600' as const, margin: '0 0 2px' }
const itemQty = { fontSize: '12px', color: '#666', margin: 0 }
const button = { backgroundColor: '#000000', color: '#ffffff', padding: '14px 28px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' as const, display: 'inline-block', margin: '20px 0 8px' }
const hr = { borderColor: '#e6e6e6', margin: '32px 0 16px' }
const footer = { fontSize: '12px', color: '#999', textAlign: 'center' as const }
