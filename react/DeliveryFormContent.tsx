/* eslint-disable no-console */
import React, { useState } from 'react'
import DeliveryModeSelection from './components/DeliveryModeSelection'
import ClientInfoForm from './components/ClientInfoForm'
import LocationForm from './components/LocationForm'
import LoadingForm from './components/LoadingForm'
import AddressForm from './components/AddressForm'
import EmailHeader from './components/EmailHeader'
import StoreForm from './components/StoresForm'
import { useOrderForm } from 'vtex.store-resources/OrderFormContext'

import styles from './styles.css'

const DeliveryFormContent: StorefrontFunctionComponent<
  DeliveryFormContentProps
> = () => {
  const orderFormContext = useOrderForm()
  const [currentStep, setCurrentStep] = useState([1])
  const [email, setEmail] = useState(
    orderFormContext.orderForm.clientProfileData &&
      orderFormContext.orderForm.clientProfileData.email
      ? orderFormContext.orderForm.clientProfileData.email
      : ''
  )

  const getCurrenView = () => {
    return currentStep.map(step => {
      switch (step) {
        case 1:
          return (
            <DeliveryModeSelection
              setCurrentStep={setCurrentStep}
              currentStep={currentStep}
              email={email}
            />
          )

        case 2:
          return (
            <ClientInfoForm
              setCurrentStep={setCurrentStep}
              currentStep={currentStep}
              email={email}
              setEmail={setEmail}
            />
          )

        case 3:
          return <AddressForm setCurrentStep={setCurrentStep} email={email} />

        case 4:
          return <LocationForm setCurrentStep={setCurrentStep} />

        case 5:
          return <StoreForm setCurrentStep={setCurrentStep} />

        case 6:
          return <LoadingForm />
        default:
          return (
            <DeliveryModeSelection
              setCurrentStep={setCurrentStep}
              currentStep={currentStep}
              email={email}
            />
          )
      }
    })
  }

  return (
    <div className={`${styles.container} flex flex-column ph4`}>
      {currentStep[currentStep.length - 1] !== 6 &&
      currentStep[currentStep.length - 1] !== 2 ? (
        <EmailHeader setCurrentStep={setCurrentStep} email={email} />
      ) : (
        <div className={`${styles.header} flex items-center`}></div>
      )}
      {currentStep[currentStep.length - 1] <= 3 ||
      currentStep[currentStep.length - 1] == 5 ? (
        <div className="tc f3 pb3 fw6">
          Antes de continuar, elige cómo quieres recibir tu pedido
        </div>
      ) : (
        false
      )}
      {getCurrenView()}
    </div>
  )
}

export interface DeliveryFormContentProps {
  title?: string
}

DeliveryFormContent.schema = {
  title: 'editor.base-store-component.title',
  description: 'editor.base-store-component.description',
  type: 'object',
  properties: {
    title: {
      title: 'editor.base-store-component.title.title',
      description: 'editor.base-store-component.title.description',
      type: 'string',
      default: null,
    },
  },
}

export default DeliveryFormContent
