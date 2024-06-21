import { Metadata } from 'next'

import ProductList from '@/components/shared/product/product-list'
import { getLatestProducts } from '@/lib/actions/product.actions'
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `${APP_NAME} - ${APP_DESCRIPTION}`,
}

const Home = async () => {
  const latestProducts = await getLatestProducts()

  return (
    <div>
      <ProductList title='Newest Arrivals' data={latestProducts} />
    </div>
  )
}

export default Home
