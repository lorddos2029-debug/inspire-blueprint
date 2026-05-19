/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container, Img, Section,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} 

interface EmailChangeEmailProps {
  siteName: string
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  oldEmail,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Confirme a alteração de e-mail na {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={{textAlign:'center',padding:'8px 0 24px'}}><Img src='https://norpnhvszwfbwqmvwmlf.supabase.co/storage/v1/object/public/email-assets/belacasa-logo.png' alt='BelaCasa' width='200' style={{margin:'0 auto',display:'block'}}/></Section>
        <Heading style={h1}>Confirmar alteração de e-mail</Heading>
        <Text style={text}>
          Você solicitou alterar o e-mail da sua conta na {siteName} de{' '}
          <Link href={`mailto:${oldEmail}`} style={link}>
            {oldEmail}
          </Link>{' '}
          para{' '}
          <Link href={`mailto:${newEmail}`} style={link}>
            {newEmail}
          </Link>
          .
        </Text>
        <Text style={text}>
          Clique no botão abaixo para confirmar esta alteração:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirmar Alteração
        </Button>
        <Text style={footer}>
          Se você não solicitou esta alteração, proteja sua conta imediatamente.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

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
const link = { color: '#141d2b', textDecoration: 'underline', fontWeight: '600' as const }
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
