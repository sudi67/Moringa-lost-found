"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('/api/portfolio')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON')
        }
        
        const data = await response.json()
        setPortfolioItems(data)
        setError(null)
      } catch (error) {
        console.error('Error fetching portfolio:', error)
        setError(error.message)
        // Fallback to static data if API fails
        setPortfolioItems([
          {
            id: 1,
            title: 'Corporate Branded T-Shirts',
            category: 'T-Shirts',
            subcategory: 'Business',
            image_url: '/placeholder-ml1gr.png',
            description: 'Custom branded t-shirts for tech startup with modern logo design'
          },
          {
            id: 2,
            title: 'Wedding Anniversary Mugs',
            category: 'Mugs',
            subcategory: 'Personal',
            image_url: '/placeholder-hmei8.png',
            description: 'Personalized ceramic mugs celebrating 25th wedding anniversary'
          },
          {
            id: 3,
            title: 'Matching Couple Hoodies',
            category: 'Couples',
            subcategory: 'Personal',
            image_url: '/matching-couple-outfits.png',
            description: 'Cozy matching hoodies with complementary designs for young couple'
          },
          {
            id: 4,
            title: 'Sports Team Jerseys',
            category: 'T-Shirts',
            subcategory: 'Business',
            image_url: '/placeholder-twnmb.png',
            description: 'Professional jerseys for local basketball team with player names and numbers'
          },
          {
            id: 5,
            title: 'Promotional Coffee Mugs',
            category: 'Mugs',
            subcategory: 'Business',
            image_url: '/promotional-business-mugs.png',
            description: 'Branded coffee mugs for marketing campaign and corporate gifts'
          },
          {
            id: 6,
            title: 'Family Reunion T-Shirts',
            category: 'T-Shirts',
            subcategory: 'Personal',
            image_url: '/family-reunion-tshirts.png',
            description: 'Custom family reunion shirts with family tree design and names'
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    
    fetchPortfolio()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Portfolio
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Check out some of our recent work and see the quality we deliver
            </p>
          </div>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading portfolio...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our Portfolio
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Check out some of our recent work and see the quality we deliver
          </p>
          {error && (
            <p className="text-sm text-orange-600 mt-2">
              Showing sample portfolio (API temporarily unavailable)
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  <Badge variant="secondary">{item.category}</Badge>
                </div>
                <p className="text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
