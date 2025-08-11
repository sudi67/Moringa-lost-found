import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

export const sql = neon(process.env.DATABASE_URL)

// Database types
export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  country: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  description?: string
  slug: string
  created_at: string
}

export interface Product {
  id: number
  category_id: number
  name: string
  description?: string
  base_price: number
  image_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: number
  product_id: number
  size?: string
  color?: string
  color_hex?: string
  price_modifier: number
  stock_quantity: number
  sku?: string
  created_at: string
}

export interface Order {
  id: number
  user_id?: number
  order_number: string
  status: string
  subtotal: number
  tax_amount: number
  shipping_amount: number
  total_amount: number
  shipping_address?: string
  billing_address?: string
  payment_status: string
  payment_method?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  variant_id?: number
  quantity: number
  unit_price: number
  total_price: number
  custom_design_url?: string
  custom_text?: string
  created_at: string
}

export interface PortfolioItem {
  id: number
  title: string
  description?: string
  category?: string
  subcategory?: string
  image_url?: string
  is_featured: boolean
  created_at: string
}

export interface ContactSubmission {
  id: number
  name: string
  email: string
  phone?: string
  service?: string
  message: string
  status: string
  created_at: string
}

export interface CartItem {
  id: number
  user_id: number
  product_id: number
  variant_id?: number
  quantity: number
  custom_design_url?: string
  custom_text?: string
  created_at: string
  updated_at: string
}
