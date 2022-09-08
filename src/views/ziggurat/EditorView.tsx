import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Resizable } from 're-resizable'
import Iframe from 'react-iframe'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/addon/display/placeholder'
import useZigguratStore from '../../stores/zigguratStore'
import Form from '../../components/form/Form'
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import { CodeMirrorShim, Editor } from '../../components-zig/editor/Editors'
import { OpenFileHeader } from '../../components-zig/nav/OpenFileHeader'
import { isMobileCheck } from '../../utils/dimensions';
import { getFileText } from '../../utils/gall'
import { WEBTERM_PATH } from '../../utils/constants'

import './EditorView.scss'

const EditorView = ({ hide = false }: { hide?: boolean }) => {
  const editorRef = useRef<CodeMirrorShim>()
  const nav = useNavigate()
  const { projectTitle, file } = useParams()
  const { contracts, gallApps, setProjectText, getGallFile } = useZigguratStore()

  const contract = useMemo(() => contracts[projectTitle || ''], [projectTitle, contracts])
  const gallApp = useMemo(() => gallApps[projectTitle || ''], [projectTitle, gallApps])
  const isGall = useMemo(() => Boolean(gallApp), [gallApp])

  useEffect(() => {
    if (gallApp && file && projectTitle) {
      getGallFile(projectTitle, decodeURIComponent(file))
    }
  }, [gallApp, projectTitle, file, getGallFile])

  const text = !file ? '' :
    gallApp ? getFileText(gallApp.folder, decodeURIComponent(file).split('/').slice(1), decodeURIComponent(file)) || '' :
    file === projectTitle ? contract?.main : contract?.libs[file] || ''

  useEffect(() => {
    if ((Object.keys(contracts).length < 1 && Object.keys(gallApps).length < 0 )) {
      nav ('/')
    }
  }, [contracts, contract, gallApps, gallApp, text, nav])

  const setText = useCallback((inputText: string) => {
    if (file && (contract?.title || gallApp?.title)) {
      setProjectText(contract?.title || gallApp?.title, file, inputText)
    }
  }, [contract, gallApp, file, setProjectText])

  const isMobile = isMobileCheck()

  return (
    <>
    <OpenFileHeader />
    <Form className='editor-view' style={{ visibility: hide ? 'hidden' : 'visible' }}>
      <Row style={{ height: '100%', width: 'calc(100% - 2px)' }}>
        <Col style={{ height: '100%', width: '100%', borderBottom: isMobile ? '1px solid lightgray' : undefined }}>
          <Editor
            editorRef={editorRef}
            text={text}
            setText={setText}
            isContract
            />
        </Col>
        {isGall && <Resizable defaultSize={{ width:320, height:200 }}>
          <Iframe url={WEBTERM_PATH} height='100%' width='100%' />
        </Resizable>}
      </Row>
    </Form>
    </>
  )
}

export default EditorView
