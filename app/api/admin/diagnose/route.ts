import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { getSupabase } from '@/lib/supabase'
import { getAllBookings } from '@/lib/bookingStore'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const info: Record<string, unknown> = {
    storage: 'supabase',
    env: {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? '✓ set' : '✗ missing',
      SUPABASE_SERVICE_ROLE_KEY: serviceKey ? '✓ set' : '✗ missing',
    },
    project_url: supabaseUrl ?? 'not set',
  }

  try {
    const { error } = await getSupabase().from('bookings').select('id', { count: 'exact', head: true })
    if (error) throw error
    const bookings = await getAllBookings()
    info.connection = 'OK'
    info.booking_count = bookings.length
  } catch (err) {
    info.connection = 'FAILED'
    info.error = String(err)
  }

  return NextResponse.json(info, { status: 200 })
}
