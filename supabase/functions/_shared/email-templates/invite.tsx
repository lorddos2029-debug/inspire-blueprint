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

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Você foi convidado para a {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={{textAlign:'center',padding:'8px 0 24px'}}><Img src='https://norpnhvszwfbwqmvwmlf.supabase.co/storage/v1/object/public/email-assets/belacasa-logo.png' alt='BelaCasa' width='200' style={{margin:'0 auto',display:'block'}}/></Section>
        <Heading style={h1}>Você foi convidado</Heading>
        <Text style={text}>
          Você recebeu um convite para participar da{' '}
          <Link href={siteUrl} style={link}>
            <strong>{siteName}</strong>
          </Link>
          . Clique no botão abaixo para aceitar e criar sua conta.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Aceitar Convite
        </Button>
        <Text style={footer}>
          Se você não esperava este convite, pode ignorar este e-mail com segurança.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

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
