import React  from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/addon/display/placeholder'
import Col from '../../components-zig/spacing/Col'
import Link from '../../components-zig/nav/Link';

import './WelcomeView.scss'

const WelcomeView = ({ hide = false }: { hide?: boolean }) => {
  return (
    <Col style={{ padding: 32 }}>
      <h3>Welcome to Ziggurat!</h3>
      <Link href="/new">+ Create a new project</Link>
    </Col>
  )
}

export default WelcomeView
