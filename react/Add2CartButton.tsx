/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import ShowDeliveryModal from './components/ShowDeliveryModal'
import { Wrapper } from 'vtex.add-to-cart-button'
import { useOrderForm } from 'vtex.store-resources/OrderFormContext'

const add2CartButton: StorefrontFunctionComponent<any> = () => {
  const [deliveryModalNeedsAppear, setDeliveryVisibility] = useState(false)
  const orderFormContext = useOrderForm()

  useEffect(() => {
    if (
      orderFormContext.orderForm &&
      orderFormContext.orderForm.shippingData &&
      orderFormContext.orderForm.shippingData.availableAddresses &&
      orderFormContext.orderForm.shippingData.availableAddresses.length &&
      orderFormContext.orderForm.shippingData.address &&
      orderFormContext.orderForm.shippingData.address.geoCoordinates
    ) {
      setDeliveryVisibility(false)
    } else {
      setDeliveryVisibility(true)
    }
  }, [orderFormContext])

  return deliveryModalNeedsAppear ? <ShowDeliveryModal /> : <Wrapper />
}

export default add2CartButton
