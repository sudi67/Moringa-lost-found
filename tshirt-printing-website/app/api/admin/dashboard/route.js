import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    // Get dashboard statistics
    const stats = await Promise.all([
      // Total orders
      sql`SELECT COUNT(*) as total_orders FROM orders`,
      
      // Total revenue
      sql`SELECT COALESCE(SUM(total_amount), 0) as total_revenue FROM orders WHERE payment_status = 'completed'`,
      
      // Pending orders
      sql`SELECT COUNT(*) as pending_orders FROM orders WHERE status = 'pending'`,
      
      // Total customers
      sql`SELECT COUNT(*) as total_customers FROM users`,
      
      // Recent orders
      sql`
        SELECT 
          o.id, o.order_number, o.total_amount, o.status, o.created_at,
          COALESCE(u.first_name || ' ' || u.last_name, 'Guest') as customer_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 10
      `,
      
      // Contact submissions
      sql`SELECT COUNT(*) as contact_submissions FROM contact_submissions WHERE status = 'new'`
    ])

    return NextResponse.json({
      totalOrders: parseInt(stats[0][0].total_orders),
      totalRevenue: parseFloat(stats[1][0].total_revenue),
      pendingOrders: parseInt(stats[2][0].pending_orders),
      totalCustomers: parseInt(stats[3][0].total_customers),
      recentOrders: stats[4],
      newContactSubmissions: parseInt(stats[5][0].contact_submissions)
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
