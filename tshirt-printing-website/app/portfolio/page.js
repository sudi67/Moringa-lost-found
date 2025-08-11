'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ExternalLink } from 'lucide-react'

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories] = useState(['All', 'T-Shirts', 'Mugs', 'Couples', 'Business', 'Personal'])

  useEffect(() => {
    fetchPortfolioItems()
  }, [selectedCategory])

  const fetchPortfolioItems = async () => {
    try {
      setLoading(true)
      const url = selectedCategory === 'All' 
        ? '/api/portfolio' 
        : `/api/portfolio?category=${selectedCategory}`
      
      const response = await fetch(url)
      const data = await response.json()
      setPortfolioItems(data)
    } catch (error) {
      console.error('Error fetching portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Portfolio</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of custom printing projects and get inspired for your next design
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  {item.is_featured && (
                    <Badge variant="secondary" className="ml-2">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">{item.category}</Badge>
                  <Badge variant="outline">{item.subcategory}</Badge>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <a href={item.image_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Size
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {portfolioItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No portfolio items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
