/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Seu link de acesso para {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Link de acesso</Heading>
        <Text style={text}>
          Clique no botão abaixo para acessar sua conta na {siteName}.
          Este link expira em breve.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Acessar Conta
        </Button>
        <Text style={footer}>
          Se você não solicitou este link, pode ignorar este e-mail com segurança.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '28px 32px' }
const h1 = {
  fontSize: '26px',
  fontWeight: 'bold' as const,
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  color: '#141d2b',
  margin: '0 0 24px',
}
const text = {
  fontSize: '14px',
  color: '#5e626b',
  lineHeight: '1.6',
  margin: '0 0 22px',
}
const button = {
  backgroundColor: '#141d2b',
  color: '#faf6f0',
  fontSize: '14px',
  fontWeight: '600' as const,
  borderRadius: '8px',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'inline-block',
}
const footer = { fontSize: '12px', color: '#9a9da3', margin: '32px 0 0', lineHeight: '1.5' }
