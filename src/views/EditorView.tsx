import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/addon/display/placeholder'
import Form from '../components/form/Form'
import Col from '../components/spacing/Col'
import Row from '../components/spacing/Row'
import { CodeMirrorShim, Editor } from '../components/editor/Editors'
import useContractStore from '../store/contractStore'
import { isMobileCheck } from '../utils/dimensions';

import './EditorView.scss'
import { OpenFileHeader } from '../components/nav/OpenFileHeader'

const EditorView = ({ hide = false }: { hide?: boolean }) => {
  const editorRef = useRef<CodeMirrorShim>()
  const nav = useNavigate()
  const { projectTitle, file } = useParams()
  const { projects, setProjectText } = useContractStore()

  const project = useMemo(() => projects[projectTitle || ''], [projectTitle, projects])
  const text = !file ? '' : file === projectTitle ? project?.main : project?.libs[file] || ''

  useEffect(() => {
    if (Object.keys(projects).length < 1 || !text) {
      nav ('/')
    }
  }, [projects, text, nav])

  const setText = useCallback((inputText: string) => {
    if (file && project?.title) {
      setProjectText(project.title, file, inputText)
    }
  }, [project, file, setProjectText])

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
