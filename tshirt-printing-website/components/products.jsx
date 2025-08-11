"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ShoppingCart } from 'lucide-react'

export default function Products() {
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON')
        }
        
        const data = await response.json()
        setProducts(data)
        setError(null)
      } catch (error) {
        console.error('Error fetching products:', error)
        setError(error.message)
        // Fallback to static data
        setProducts([
          {
            id: 1,
            name: 'Custom T-Shirts',
            description: 'High-quality cotton t-shirts with custom designs',
            price: 'From $15',
            image_url: '/custom-t-shirt-printing.png'
          },
          {
            id: 2,
            name: 'Custom Mugs',
            description: 'Personalized ceramic mugs with names and designs',
            price: 'From $12',
            image_url: '/placeholder.svg?height=400&width=400'
          },
          {
            id: 3,
            name: 'Couple Outfits',
            description: 'Matching couple t-shirts and hoodies',
            price: 'From $35',
            image_url: '/matching-couple-outfits.png'
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const colors = [
    { name: 'White', value: 'white', hex: '#FFFFFF' },
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'Navy', value: 'navy', hex: '#1E3A8A' },
    { name: 'Red', value: 'red', hex: '#DC2626' },
    { name: 'Green', value: 'green', hex: '#16A34A' },
    { name: 'Yellow', value: 'yellow', hex: '#EAB308' }
  ]

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color')
      return
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            product_id: 1,
            variant_id: null,
            quantity: parseInt(quantity),
            unit_price: 15.00
          }],
          shipping_address: 'Customer address',
          billing_address: 'Customer address',
          payment_method: 'pending'
        })
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Order created successfully! Order number: ${result.order.order_number}`)
      } else {
        alert('Failed to create order - please try again later')
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to create order - please try again later')
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our wide range of customizable products
          </p>
          {error && (
            <p className="text-sm text-orange-600 mt-2">
              Showing sample products (API temporarily unavailable)
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Grid */}
          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
              {products.slice(0, 3).map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="text-lg font-semibold">
                        {product.price || `From $${product.base_price}`}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Order Form */}
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl">Customize Your Order</CardTitle>
              <CardDescription>
                Select your preferences and place your order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Size Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Size</Label>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <RadioGroupItem value={size} id={size} />
                      <Label htmlFor={size} className="cursor-pointer px-3 py-1 border rounded-md hover:bg-gray-50">
                        {size}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Color Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Color</Label>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="grid grid-cols-3 gap-3">
                  {colors.map((color) => (
                    <div key={color.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={color.value} id={color.value} />
                      <Label htmlFor={color.value} className="cursor-pointer flex items-center space-x-2">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Quantity</Label>
                <Select value={quantity} onValueChange={setQuantity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quantity" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 10, 20, 50].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Order Button */}
              <Button className="w-full" size="lg" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart - $15.00
              </Button>

              <div className="text-sm text-gray-600 space-y-1">
                <p>• Free delivery on orders over $50</p>
                <p>• 24-hour turnaround available</p>
                <p>• 100% satisfaction guarantee</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
