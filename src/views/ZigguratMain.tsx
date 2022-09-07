import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useZigguratStore from '../stores/zigguratStore';
import Container from '../components-zig/spacing/Container';
import Col from '../components-zig/spacing/Col';
import Row from '../components-zig/spacing/Row';
import { Sidebar } from '../components-zig/sidebar/Sidebar';
import LoadingOverlay from '../components-zig/popups/LoadingOverlay';
import EditorView from './ziggurat/EditorView';
import NewProjectView from './ziggurat/NewProjectView';
import AppView from './ziggurat/AppView';
import { TestView } from './ziggurat/TestView';
import { PUBLIC_URL } from '../utils/constants';
import WelcomeView from './ziggurat/WelcomeView';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ZigguratMain() {
  const { loading, init } = useZigguratStore()

  useEffect(() => {
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
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
              <Route path="/app/:app" element={<AppView />} />
              <Route path="/:projectTitle" element={<EditorView />} />
              <Route path="/:projectTitle/tests" element={<TestView />} />
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
      <LoadingOverlay loading={loading !== undefined} text={loading} />
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
