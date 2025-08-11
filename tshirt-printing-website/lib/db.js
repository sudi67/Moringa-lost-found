import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

export const sql = neon(process.env.DATABASE_URL)

// Database types
export const User = {
  id: 0,
  email: '',
  first_name: '',
  last_name: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  country: '',
  created_at: '',
  updated_at: ''
}

export const Category = {
  id: 0,
  name: '',
  description: '',
  slug: '',
  created_at: ''
}

export const Product = {
  id: 0,
  category_id: 0,
  name: '',
  description: '',
  base_price: 0,
  image_url: '',
  is_active: true,
  created_at: '',
  updated_at: ''
}

export const ProductVariant = {
  id: 0,
  product_id: 0,
  size: '',
  color: '',
  color_hex: '',
  price_modifier: 0,
  stock_quantity: 0,
  sku: '',
  created_at: ''
}

export const Order = {
  id: 0,
  user_id: 0,
  order_number: '',
  status: '',
  subtotal: 0,
  tax_amount: 0,
  shipping_amount: 0,
  total_amount: 0,
  shipping_address: '',
  billing_address: '',
  payment_status: '',
  payment_method: '',
  notes: '',
  created_at: '',
  updated_at: ''
}

export const OrderItem = {
  id: 0,
  order_id: 0,
  product_id: 0,
  variant_id: 0,
  quantity: 0,
  unit_price: 0,
  total_price: 0,
  custom_design_url: '',
  custom_text: '',
  created_at: ''
}

export const PortfolioItem = {
  id: 0,
  title: '',
  description: '',
  category: '',
  subcategory: '',
  image_url: '',
  is_featured: false,
  created_at: ''
}

export const ContactSubmission = {
  id: 0,
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
  status: '',
  created_at: ''
}

export const CartItem = {
  id: 0,
  user_id: 0,
  product_id: 0,
  variant_id: 0,
  quantity: 0,
  custom_design_url: '',
  custom_text: '',
  created_at: '',
  updated_at: ''
}
