import React from 'react'
import './Footer.scss'
import Col from '../spacing/Col'
import Row from '../spacing/Row'

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {

}

const Footer : React.FC<FooterProps> = ({ children, ...rest }) => {
  return (
    <Col className='splash footer'>
      <h3>
        <Row>
          <span className='circled'>~</span>
          Powered by Urbit
        </Row>
      </h3>
      <Row>
      </Row>
    </Col>
  )
}

export default Footer