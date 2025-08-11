import { Truck, Clock, Award, Headphones } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Services() {
  const services = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'Free delivery on orders over $50. Fast and reliable shipping nationwide.'
    },
    {
      icon: Clock,
      title: '24-Hour Turnaround',
      description: 'Quick processing and printing for urgent orders. Quality guaranteed.'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'High-grade materials and professional printing techniques for lasting results.'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help with your printing needs.'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose PrintCraft?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We provide exceptional printing services with unmatched quality and customer satisfaction.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <service.icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
