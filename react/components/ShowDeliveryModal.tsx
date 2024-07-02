/* eslint-disable no-console */
import React from 'react'
import { Button } from 'vtex.styleguide'

const ShowDeliveryModal: StorefrontFunctionComponent<any> = () => {
  return (
    <Button
      block
      // onClick={(e: any) => {
      //   e.preventDefault(), e.stopPropagation()
      // }}
    >
      Seleccionar dirección
    </Button>
  )
}

export default ShowDeliveryModal
