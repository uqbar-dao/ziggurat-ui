import React, { useCallback, useState } from 'react'
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';
import { isMobileCheck } from '../../utils/dimensions'
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import useZigguratStore from '../../stores/zigguratStore';
import Button from '../../components/form/Button';
import { OpenFileHeader } from '../../components-zig/nav/OpenFileHeader';
import Text from '../../components/text/Text'

import './PyroView.scss'
import Link from '../../components-zig/nav/Link';

export interface PyroViewProps {}

export const PyroView = () => {
  const { projects, currentProject, endpoints, setLoading } = useZigguratStore()

  const isMobile = isMobileCheck()

  return (
    <Col className='pyro-view'>
      <Row className='breadcrumbs'>
        <FaArrowLeft />
        <div className='crumb'>pryo</div>
        <div className='crumb'>{'>'}</div>
        <div className='crumb'>~zod</div>
        <div className='crumb'>{'>'}</div>
        <div className='crumb'>app-state</div>
        {/* <div className='crumb'>{'>'}</div>
        <div className='crumb'>%wallet</div> */}
      </Row>
      <Col className='app-state'>
        <h4>Apps</h4>
        <Link href='/apps' className='app'>%wallet</Link>
        <Link href='/apps' className='app'>%indexer</Link>
        <Link href='/apps' className='app'>%groups</Link>
      </Col>
    </Col>
  )
}
