/* eslint-disable no-console */
import React, { useCallback } from 'react'
import { Input, Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { useOrderForm } from 'vtex.store-resources/OrderFormContext'
import axios from 'axios'
import styles from '../styles.css'

const CSS_HANDLES = [
  'clientInfoContainer',
  'clientInfoTitle',
  'clientInfoSubtitle',
  'clientInfoBackButton',
  'clientInfoNextButton',
  'clientInfoInput',
]

interface ClientInfoFormProps {
  setCurrentStep: Function
  currentStep: number[]
  email: string
  setEmail: Function
}

const ClientInfoForm: StorefrontFunctionComponent<ClientInfoFormProps> = ({
  setCurrentStep,
  currentStep,
  email,
  setEmail,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const orderFormContext = useOrderForm()

  const saveEmail = useCallback(async () => {
    await orderFormContext
      .updateOrderFormProfile({
        variables: {
          orderFormId: orderFormContext.orderForm.orderFormId,
          fields: { email },
        },
      })
      .then(() => {
        axios.get('/api/checkout/pub/orderForm').then(response => {
          const orderForm = response.data
          if (
            orderForm.shippingData &&
            orderForm.shippingData.availableAddresses &&
            orderForm.shippingData.availableAddresses.length
          ) {
            setCurrentStep([currentStep[0], 3])
          } else {
            setCurrentStep([4])
          }
        })
      })
  }, [email])

  return (
    <div
      className={`${handles.clientInfoContainer} flex flex-column justify-center`}
    >
      <span className={`${handles.clientInfoTitle} center`}>
        Ingresa tu correo
      </span>
      <div
        className={`${handles.clientInfoInput} ${styles.clientInfoInput2} pt6`}
      >
        <Input
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
        />
      </div>
      <div className={`flex flex-row justify-center pt7 mb5`}>
        <div
          className={`${styles.buttonStyle} pr6 w-40 flex flex-row justify-center`}
        >
          <Button
            onClick={() => {
              setCurrentStep([1])
            }}
            block
          >
            Volver
          </Button>
        </div>
        <div
          className={`${styles.buttonStyle} pl6 w-40 flex flex-row justify-center`}
        >
          <Button onClick={() => saveEmail()} block>
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ClientInfoForm
