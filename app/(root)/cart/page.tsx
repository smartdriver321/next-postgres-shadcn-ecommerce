import { getMyCart } from '@/lib/actions/cart.actions'
import CartForm from './cart-form'

export const metadata = {
  title: `Shopping Cart - ${process.env.NEXT_PUBLIC_APP_NAME}`,
}

const CartPage = async () => {
  const cart = await getMyCart()

  return <CartForm cart={cart} />
}

export default CartPage
