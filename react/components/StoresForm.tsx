import React, { useState, useEffect, useCallback } from 'react'
import { useQuery, useLazyQuery } from 'react-apollo'
import { Dropdown, Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { map, reduce, compose, find, propEq, prop } from 'ramda'
import { useOrderForm } from 'vtex.store-resources/OrderFormContext'
import GET_DOCUMENTS from './../queries/getDocuments.gql'
import { useRuntime } from 'vtex.render-runtime'
import { reduceFields, mappingOptions } from './../utils'
import styles from '../styles.css'

const CSS_HANDLES = [
  'StoresFormContainer',
  'StoresFormTitle',
  'StoresFormBackButton',
  'StoresFormNextButton',
]

interface StoresFormProps {
  setCurrentStep: Function
}

const StoresForm: StorefrontFunctionComponent<StoresFormProps> = ({
  setCurrentStep,
}) => {
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [store, setStore] = useState('')

  const orderFormContext = useOrderForm()
  const runtimeContext = useRuntime()

  const { data: stateOptions } = useQuery(GET_DOCUMENTS, {
    variables: {
      acronym: 'ST',
      where: 'isactivePickup=true',
      fields: ['Name'],
    },
  })

  const [getCities, { data: cityOptions }] = useLazyQuery(GET_DOCUMENTS)

  const [getStores, { data: storeOptions }] = useLazyQuery(GET_DOCUMENTS)

  const saveAddress = useCallback(() => {
    const citySelected = compose(
      reduce(reduceFields, {}),
      prop('fields'),
      find(propEq('id', city))
    )(cityOptions.documents)

    const stateSelected = compose(
      reduce(reduceFields, {}),
      prop('fields'),
      find(propEq('id', state))
    )(stateOptions.documents)

    const storeSelected = compose(
      reduce(reduceFields, {}),
      prop('fields'),
      find(propEq('id', store))
    )(storeOptions.documents)

    orderFormContext
      .updateOrderFormShipping({
        variables: {
          orderFormId: orderFormContext.orderForm.orderFormId,
          address: {
            addressId: undefined,
            addressType: 'search',
            postalCode: storeSelected.postalCode,
            geoCoordinates: [
              parseFloat(storeSelected.lon),
              parseFloat(storeSelected.lat),
            ],
            number: storeSelected.number,
            street: storeSelected.street,
            complement: storeSelected.name,
            receiverName: undefined,
            neighborhood: storeSelected.neighborhood,
            city: citySelected.Name,
            state: stateSelected.Name,
            country: 'COL',
          },
        },
      })
      .then(() => {
        const storeSelected = compose(
          reduce(reduceFields, {}),
          prop('fields'),
          find(propEq('id', store))
        )(storeOptions.documents)

        const sessionData = {
          public: {
            country: {
              value: 'COL',
            },
            geoCoordinates: {
              value: `${storeSelected.lon},${storeSelected.lat}`,
            },
          },
        }
        runtimeContext.patchSession(sessionData)
      })
      .then(() => {
        setCurrentStep([6])
      })
  }, [city, state, store])

  useEffect(() => {
    setStore('')
    setCity('')
    state &&
      getCities({
        variables: {
          acronym: 'SA',
          where: `State=${state} AND isactive=true`,
          fields: ['Name'],
        },
      })
  }, [state])

  useEffect(() => {
    setStore('')
    state &&
      getStores({
        variables: {
          acronym: 'WK',
          where: `city=${city} AND isactive=true`,
          fields: [
            'city',
            'lat',
            'lon',
            'name',
            'neighborhood',
            'number',
            'pickupId',
            'postalCode',
            'street',
          ],
        },
      })
  }, [city])

  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={`${handles.locationFormContainer} flex flex-column`}>
      <span className="center f4 pb3 fw6">Elige tu tienda más cercana</span>
      <div className="flex flex-row pt5">
        <div className={`w-50 pr4 ${styles.dropdownStoreForm}`}>
          <Dropdown
            value={state}
            onChange={(e: any) => setState(e.target.value)}
            placeholder="Departamento"
            options={
              (stateOptions && map(mappingOptions, stateOptions.documents)) ||
              []
            }
          />
        </div>
        <div className={`w-50 ${styles.dropdownStoreForm}`}>
          <Dropdown
            value={city}
            onChange={(e: any) => setCity(e.target.value)}
            placeholder="Ciudad"
            options={
              (cityOptions && map(mappingOptions, cityOptions.documents)) || []
            }
          />
        </div>
      </div>
      <div className="flex flex-row pt5">
        <div className={`w-100 ${styles.dropdownStoreForm} `}>
          <Dropdown
            value={store}
            onChange={(e: any) => setStore(e.target.value)}
            placeholder="Tienda"
            options={
              (storeOptions && map(mappingOptions, storeOptions.documents)) ||
              []
            }
          />
        </div>
      </div>
      <div className={`flex flex-row justify-center pt7 mb5`}>
        <div
          className={`${styles.buttonStyle} pr6 w-40 flex flex-row justify-center`}
        >
          <Button variation="primary" onClick={() => setCurrentStep([1])} block>
            Volver
          </Button>
        </div>
        <div
          className={`${styles.buttonStyle} pl6 w-40 flex flex-row justify-center`}
        >
          <Button variation="primary" onClick={() => saveAddress()} block>
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StoresForm
