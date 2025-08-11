import { Award, Users, Clock, Heart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  const stats = [
    { icon: Users, label: 'Happy Customers', value: '10,000+' },
    { icon: Clock, label: 'Years Experience', value: '8+' },
    { icon: Award, label: 'Projects Completed', value: '25,000+' },
    { icon: Heart, label: 'Customer Satisfaction', value: '99%' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">About PrintCraft</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We are passionate about bringing your creative visions to life through high-quality custom printing services.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2016, PrintCraft started as a small family business with a simple mission: 
                  to provide high-quality custom printing services that help people express their creativity 
                  and build their brands.
                </p>
                <p>
                  What began as a single printing press in a garage has grown into a full-service printing 
                  company serving thousands of customers nationwide. We specialize in custom t-shirts, 
                  personalized mugs, couple outfits, and logo design services.
                </p>
                <p>
                  Our commitment to quality, fast turnaround times, and exceptional customer service has 
                  made us a trusted partner for individuals, businesses, and organizations of all sizes.
                </p>
              </div>
            </div>
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              <img
                src="/printing-workshop.png"
                alt="Our printing workshop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Quality First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We use only the finest materials and latest printing technology to ensure 
                  every product meets our high standards.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Customer Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your satisfaction is our priority. We work closely with you to bring 
                  your vision to life exactly as you imagined.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We continuously invest in new technologies and techniques to offer 
                  you the best printing solutions available.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
