import React, { FC, useRef, useEffect } from 'react'
import { Input } from 'vtex.styleguide'
import { injectIntl } from 'react-intl'
import styles from '../styles.css'

interface ReactGoogleAutocompleteProps {
  value: string
  onChange: (e: any) => void
  onPlaceSelected: (address: string) => void
}

const ReactGoogleAutocomplete: FC<ReactGoogleAutocompleteProps> = ({
  value,
  onChange,
  onPlaceSelected,
}) => {
  const input = useRef<any>(null)

  let event: any = null
  let autocomplete: any = null

  const onSelected = () => {
    if (onPlaceSelected) {
      onPlaceSelected(autocomplete.getPlace())
    }
  }

  const disableAutofill = () => {
    if (window.MutationObserver) {
      const observerHack = new MutationObserver(() => {
        observerHack.disconnect()
        if (input.current) {
          input.current.autocomplete = 'disable-autofill'
        }
      })
      observerHack.observe(input.current, {
        attributes: true,
        attributeFilter: ['autocomplete'],
      })
    }
  }

  const setup = () => {
    disableAutofill()

    const defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(4.5709, -74.2973)
    )
    const options = {
      bounds: defaultBounds,
      componentRestrictions: { country: 'CO' },
    }

    autocomplete = new google.maps.places.Autocomplete(input.current, options)

    event = autocomplete.addListener('place_changed', onSelected)
  }

  useEffect(() => {
    setup()

    return () => {
      event && event.remove()
    }
  }, [])

  return (
    <div className={`${styles.inputAutocomple}`}>
      <Input
        ref={input}
        id="autocomplete"
        key="input"
        type="text"
        value={value}
        placeholder="Ejemplo: Calle 53 # 65 - 12"
        size="large"
        onChange={onChange}
      />
    </div>
  )
}

export default injectIntl(ReactGoogleAutocomplete)
