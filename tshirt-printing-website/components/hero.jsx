import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://w7.pngwing.com/pngs/428/489/png-transparent-printed-t-shirt-direct-to-garment-printing-screen-printing-t-shirt-printing-design-tshirt-blue-white.png")'
        }}
      />
      <div className="absolute inset-0 bg-blue-900/70" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
          Custom Printing
          <span className="block text-yellow-400">Made Perfect</span>
        </h1>
        <p className="text-xl sm:text-2xl mb-8 text-gray-200">
          Professional T-shirt printing, custom mugs, and couple outfits. 
          High-quality designs that make your vision come to life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
            Start Designing
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
            View Portfolio
          </Button>
        </div>
      </div>
    </section>
  )
}
