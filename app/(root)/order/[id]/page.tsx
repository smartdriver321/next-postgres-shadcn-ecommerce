import { notFound } from 'next/navigation'

import OrderDetailsForm from './order-details-form'
import { getOrderById } from '@/lib/actions/order.actions'
import { auth } from '@/auth'

export const metadata = {
  title: 'Order Details',
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
  return <OrderDetailsForm order={order} />
}

export default OrderDetailsPage
