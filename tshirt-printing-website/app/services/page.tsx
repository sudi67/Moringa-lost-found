import { Truck, Clock, Award, Headphones, Palette, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function ServicesPage() {
  const mainServices = [
    {
      icon: Palette,
      title: 'Custom T-Shirt Printing',
      description: 'High-quality screen printing and direct-to-garment printing for all your custom t-shirt needs.',
      features: ['Screen Printing', 'DTG Printing', 'Vinyl Transfer', 'Embroidery'],
      price: 'From $12'
    },
    {
      icon: Users,
      title: 'Personalized Mugs',
      description: 'Custom ceramic mugs with names, logos, or any design you can imagine.',
      features: ['Ceramic Mugs', 'Travel Mugs', 'Magic Mugs', 'Photo Printing'],
      price: 'From $8'
    },
    {
      icon: Award,
      title: 'Couple Outfits',
      description: 'Matching outfits for couples including t-shirts, hoodies, and accessories.',
      features: ['Matching T-Shirts', 'Couple Hoodies', 'Custom Designs', 'Gift Packaging'],
      price: 'From $25'
    }
  ]

  const additionalServices = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'Free shipping on orders over $50 with tracking included.',
      highlight: 'Orders $50+'
    },
    {
      icon: Clock,
      title: '24-Hour Rush Service',
      description: 'Need it fast? We offer 24-hour turnaround for urgent orders.',
      highlight: 'Rush Available'
    },
    {
      icon: Award,
      title: 'Quality Guarantee',
      description: '100% satisfaction guarantee or we will remake your order for free.',
      highlight: '100% Guaranteed'
    },
    {
      icon: Headphones,
      title: '24/7 Customer Support',
      description: 'Our support team is available around the clock to help you.',
      highlight: 'Always Available'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Professional printing services with unmatched quality and customer satisfaction
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive printing solutions for all your custom needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <service.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <Badge variant="secondary" className="text-lg font-semibold">
                    {service.price}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-center">
                    {service.description}
                  </CardDescription>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Features:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-gray-600 flex items-center">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Additional services that make us stand out from the competition
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <service.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {service.highlight}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to get your custom products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Choose Product', description: 'Select from our range of customizable products' },
              { step: '2', title: 'Design & Customize', description: 'Upload your design or work with our team' },
              { step: '3', title: 'Review & Order', description: 'Approve your design and place your order' },
              { step: '4', title: 'Receive & Enjoy', description: 'Get your custom products delivered to your door' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
