import { z } from 'zod'

import { InferSelectModel } from 'drizzle-orm'
import { carts, products } from '@/db/schema'
import { cartItemSchema } from '@/lib/validator'

// Products
export type Product = InferSelectModel<typeof products>

// Cart
export type Cart = InferSelectModel<typeof carts>
export type CartItem = z.infer<typeof cartItemSchema>
