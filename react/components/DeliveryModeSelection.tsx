import React from 'react'
import { ButtonPlain } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { Image } from 'vtex.store-image'
import styles from '../styles.css'

const CSS_HANDLES = [
  'selectionContainer',
  'deliverySelectionContainer',
  'pickUpSelectionContainer',
  'titleSelection',
  'paragraphSelection',
  'imgShipping',
  'containerImage',
]

interface DeliveryModeSelectionProps {
  setCurrentStep: Function
  currentStep: number[]
  email: string
}

const DeliveryModeSelection: StorefrontFunctionComponent<
  DeliveryModeSelectionProps
> = ({ setCurrentStep, currentStep, email }) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={`${handles.selectionContainer} flex flex-row`}>
      <div
        className={`${handles.deliverySelectionContainer} ba flex flex-column pa6 mr4`}
      >
        <div
          className={`${styles.ButtonPlain} ${
            currentStep[1] == 5 ? styles.opacityImage : ''
          }`}
        >
          <ButtonPlain
            onClick={() => {
              !email ? setCurrentStep([1, 2]) : setCurrentStep([1, 3])
            }}
            noWrap
          >
            <div className={`${handles.containerImage} `}>
              <Image
                alt="entrega domicilio"
                src="/arquivos/entrega_domicilio_active_gris.png"
              />
            </div>
            <p>
              Entrega a <br /> domicilio
            </p>
          </ButtonPlain>
        </div>
      </div>
      <div
        className={`${handles.pickUpSelectionContainer} ba flex flex-column pa6`}
      >
        <div
          className={`${styles.ButtonPlain} ${
            currentStep[1] == 3 || currentStep[1] == 2
              ? styles.opacityImage
              : ''
          }`}
        >
          <ButtonPlain onClick={() => setCurrentStep([1, 5])} noWrap>
            <div className={`${handles.containerImage} `}>
              <Image
                alt="recoger en tienda"
                src="/arquivos/recoger_tienda_active_gris.png"
              />
            </div>
            <p>
              Recoger <br /> en tienda
            </p>
          </ButtonPlain>
        </div>
      </div>
    </div>
  )
}

export default DeliveryModeSelection
