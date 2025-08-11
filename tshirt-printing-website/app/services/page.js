'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle } from 'lucide-react'

export default function ServicesPage() {
  const services = [
    {
      title: 'Custom T-Shirt Printing',
      description: 'High-quality custom t-shirts with your design, logo, or text. Perfect for events, teams, or personal use.',
      features: ['Full color printing', 'Various sizes available', 'Fast turnaround', 'Bulk discounts'],
      price: 'Starting at $15.99',
      category: 'Apparel'
    },
    {
      title: 'Personalized Mugs',
      description: 'Create custom mugs for gifts, promotions, or personal use with your photos, text, or designs.',
      features: ['Dishwasher safe', 'Full wrap printing', 'Multiple sizes', 'Gift packaging available'],
      price: 'Starting at $12.99',
      category: 'Drinkware'
    },
    {
      title: 'Couple Matching Outfits',
      description: 'Design matching outfits for couples with custom messages, dates, or graphics.',
      features: ['Matching designs', 'Multiple color options', 'Size charts available', 'Premium fabrics'],
      price: 'Starting at $45.99/pair',
      category: 'Couples'
    },
    {
      title: 'Family Reunion T-Shirts',
      description: 'Custom t-shirts for family reunions with names, dates, and special designs.',
      features: ['Family name customization', 'Year and location options', 'Multiple sizes', 'Group photos'],
      price: 'Starting at $18.99',
      category: 'Events'
    },
    {
      title: 'Corporate Branding',
      description: 'Professional custom printing for businesses including logos, uniforms, and promotional items.',
      features: ['Logo design services', 'Brand consistency', 'Bulk orders', 'Fast delivery'],
      price: 'Custom quote',
      category: 'Business'
    },
    {
      title: 'Anniversary Gifts',
      description: 'Special anniversary gifts with personalized messages, dates, and photos.',
      features: ['Custom date printing', 'Photo integration', 'Premium materials', 'Gift packaging'],
      price: 'Starting at $25.99',
      category: 'Gifts'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive range of custom printing services designed to bring your creative visions to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full">Get Started</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
