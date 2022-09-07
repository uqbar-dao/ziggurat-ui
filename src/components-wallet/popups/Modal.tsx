import React, { MouseEvent, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import Text from '../text/Text'
import Col from '../spacing/Col'

import './Modal.scss'

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean
  hide: () => void
  hideClose?: boolean
  children: React.ReactNode,
  title: string,
}

const Modal: React.FC<ModalProps> = ({
  show,
  hide,
  hideClose = false,
  title,
  ...props
}) => {
  const dontHide = (e: MouseEvent) => {
    e.stopPropagation()
  }
 
  if (!show) {
    return null
  }

  return (
    <div className={`modal-backdrop ${show ? 'show' : ''}`} onClick={hide}>
      <Col {...props} className={`modal ${props.className || ''}`} onClick={dontHide}>
        <Text large className='modal-title'>{title}</Text>
        {!hideClose && (
          <FaPlus className='close' onClick={hide} />
        )}
        <Col className='modal-content' onClick={dontHide}>
          {props.children}
        </Col>
      </Col>
    </div>
  )
}

export default Modal
