import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/addon/display/placeholder'
import Form from '../../components-zig/form/Form'
import Col from '../../components-zig/spacing/Col'
import Row from '../../components-zig/spacing/Row'
import { CodeMirrorShim, Editor } from '../../components-zig/editor/Editors'
import useProjectStore from '../store/projectStore'
import { isMobileCheck } from '../../utils/dimensions';

import './EditorView.scss'
import { OpenFileHeader } from '../../components-zig/nav/OpenFileHeader'
import { getFileText } from '../../utils/gall'

const EditorView = ({ hide = false }: { hide?: boolean }) => {
  const editorRef = useRef<CodeMirrorShim>()
  const nav = useNavigate()
  const { projectTitle, file } = useParams()
  const { contracts, gallApps, setProjectText, getGallFile } = useProjectStore()

  const contract = useMemo(() => contracts[projectTitle || ''], [projectTitle, contracts])
  const gallApp = useMemo(() => gallApps[projectTitle || ''], [projectTitle, gallApps])

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
    <Form className="editor-view" style={{ visibility: hide ? 'hidden' : 'visible', padding: 0, height: '100%', width: '100%', background: 'white', position: 'absolute' }}>
      <OpenFileHeader />
      <Row style={{ height: 'calc(100% - 28px)', width: 'calc(100% - 2px)' }}>
        <Col style={{ height: '100%', width: '100%', borderBottom: isMobile ? '1px solid lightgray' : undefined }}>
          <Editor
            editorRef={editorRef}
            text={text}
            setText={setText}
            isContract
          />
        </Col>
        {/* <Col style={{ height: isMobile ? 400 : '100%', width: isMobile ? '100%' : '40%' }}>
          <Iframe url={WEBTERM_PATH} height={isMobile? 400 : '100%'} width='100%' />
        </Col> */}
      </Row>
    </Form>
  )
}

export default EditorView

// import Iframe from 'react-iframe'
// import { Resizable, ResizeCallback } from 're-resizable'
// import create from 'zustand'
// import { persist } from 'zustand/middleware'
// const termUrl = '/apps/webterm'

// const windowSettings = create(persist((set, get) => ({
//   termRatio: .66
// }), {
//   name: 'ziggurat-settings'
// }))

// const Resizer = () => (
//   <div className='absolute right-0 top-0 px-2 -mr-2'>
//     <div className='flex items-center h-screen bg-gray-200'>
//       <SelectorIcon className='h-6 w-6 text-gray-800 rotate-90' />
//     </div>
//   </div>
// )
