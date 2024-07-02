/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import { Button, RadioGroup } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { useOrderForm } from 'vtex.store-resources/OrderFormContext'
import { useRuntime } from 'vtex.render-runtime'
import axios from 'axios'

const CSS_HANDLES = [
  'addressFormContainer',
  'addressFormTitle',
  'addressFormSubtitle',
  'addressFormBackButton',
  'addressFormNextButton',
  'addressFormNewDirectionButton',
]

interface AddressFormInterface {
  setCurrentStep: Function
  email: string
}

const AddressForm: StorefrontFunctionComponent<AddressFormInterface> = ({
  setCurrentStep,
  email
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const orderFormContext = useOrderForm()

  const runtimeContext = useRuntime()
  const [addresSelected, setAddresSelected] = useState(0)
  const [orderForm, setOrderForm]: any = useState({})
  const [availableAddresses, setAvailableAddresses] = useState([])

  useEffect(() => {
    axios.get('/api/checkout/pub/orderForm').then(response => {
      setOrderForm(response.data)
    })
  }, [])

  const getFormattedAddress = ({ street, number, state, city }: any) => {
    let address = ''
    address += street ? `${street}` : ''
    address += number ? ` #${number}` : ''
    address += city ? `, ${city}` : ''
    address += state ? `, ${state}` : ''
    return address
  }

  useEffect(() => {
    if (orderForm.orderFormId) {
      if (
        orderForm &&
        orderForm.shippingData &&
        orderForm.shippingData.availableAddresses &&
        orderForm.shippingData.availableAddresses.length
      ) {
        let availableAddresses = orderForm.shippingData.availableAddresses.filter(
          (address: any) =>
            address.addressType !== 'search' && address.addressId
        )
        availableAddresses = availableAddresses.map(
          (address: any, index: any) => ({
            value: index,
            label: getFormattedAddress(address),
          })
        )

        setAvailableAddresses(availableAddresses)
      } else {
        setCurrentStep([4])
      }
    }
  }, [orderForm])

  const saveAddress = () => {
    const address = orderForm.shippingData.availableAddresses[addresSelected]

    axios
      .post(
        `/api/checkout/pub/orderForm/${orderFormContext.orderForm.orderFormId}/attachments/shippingData`,
        { selectedAddresses: [address] }
      )
      .then(() => {
        let sessionData

        if (address.geoCoordinates.length == 2) {
          sessionData = {
            public: {
              country: {
                value: 'COL',
              },
              geoCoordinates: {
                value: `${address.geoCoordinates[0]},${address.geoCoordinates[1]}`,
              },
            },
          }
        } else {
          sessionData = {
            public: {
              storeUserEmail: {
                value: email,
              },
              addressId: {
                value: address.addressId,
              },
            },
          }
        }
        runtimeContext.patchSession(sessionData)
      })
      .then(() => {
        setCurrentStep([6])
      })
  }

  return (
    <div className={`${handles.addressFormContainer} flex flex-column`}>
      <div>
        <p className="tc f4 pb3-l">Dirección de envío</p>
        <p className="f4 fw6">Elige dónde quieres que entreguemos tu pedido.</p>
      </div>
      <div className="flex flex-row pt3">
        <div className="w-100">
          <RadioGroup
            hideBorder
            name="addresses"
            options={availableAddresses}
            value={addresSelected}
            onChange={(e: any) =>
              setAddresSelected(parseInt(e.currentTarget.value))
            }
          />
          <div className={`flex flex-row justify-center pt7`}>
            <div
              className={`${handles.addressFormBackButton} pr5 w-100 flex flex-row justify-center`}
            >
              <div className={`${handles.addressFormNewDirectionButton}`}>
                <Button
                  onClick={() => setCurrentStep([4])}
                  variation="secondary"
                >
                  Agregar otra dirección
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex flex-row justify-center pt7 mb5`}>
        <div
          className={`${handles.addressFormBackButton} pr6 w-40 flex flex-row justify-center`}
        >
          <Button onClick={() => setCurrentStep([1])} block>
            Volver
          </Button>
        </div>
        <div
          className={`${handles.addressFormNextButton} pl6 w-40 flex flex-row justify-center`}
        >
          <Button onClick={() => saveAddress()} block>
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddressForm
