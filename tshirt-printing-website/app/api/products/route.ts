import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const products = await sql`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        json_agg(
          json_build_object(
            'id', pv.id,
            'size', pv.size,
            'color', pv.color,
            'color_hex', pv.color_hex,
            'price_modifier', pv.price_modifier,
            'stock_quantity', pv.stock_quantity,
            'sku', pv.sku
          )
        ) as variants
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      WHERE p.is_active = true
      GROUP BY p.id, c.name, c.slug
      ORDER BY p.created_at DESC
    `

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { category_id, name, description, base_price, image_url } = body

    const result = await sql`
      INSERT INTO products (category_id, name, description, base_price, image_url)
      VALUES (${category_id}, ${name}, ${description}, ${base_price}, ${image_url})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
