import React from 'react'
import { Image } from 'vtex.store-image'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'loadingFormContainer',
  'loadingFormTitle',
  'loadingFormSubtitle',
  'loadingFormWaitingMessage',
  'confirmPreferences',
  'containerImageLoadingForm',
]

const LoadingForm: StorefrontFunctionComponent<{}> = () => {
  const handles = useCssHandles(CSS_HANDLES)
  setTimeout(() => {
    location.reload()
  }, 3000)
  return (
    <div
      className={`${handles.loadingFormContainer} flex flex-column justify-center mb5`}
    >
      <div className={`${handles.containerImageLoadingForm}`}>
        <Image
          alt="Preferencias de entrega"
          src="/arquivos/confirm_preferences_gris.png"
        />
      </div>
      <span className={`${handles.loadingFormTitle} center`}>
        ¡Hemos guardado tus preferencias de entrega!
      </span>
    </div>
  )
}

export default LoadingForm
