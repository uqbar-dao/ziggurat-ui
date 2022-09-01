import React, { useCallback, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/addon/display/placeholder'
import Button from '../components/form/Button'
import Col from '../components/spacing/Col'
import Row from '../components/spacing/Row'
import useContractStore from '../store/contractStore';
import Input from '../components/form/Input';
import { MetadataForm } from '../components/forms/MetadataForm';
import LoadingOverlay from '../components/popups/LoadingOverlay';
import { METADATA_GRAIN_ID, MY_CONTRACT_ID } from '../utils/constants';

import './WelcomeView.scss'
import { numToUd } from '../utils/number';
import { addHexDots } from '../utils/format';
import Link from '../components/nav/Link';

type CreationStep = 'title' | 'project' | 'gall' | 'token' | 'template' | 'metadata'
type ProjectOption = 'contract' | 'gall' | 'contract-gall'
type TokenOption = 'fungible' | 'nft' | 'blank'
type TemplateOption = 'issue' | 'wrapper'
export interface CreationOptions {
  title?: string
  project?: ProjectOption
  token?: TokenOption
  template?: TemplateOption
  gall?: string
}

const WelcomeView = ({ hide = false }: { hide?: boolean }) => {
  const nav = useNavigate()
  
  return (
    <Col style={{ padding: 32 }}>
      <h3>Welcome to Ziggurat!</h3>
      <Link href="/new">+ Create a new project</Link>
    </Col>
  )
}

export default WelcomeView
