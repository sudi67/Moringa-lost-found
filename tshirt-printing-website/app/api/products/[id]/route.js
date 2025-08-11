import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const { id } = params

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
      WHERE p.id = ${parseInt(id)}
      GROUP BY p.id, c.name, c.slug
    `

    if (!product || product.length === 0) {
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

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { category_id, name, description, base_price, image_url } = body

    const result = await sql`
      UPDATE products
      SET category_id = ${category_id}, name = ${name}, description = ${description}, base_price = ${base_price}, image_url = ${image_url}
      WHERE id = ${parseInt(id)}
      RETURNING *
    `

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const result = await sql`
      DELETE FROM products
      WHERE id = ${parseInt(id)}
      RETURNING *
    `

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
