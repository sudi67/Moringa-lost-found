import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      user_id,
      items,
      shipping_address,
      billing_address,
      payment_method
    } = body

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Calculate totals
    let subtotal = 0
    for (const item of items) {
      subtotal += item.unit_price * item.quantity
    }

    const taxRate = 0.08 // 8% tax
    const taxAmount = subtotal * taxRate
    const shippingAmount = subtotal >= 50 ? 0 : 9.99 // Free shipping over $50
    const totalAmount = subtotal + taxAmount + shippingAmount

    // Create order
    const orderResult = await sql`
      INSERT INTO orders (
        user_id, order_number, status, subtotal, tax_amount, 
        shipping_amount, total_amount, shipping_address, 
        billing_address, payment_method
      )
      VALUES (
        ${user_id || null}, ${orderNumber}, 'pending', ${subtotal}, 
        ${taxAmount}, ${shippingAmount}, ${totalAmount}, 
        ${shipping_address}, ${billing_address}, ${payment_method}
      )
      RETURNING *
    `

    const order = orderResult[0]

    // Create order items
    for (const item of items) {
      await sql`
        INSERT INTO order_items (
          order_id, product_id, variant_id, quantity, 
          unit_price, total_price, custom_design_url, custom_text
        )
        VALUES (
          ${order.id}, ${item.product_id}, ${item.variant_id || null}, 
          ${item.quantity}, ${item.unit_price}, ${item.unit_price * item.quantity},
          ${item.custom_design_url || null}, ${item.custom_text || null}
        )
      `
    }

    return NextResponse.json({
      message: 'Order created successfully',
      order: {
        ...order,
        order_number: orderNumber
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    let query = `
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'variant_id', oi.variant_id,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'total_price', oi.total_price,
            'custom_design_url', oi.custom_design_url,
            'custom_text', oi.custom_text
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `

    const params = []

    if (userId) {
      query += ` WHERE o.user_id = $${params.length + 1}`
      params.push(parseInt(userId))
    }

    query += ` GROUP BY o.id ORDER BY o.created_at DESC`

    const orders = await sql(query, params)

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
