/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useState, useEffect, ReactElement } from 'react'
import { useQuery } from 'react-apollo'
import { Button, Spinner, Input } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { path } from 'ramda'
import { useOrderForm } from 'vtex.store-resources/OrderFormContext'
import { useRuntime } from 'vtex.render-runtime'
import { withScriptjs } from 'react-google-maps'
import Autocomplete from '../geolocation/Autocomplete'
import { getParsedAddress } from '../utils'
import logisticsQuery from '../queries/logistics.gql'
import Map from '../geolocation/Map'
import styles from '../styles.css'

const CSS_HANDLES = [
  'locationFormContainer',
  'locationFormTitle',
  'locationFormBackButton',
  'locationFormNextButton',
]

interface LocationFormProps {
  setCurrentStep: Function
}

interface LocationGoogleMapsForm {
  googleMapURL: string
  loadingElement: ReactElement
  address: string
  setAddress: any
  location: any
  setLocation: any
}

const LoadingSpinner = () => (
  <div className="flex flex-grow-1 justify-center items-center">
    <Spinner />
  </div>
)

const LocationForm: StorefrontFunctionComponent<LocationFormProps> = ({
  setCurrentStep,
}) => {
  const { data, loading } = useQuery(logisticsQuery)
  const [address, setAddress]: any = useState({})
  const [location, setLocation]: any = useState({
    lat: 4.6229993,
    lng: -74.0775938,
  })

  if (window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(({ coords }) => {
      setLocation({
        lat: coords.latitude,
        lng: coords.longitude,
      })
    })
  } else {
    console.warn("The user's browser does not support geolocation")
  }

  const [addressComplement, setAddressComplement]: any = useState('')

  const orderFormContext = useOrderForm()
  const runtimeContext = useRuntime()

  const saveAddress = () => {
    let finalAddress = address
    finalAddress.complement = addressComplement

    orderFormContext
      .updateOrderFormShipping({
        variables: {
          orderFormId: orderFormContext.orderForm.orderFormId,
          address: finalAddress,
        },
      })
      .then(() => {
        const sessionData = {
          public: {
            country: {
              value: 'COL',
            },
            geoCoordinates: {
              value: `${address.geoCoordinates[0]},${address.geoCoordinates[1]}`,
            },
          },
        }
        runtimeContext.patchSession(sessionData)
      })
      .then(() => {
        setCurrentStep([6])
      })
  }

  const handles = useCssHandles(CSS_HANDLES)

  if (loading) return LoadingSpinner()
  const googleMapURL = `https://maps.googleapis.com/maps/api/js?key=${data.logistics.googleMapsKey}&v=3.exp&libraries=places`

  return (
    <div className={`${handles.locationFormContainer} flex flex-column`}>
      <span className={`${handles.locationFormTitle} center f3 pb3 fw6`}>
        Agregar nueva dirección
      </span>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <LocationGoogleMapsForm
          googleMapURL={googleMapURL}
          loadingElement={LoadingSpinner()}
          address={address}
          setAddress={setAddress}
          location={location}
          setLocation={setLocation}
        />
      )}
      <div className="flex flex-row pt3">
        <div className="w-100">
          <p className="mt6 mb1">
            Información adicional (Interior, Apartamento, Edificio)
          </p>
          <div className={`${styles.inputAutocomple}`}>
            <Input
              key="input"
              id="autocomplete"
              type="text"
              value={addressComplement}
              placeholder="Ejemplo: Interior 2 - Casa 4 - Edificio La Alborada"
              size="large"
              onChange={(e: any) => {
                setAddressComplement(e.target.value)
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row pt3">
        <div className="w-100">
          <p className="mb3 mid-gray">
            Verifica que el punto rojo coincida con la dirección que deseas
            registrar.
          </p>
          <Map
            googleMapURL={googleMapURL}
            containerElement={<div style={{ height: '300px' }} />}
            mapElement={
              <div
                style={{
                  height: '100%',
                  border: `1px solid #333333`,
                  borderRadius: `5px`,
                }}
              />
            }
            loadingElement={LoadingSpinner()}
            location={location}
            setLocation={setLocation}
          />
        </div>
      </div>
      <div className={`flex flex-row justify-center pt7 mb5 pl3`}>
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
          <Button onClick={() => saveAddress()} block>
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  )
}

// @ts-ignore
const LocationGoogleMapsForm = withScriptjs<LocationGoogleMapsForm, any>(
  ({ setAddress, location, setLocation }: any) => {
    const [formattedAddress, setFormattedAddress] = useState('')
    const geocoder = new google.maps.Geocoder()

    useEffect(() => {
      geocoder.geocode({ location }, (places, status) => {
        if (status === 'OK') {
          if (places.length) {
            setFormattedAddress(places[0].formatted_address)
            const addressobj = getParsedAddress(places[0])
            setAddress(addressobj)
          }
        }
      })
    }, [location])

    const handleOnPlaceSelected = (place: any) => {
      setFormattedAddress(place.formattedAddress)
      const { lat, lng } = path(['geometry', 'location'], place) || {}
      const latitude = typeof lat === 'function' ? lat() : lat
      const longitude = typeof lng === 'function' ? lng() : lng

      setLocation({ lat: latitude, lng: longitude })
      const addressobj = getParsedAddress(place)

      setAddress(addressobj)
    }

    const handleAddressChanged = (e: any) => {
      setFormattedAddress(e.target.value)
      setAddress(null)
    }

    return (
      <div className="flex flex-row pt3">
        <div className="w-100">
          <p className="mt6 mb1">Dirección</p>
          <Autocomplete
            onPlaceSelected={handleOnPlaceSelected}
            value={formattedAddress || ''}
            onChange={handleAddressChanged}
          />
        </div>
      </div>
    )
  }
)

export default LocationForm
