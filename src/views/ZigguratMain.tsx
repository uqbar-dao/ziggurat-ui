import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

import useZigguratStore from '../stores/zigguratStore';
import Container from '../components/spacing/Container';
import Col from '../components/spacing/Col';
import Row from '../components/spacing/Row';
import { Sidebar } from '../components-zig/sidebar/Sidebar';
import LoadingOverlay from '../components/popups/LoadingOverlay';
import EditorView from './ziggurat/EditorView';
import NewProjectView from './ziggurat/NewProjectView';
import AppView from './ziggurat/AppView';
import { ContractTestView } from './ziggurat/ContractTestView';
import { PUBLIC_URL } from '../utils/constants';
import WelcomeView from './ziggurat/WelcomeView';
import { ToastContainer } from 'react-toastify';
import { EndpointView } from './ziggurat/EndpointView';
import { PyroView } from './ziggurat/PyroView';
import ProjectView from './ziggurat/ProjectView';

function ZigguratMain() {
  const { loading, init, projects } = useZigguratStore()

  const promptIfUnsavedFiles = (ev: BeforeUnloadEvent) => {
    ev.preventDefault()
    return ev.returnValue = 'Are you sure you want to exit? Unsaved changes will be lost.' // this message is ignored by the browser
  }

  useEffect(() => {
    window.removeEventListener('beforeunload', promptIfUnsavedFiles)
    if (Object.keys(projects).find(k => projects[k]?.modifiedFiles.size > 0)) {
      window.addEventListener('beforeunload', promptIfUnsavedFiles)
    }
  }, [projects, loading])

  useEffect(() => {
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container className='h-screen p0'>
      <BrowserRouter basename={`${PUBLIC_URL}/develop`}>
      <Col style={{ width: '100%', height: '100%' }}>
        <Row style={{ height: '100%', width: '100%' }}>
          <Col style={{ height: '100%', width: '20%', maxWidth: 240, minWidth: 210 }}>
            <Sidebar />
          </Col>
          <Col style={{ minWidth: 'calc(100% - 240px)', width: '80%', maxWidth: 'calc(100% - 210px)', height: '100%', position: 'relative' }}>
            <Routes>
              <Route path="/" element={<WelcomeView />} />
              <Route path="/new" element={<NewProjectView />} />
              <Route path="/app" element={<AppView />} />
              <Route path="/pyro" element={<PyroView />} />

              <Route path="/pyro/:ship" element={<EndpointView />} />
              <Route path="/pyro/:ship/apps" element={<EndpointView />} />
              <Route path="/pyro/:ship/apps/:app" element={<EndpointView />} />
              <Route path="/pyro/:ship/endpoints" element={<EndpointView />} />
              <Route path="/pyro/:ship/chain-state" element={<EndpointView />} />

              <Route path="/app/:app" element={<AppView />} />
              <Route path="/:projectTitle" element={<ProjectView />} />
              <Route path="/:projectTitle/contract-tests" element={<ContractTestView />} />
              <Route path="/:projectTitle/:file" element={<EditorView />} />
              <Route
                path="*"
                element={
                  <main style={{ padding: "1rem" }}>
                    <p>There's nothing here!</p>
                  </main>
                }
              />
            </Routes>
          </Col>
        </Row>
      </Col>
      </BrowserRouter>
      <LoadingOverlay loading={!!loading} text={loading} />
      <ToastContainer
        autoClose={false}
        hideProgressBar
        closeOnClick
        rtl={false}
        draggable
        theme='colored'
        style={{ fontSize: 14 }}
      />
    </Container>
  );
}

export default ZigguratMain;
