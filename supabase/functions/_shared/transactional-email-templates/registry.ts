// @ts-nocheck
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as orderCreated } from './order-created.tsx'
import { template as pixGenerated } from './pix-generated.tsx'
import { template as pixReminder } from './pix-reminder.tsx'
import { template as paymentApproved } from './payment-approved.tsx'
import { template as orderShipped } from './order-shipped.tsx'
import { template as orderDelivered } from './order-delivered.tsx'
import { template as deliveryFailed } from './delivery-failed.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'order-created': orderCreated,
  'pix-generated': pixGenerated,
  'pix-reminder': pixReminder,
  'payment-approved': paymentApproved,
  'order-shipped': orderShipped,
  'order-delivered': orderDelivered,
  'delivery-failed': deliveryFailed,
}
