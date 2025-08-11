import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)

    const product = await sql`
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
      WHERE p.id = ${productId} AND p.is_active = true
      GROUP BY p.id, c.name, c.slug
    `

    if (product.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product[0])
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
