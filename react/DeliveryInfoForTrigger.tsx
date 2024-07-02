/* eslint-disable no-console */
import React, { useState } from 'react'
import { Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { useOrderForm } from 'vtex.store-resources/OrderFormContext'
import { Image } from 'vtex.store-image'
import styles from './styles.css'

const CSS_HANDLES = ['deliveryInfoChangeButton', 'titleSelectMethod']

const DeliveryInfoForTrigger: StorefrontFunctionComponent<{}> = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const orderFormContext = useOrderForm()
  const [deliveryType, setDeliveryType] = useState('delivery')
  let formattedAddress

  const getFormattedAddress = ({
    street,
    number,
    state,
    city,
    complement,
  }: any) => {
    if (deliveryType == 'delivery') {
      let address = ''
      address += street ? `${street}` : ''
      address += number ? ` #${number}` : ''
      address += city ? `, ${city}` : ''
      address += state ? `, ${state}` : ''
      return address
    } else {
      return complement
    }
  }

  if (
    orderFormContext.orderForm.shippingData &&
    orderFormContext.orderForm.shippingData.address &&
    orderFormContext.orderForm.shippingData.address.addressType &&
    orderFormContext.orderForm.shippingData.address.addressType == 'search' &&
    deliveryType == 'delivery'
  ) {
    setDeliveryType('Recogida')
  }

  if (
    orderFormContext.orderForm.shippingData &&
    orderFormContext.orderForm.shippingData.address &&
    orderFormContext.orderForm.shippingData.address.geoCoordinates
  ) {
    formattedAddress = getFormattedAddress(
      orderFormContext.orderForm.shippingData.address
    )
  } else {
    return (
      <div className="flex flex-row h-100 ml4-l">
        <div className="flex justify-center items-center">
          <div className={`${styles.iconTrigger}`}>
            <Image alt="método de entrega" src="/arquivos/delivery_icon.png" />
          </div>
          <p className="ml4">Método de entrega:</p>
        </div>
        <p
          className={`${handles.titleSelectMethod} flex justify-center items-center fw6 ml5 underline`}
        >
          Selecciona el método de entrega de tu preferencia
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-row h-100 ml5">
      {deliveryType == 'delivery' ? (
        <>
          <div className="flex justify-center items-center">
            <div className={`${styles.iconTrigger}`}>
              <Image
                alt="método de entrega"
                src="/arquivos/delivery_icon.png"
              />
            </div>
            <p className="ml4">Método de entrega:</p>
          </div>
          <div className="flex justify-center items-center fw6 ml5">
            Envío a domicilio - {formattedAddress}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center items-center">
            <div className={`${styles.iconTrigger}`}>
              <Image alt="método de entrega" src="/arquivos/delivery_icon.png" />
            </div>
            <p className="ml4">Método de entrega: </p>
          </div>
          <div className="flex justify-center items-center fw6 ml5">
            Recoger en tienda - {formattedAddress}
          </div>
        </>
      )}
      <div
        className={`${handles.deliveryInfoChangeButton} flex justify-center items-center ml5 mr2`}
      >
        <Button variation="secondary">Cambiar</Button>
      </div>
    </div>
  )
}

export default DeliveryInfoForTrigger
