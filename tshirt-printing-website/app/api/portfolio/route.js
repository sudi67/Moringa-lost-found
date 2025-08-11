import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    // If no database connection, return fallback data
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([
        {
          id: 1,
          title: 'Corporate Branded T-Shirts',
          category: 'T-Shirts',
          subcategory: 'Business',
          image_url: '/placeholder-ml1gr.png',
          description: 'Custom branded t-shirts for tech startup with modern logo design',
          is_featured: true,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Wedding Anniversary Mugs',
          category: 'Mugs',
          subcategory: 'Personal',
          image_url: '/placeholder-hmei8.png',
          description: 'Personalized ceramic mugs celebrating 25th wedding anniversary',
          is_featured: true,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          title: 'Matching Couple Hoodies',
          category: 'Couples',
          subcategory: 'Personal',
          image_url: '/matching-couple-outfits.png',
          description: 'Cozy matching hoodies with complementary designs for young couple',
          is_featured: true,
          created_at: new Date().toISOString()
        }
      ])
    }

    let portfolioItems = []

    try {
      if (category && category !== 'All') {
        portfolioItems = await sql`
          SELECT * FROM portfolio_items
          WHERE (category = ${category} OR subcategory = ${category})
          ORDER BY created_at DESC
        `
      } else if (featured === 'true') {
        portfolioItems = await sql`
          SELECT * FROM portfolio_items
          WHERE is_featured = true
          ORDER BY created_at DESC
        `
      } else {
        portfolioItems = await sql`
          SELECT * FROM portfolio_items
          ORDER BY created_at DESC
        `
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
      // Return fallback data if database query fails
      portfolioItems = [
        {
          id: 1,
          title: 'Corporate Branded T-Shirts',
          category: 'T-Shirts',
          subcategory: 'Business',
          image_url: '/placeholder-ml1gr.png',
          description: 'Custom branded t-shirts for tech startup with modern logo design',
          is_featured: true,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Wedding Anniversary Mugs',
          category: 'Mugs',
          subcategory: 'Personal',
          image_url: '/placeholder-hmei8.png',
          description: 'Personalized ceramic mugs celebrating 25th wedding anniversary',
          is_featured: true,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          title: 'Matching Couple Hoodies',
          category: 'Couples',
          subcategory: 'Personal',
          image_url: '/matching-couple-outfits.png',
          description: 'Cozy matching hoodies with complementary designs for young couple',
          is_featured: true,
          created_at: new Date().toISOString()
        }
      ]
    }

    return NextResponse.json(portfolioItems)
  } catch (error) {
    console.error('Error in portfolio API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { title, description, category, subcategory, image_url, is_featured } = body

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const result = await sql`
      INSERT INTO portfolio_items (title, description, category, subcategory, image_url, is_featured)
      VALUES (${title}, ${description}, ${category}, ${subcategory}, ${image_url}, ${is_featured || false})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error creating portfolio item:', error)
    return NextResponse.json(
      { error: 'Failed to create portfolio item' },
      { status: 500 }
    )
  }
}
