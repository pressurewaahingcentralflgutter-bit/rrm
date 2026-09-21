import type { Booking } from '@/types/booking'
import { getSupabase } from './supabase'

type BookingRow = {
  id: string
  created_at: string
  updated_at: string
  status: string
  services: string[]
  property_type: string | null
  bedroom_count: number | null
  scheduled_date: string | null
  scheduled_time: string | null
  estimated_duration_hours: number | null
  estimated_price: number | null
  confirmed_price: number | null
  customer_name: string
  customer_phone: string
  customer_email: string
  customer_postal_code: string
  customer_address: string | null
  customer_notes: string | null
}

function rowToBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status as Booking['status'],
    services: row.services as Booking['services'],
    propertyType: (row.property_type ?? '') as Booking['propertyType'],
    bedroomCount: row.bedroom_count ?? undefined,
    scheduledDate: row.scheduled_date ?? undefined,
    scheduledTime: row.scheduled_time ?? undefined,
    estimatedDurationHours: row.estimated_duration_hours ?? undefined,
    estimatedPrice: row.estimated_price ?? undefined,
    confirmedPrice: row.confirmed_price ?? undefined,
    customer: {
      name: row.customer_name,
      phone: row.customer_phone,
      email: row.customer_email,
      postalCode: row.customer_postal_code,
      address: row.customer_address ?? undefined,
      notes: row.customer_notes ?? undefined,
    },
  }
}

function generateId(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `BK-${ts}-${rand}`
}

export async function getAllBookings(): Promise<Booking[]> {
  const { data, error } = await getSupabase()
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as BookingRow[]).map(rowToBooking)
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const { data, error } = await getSupabase()
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return rowToBooking(data as BookingRow)
}

export async function createBooking(
  input: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<Booking> {
  const now = new Date().toISOString()
  const row = {
    id: generateId(),
    created_at: now,
    updated_at: now,
    status: 'pending_quote',
    services: input.services,
    property_type: input.propertyType || null,
    bedroom_count: input.bedroomCount ?? null,
    scheduled_date: input.scheduledDate ?? null,
    scheduled_time: input.scheduledTime ?? null,
    estimated_duration_hours: input.estimatedDurationHours ?? null,
    estimated_price: input.estimatedPrice ?? null,
    confirmed_price: input.confirmedPrice ?? null,
    customer_name: input.customer.name,
    customer_phone: input.customer.phone,
    customer_email: input.customer.email,
    customer_postal_code: input.customer.postalCode,
    customer_address: input.customer.address ?? null,
    customer_notes: input.customer.notes ?? null,
  }
  const { data, error } = await getSupabase().from('bookings').insert(row).select().single()
  if (error) throw error
  return rowToBooking(data as BookingRow)
}

export async function updateBooking(
  id: string,
  updates: Partial<Pick<Booking, 'status' | 'confirmedPrice'>>
): Promise<Booking | null> {
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (updates.status !== undefined) patch.status = updates.status
  if (updates.confirmedPrice !== undefined) patch.confirmed_price = updates.confirmedPrice
  const { data, error } = await getSupabase()
    .from('bookings')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) return null
  return rowToBooking(data as BookingRow)
}

export async function deleteBooking(id: string): Promise<boolean> {
  const { error } = await getSupabase().from('bookings').delete().eq('id', id)
  return !error
}

export async function getBookedTimeSlotsForDate(dateStr: string): Promise<string[]> {
  const { data, error } = await getSupabase()
    .from('bookings')
    .select('scheduled_time')
    .eq('scheduled_date', dateStr)
    .neq('status', 'cancelled')
  if (error) return []
  return (data as { scheduled_time: string | null }[])
    .map((r) => r.scheduled_time ?? '')
    .filter(Boolean)
}

// ─── Admin password override ─────────────────────────────────────────────────

export async function getAdminPasswordOverride(): Promise<string | null> {
  const { data } = await getSupabase()
    .from('admin_settings')
    .select('value')
    .eq('key', 'admin_password')
    .single()
  return data?.value ?? null
}

export async function setAdminPasswordOverride(password: string): Promise<void> {
  await getSupabase()
    .from('admin_settings')
    .upsert({ key: 'admin_password', value: password }, { onConflict: 'key' })
}
