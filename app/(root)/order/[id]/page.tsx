import { notFound } from 'next/navigation'

import OrderDetailsForm from './order-details-form'
import { auth } from '@/auth'
import { getOrderById } from '@/lib/actions/order.actions'
import { APP_NAME } from '@/lib/constants'

export const metadata = {
  title: ` - ${APP_NAME}`,
}

const OrderDetailsPage = async ({
  params: { id },
}: {
  params: {
    id: string
  }
}) => {
  const order = await getOrderById(id)
  if (!order) notFound()

  const session = await auth()
  return (
    <OrderDetailsForm
      order={order}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
    />
  )
}

export default OrderDetailsPage
