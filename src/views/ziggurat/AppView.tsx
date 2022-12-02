import React from 'react'
import Iframe from 'react-iframe';
import { useLocation, useNavigate } from 'react-router-dom';
import { OpenFileHeader } from '../../components-zig/nav/OpenFileHeader';
import Col from '../../components/spacing/Col';
import Container from '../../components/spacing/Container'
import useZigguratStore from '../../stores/zigguratStore';

import './DocsView.scss'

const AppView = ({ hide = false }: { hide?: boolean }) => {
  const nav = useNavigate()
  const { pathname } = useLocation()
  const { openTools, currentTool } = useZigguratStore()

  if (!currentTool && pathname === 'app') {
    nav('/')
    return null
  }

  return (<>
    <OpenFileHeader />
    <Container className='docs-view' style={{ visibility: hide ? 'hidden' : 'visible', position: hide ? 'absolute' : 'relative', margin: '-1em 2em 1em -2em', height: '100%' }}>
      {openTools.map(app => (
        <Col key={app} style={{ position: 'absolute', visibility: app === currentTool ? 'visible' : 'hidden', width: '100%', height: '100%' }}>
          <Iframe url={`/apps/${app}`} height='100%' width='100%' />
        </Col>
      ))}
    </Container>
  </>)
}

export default AppView

// export function App() {
//   // const [firstRender, setFirstRender] = useState(false);
//   const windowRef = useRef<HTMLElement>(null);
//   const { termRatio } = windowSettings();
//   const [oldWidth, setOldWidth] = useState(termRatio * window.innerWidth);
//   const [currentWidth, setCurrentWidth] = useState(termRatio * window.innerWidth);
//   const [height, setHeight] = useState(window.innerHeight);
//   const docsWidth = window.innerWidth - currentWidth;
//   const strHeight = `${height}px`;
//   const minWidth = Math.max(window.innerWidth * .33, 400)
//   const maxWidth = Math.max(window.innerWidth - 400, window.innerWidth * .75);

//   const windowResize = useCallback(() => {
//     setHeight(window.innerHeight);
//     setCurrentWidth(termRatio * window.innerWidth);
//   }, [termRatio])

//   useEffect(() => {
//     window.addEventListener('resize', windowResize)

//     return () => {
//       window.removeEventListener('resize', windowResize);
//     }
//   }, [windowResize])

//   const onResize: ResizeCallback = (event, dir, ref, delta) => {
//     const newWidth = oldWidth + delta.width;
//     setCurrentWidth(newWidth);
//     windowSettings.setState({ termRatio: newWidth / window.innerWidth });
//   };

//   return (
//     <main ref={windowRef} className="flex">
//       <Resizable
//         size={{
//           height, 
//           width: currentWidth
//         }}
//         minWidth={minWidth}
//         maxWidth={maxWidth}
//         enable={{ right: true }}
//         handleComponent={{ right: Resizer() }}
//         onResizeStart={() => setOldWidth(currentWidth)}
//         onResize={onResize}
//       >
//         <div className='w-full h-full border-r border-gray-500'>
//           <Iframe url={termUrl} width="100%" height="100%" />
//         </div>
//       </Resizable>
//       <Iframe url={docsUrl} height={strHeight} width={`${docsWidth}px`} />
//     </main>
//   );
// }
