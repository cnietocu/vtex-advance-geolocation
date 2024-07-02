/* eslint-disable no-console */
import React from 'react'
import { ButtonPlain } from 'vtex.styleguide'

import styles from '../styles.css'

interface EmailHeaderProps {
  setCurrentStep: Function
  email: string
}

const EmailHeader: StorefrontFunctionComponent<EmailHeaderProps> = ({
  setCurrentStep,
  email,
}) => {
  return email ? (
    <div className={`${styles.header} flex items-center`}>
      <p className="f5 mr6 mw5 truncate lh-copy">{email}</p>
      <div className={`${styles.buttonChangeEmail} `}>
        <ButtonPlain
          onClick={() => {
            setCurrentStep([1, 2])
          }}
        >
          Cambiar correo
        </ButtonPlain>
      </div>
    </div>
  ) : (
    <div className={`${styles.header} flex items-center`}></div>
  )
}

export default EmailHeader
