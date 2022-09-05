import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useProjectStore from './store/projectStore';
import Container from './components/spacing/Container';
import Col from './components/spacing/Col';
import Row from './components/spacing/Row';
import { Sidebar } from './components/sidebar/Sidebar';
import LoadingOverlay from './components/popups/LoadingOverlay';
import EditorView from './views/EditorView';
import NewProjectView from './views/NewProjectView';
import AppView from './views/AppView';
import { TestView } from './views/TestView';
import { PUBLIC_URL } from './utils/constants';
import WelcomeView from './views/WelcomeView';
import Modal from './components/popups/Modal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { loading, init } = useProjectStore()
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <BrowserRouter basename={PUBLIC_URL}>
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

export default App;
