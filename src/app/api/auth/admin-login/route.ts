import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const supabase = await createClient()

    // 1. Authenticate user
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError || !data.user) {
      return NextResponse.json({ error: signInError?.message || 'Authentication failed' }, { status: 401 })
    }

    // 2. Safely verify admin role via the database 
    // We utilize the project's 'admin_users' table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    // 3. Reject if not an admin
    if (adminError || !adminData) {
      // Force sign out the unauthorized user
      await supabase.auth.signOut()
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    if (!adminData.is_active) {
      await supabase.auth.signOut()
      return NextResponse.json({ error: 'Unauthorized: Admin account is deactivated' }, { status: 403 })
    }

    // Success response with specific admin dashboard redirect
    return NextResponse.json({ success: true, redirectTo: '/admin/dashboard' })
  } catch (error: any) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
