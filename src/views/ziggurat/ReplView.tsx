import classNames from 'classnames'
import { useMemo, useState } from 'react'
import { FaChevronDown, FaChevronRight, FaPlay, FaPlus, FaRegEye, FaRegHandPointer, FaRegTrashAlt } from 'react-icons/fa'
import Card from '../../components-indexer/card/Card'
import Checkbox from '../../components-zig/forms/Checkbox'
import { OpenFileHeader } from '../../components-zig/nav/OpenFileHeader'
import Button from '../../components/form/Button'
import Input from '../../components/form/Input'
import Dropdown from '../../components/popups/Dropdown'
import Col from '../../components/spacing/Col'
import Container from '../../components/spacing/Container'
import Divider from '../../components/spacing/Divider'
import Entry from '../../components/spacing/Entry'
import Field from '../../components/spacing/Field'
import Row from '../../components/spacing/Row'
import Json from '../../components/text/Json'
import TestStepRow from '../../components-zig/tests/TestStepRow'
import Text from '../../components/text/Text'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import useZigguratStore from '../../stores/zigguratStore'
import { Tab, Poke as RPoke, Scry as RScry, Test as RTest, Event as REvent, Ship as RShip, TestReadStep, TestWriteStep, TestStep, TestWaitStep, TestReadSubscriptionStep, StringTestStep, TestDbugStep, TestScryStep, TestDojoStep, TestCustomReadStep, TestPokeStep, TestSubscribeStep, TestCustomWriteStep } from '../../types/ziggurat/Repl'

import './ReplView.scss'


const ReplView = () => {
  const { zigguratTitleBase, tests, setTests, ships, setShips, views, setViews, pokes, setPokes, scries, setScries, events, setEvents, projects, currentProject } = useZigguratStore()

  const [tabs, setTabs] = useState<Tab[]>([
    { name: 'state', active: true },
    { name: 'events', active: false },
    { name: 'dojo', active: false},
    { name: 'tests', active: false},
  ])

  if (!ships.length) setShips([
    { name: '~bus',
      active: true,
      expanded: true,
      apps: { myapp: { herp: 'derp' },
              bubba: { dubba: 'gubba', lubba: 'slubba' },
              beebo: { neebo: [7, 3, 3, 8, 0] } } },
    { name: '~dozzod-dozzod-dozzod-dozzod',
      active: false,
      expanded: true,
      apps: { myapp: { herp: 'burp' },
              bubba: { dubba: 'gubba', lubba: 'slubba' },
              beebo: { neebo: [7, 3, 3, 8, 0] } } },
    { name: '~molten-martyr',
      active: false,
      expanded: true,
      apps: { myapp: { herp: 'slurp' },
              bubba: { dubba: 'gubba', lubba: 'slubba' },
              beebo: { neebo: [7, 3, 3, 8, 0] } } }])

  if (!views.length) setViews([
    { name: 'floopus', active: true },
    { name: 'doopus', active: true },
    { name: 'gloopus', active: true },
    { name: 'a really long one for some reason', active: false }])

  if (!pokes.length) setPokes([
    { app: 'myapp', ship: '~nec', data: "{ 'add-herp': 'burp' }" },
    { app: 'myapp', ship: '~bus', data: "{ 'add-herp': 'derp' }" },
    { app: 'myapp', ship: '~luc', data: "{ 'add-herp': 'gurp' }" },
  ])

  if (!scries.length) setScries([
    { ship: '~nec', data: '%gx /beep/jeep/deep/sleep' },
    { ship: '~luc', data: '%cx /gup/dup/lup/pup' },
    { ship: '~bus', data: '%ax /oop/doop/sloop' },
  ])

  if (!events.length) setEvents([
    { source: 'behn', type: 'timer', data: '/chocobo' },
    { source: '~nec', type: 'poke', data: '[%derp-action [%add-derp "herp"]' },
    { source: '~bus', type: 'poke', data: '[%derp-action [%mod-derp [[%id 5] [%derp "gurp nurp"]]]]' },
    { source: 'behn', type: 'timer', data: '/kokomo' },
    { source: '~luc', type: 'poke', data: '[%derp-action [%del-derp "slurp"]]' },
    { source: 'behn', type: 'timer', data: '/bonobo' },
    { source: '~zod', type: 'poke', data: '[%derp-action [%add-derp "burp"]]' },
    { source: 'behn', type: 'timer', data: '/chocobo' },
    { source: '~nec', type: 'poke', data: '[%derp-action [%add-derp "herp"]' },
    { source: '~bus', type: 'poke', data: '[%derp-action [%mod-derp [[%id 5] [%derp "gurp nurp"]]]]' },
    { source: 'behn', type: 'timer', data: '/kokomo' },
    { source: '~luc', type: 'poke', data: '[%derp-action [%del-derp "slurp"]]' },
    { source: 'behn', type: 'timer', data: '/bonobo' },
    { source: '~zod', type: 'poke', data: '[%derp-action [%add-derp "burp"]]' },
    { source: 'behn', type: 'timer', data: '/chocobo' },
    { source: '~nec', type: 'poke', data: '[%derp-action [%add-derp "herp"]' },
    { source: '~bus', type: 'poke', data: '[%derp-action [%mod-derp [[%id 5] [%derp "gurp nurp"]]]]' },
    { source: 'behn', type: 'timer', data: '/kokomo' },
    { source: '~luc', type: 'poke', data: '[%derp-action [%del-derp "slurp"]]' },
    { source: 'behn', type: 'timer', data: '/bonobo' },
    { source: '~zod', type: 'poke', data: '[%derp-action [%add-derp "burp"]]' },
    { source: 'behn', type: 'timer', data: '/chocobo' },
    { source: '~nec', type: 'poke', data: '[%derp-action [%add-derp "herp"]' },
    { source: '~bus', type: 'poke', data: '[%derp-action [%mod-derp [[%id 5] [%derp "gurp nurp"]]]]' },
    { source: 'behn', type: 'timer', data: '/kokomo' },
    { source: '~luc', type: 'poke', data: '[%derp-action [%del-derp "slurp"]]' },
    { source: 'behn', type: 'timer', data: '/bonobo' },
    { source: '~zod', type: 'poke', data: '[%derp-action [%add-derp "burp"]]' },
    { source: 'behn', type: 'timer', data: '/chocobo' },
    { source: '~nec', type: 'poke', data: '[%derp-action [%add-derp "herp"]' },
    { source: '~bus', type: 'poke', data: '[%derp-action [%mod-derp [[%id 5] [%derp "gurp nurp"]]]]' },
    { source: 'behn', type: 'timer', data: '/kokomo' },
    { source: '~luc', type: 'poke', data: '[%derp-action [%del-derp "slurp"]]' },
    { source: 'behn', type: 'timer', data: '/bonobo' },
    { source: '~zod', type: 'poke', data: '[%derp-action [%add-derp "burp"]]' },
    { source: 'behn', type: 'timer', data: '/chocobo' },
    { source: '~nec', type: 'poke', data: '[%derp-action [%add-derp "herp"]' },
    { source: '~bus', type: 'poke', data: '[%derp-action [%mod-derp [[%id 5] [%derp "gurp nurp"]]]]' },
    { source: 'behn', type: 'timer', data: '/kokomo' },
    { source: '~luc', type: 'poke', data: '[%derp-action [%del-derp "slurp"]]' },
    { source: 'behn', type: 'timer', data: '/bonobo' },
    { source: '~zod', type: 'poke', data: '[%derp-action [%add-derp "burp"]]' },
    { source: 'behn', type: 'timer', data: '/chocobo' },
    { source: '~nec', type: 'poke', data: '[%derp-action [%add-derp "herp"]' },
    { source: '~bus', type: 'poke', data: '[%derp-action [%mod-derp [[%id 5] [%derp "gurp nurp"]]]]' },
    { source: 'behn', type: 'timer', data: '/kokomo' },
    { source: '~luc', type: 'poke', data: '[%derp-action [%del-derp "slurp"]]' },
    { source: 'behn', type: 'timer', data: '/bonobo' },
    { source: '~zod', type: 'poke', data: '[%derp-action [%add-derp "burp"]]' },
    { source: 'behn', type: 'timer', data: '/chocobo' },
    { source: '~nec', type: 'poke', data: '[%derp-action [%add-derp "herp"]' },
    { source: '~bus', type: 'poke', data: '[%derp-action [%mod-derp [[%id 5] [%derp "gurp nurp"]]]]' },
    { source: 'behn', type: 'timer', data: '/kokomo' },
    { source: '~luc', type: 'poke', data: '[%derp-action [%del-derp "slurp"]]' },
    { source: 'behn', type: 'timer', data: '/bonobo' },
    { source: '~zod', type: 'poke', data: '[%derp-action [%add-derp "burp"]]' },
    { source: 'behn', type: 'timer', data: '/chocobo' },
    { source: '~nec', type: 'poke', data: '[%derp-action [%add-derp "herp"]' },
    { source: '~bus', type: 'poke', data: '[%derp-action [%mod-derp [[%id 5] [%derp "gurp nurp"]]]]' },
    { source: 'behn', type: 'timer', data: '/kokomo' },
    { source: '~luc', type: 'poke', data: '[%derp-action [%del-derp "slurp"]]' },
    { source: 'behn', type: 'timer', data: '/bonobo' },
    { source: '~zod', type: 'poke', data: '[%derp-action [%add-derp "burp"]]' },
    { source: 'behn', type: 'timer', data: '/chocobo' },
    { source: '~nec', type: 'poke', data: '[%derp-action [%add-derp "herp"]' },
    { source: '~bus', type: 'poke', data: '[%derp-action [%mod-derp [[%id 5] [%derp "gurp nurp"]]]]' },
    { source: 'behn', type: 'timer', data: '/kokomo' },
    { source: '~luc', type: 'poke', data: '[%derp-action [%del-derp "slurp"]]' },
    { source: 'behn', type: 'timer', data: '/bonobo' },
    { source: '~zod', type: 'poke', data: '[%derp-action [%add-derp "burp"]]' },
    { source: 'behn', type: 'timer', data: '/chocobo' },
    { source: '~nec', type: 'poke', data: '[%derp-action [%add-derp "herp"]' },
    { source: '~bus', type: 'poke', data: '[%derp-action [%mod-derp [[%id 5] [%derp "gurp nurp"]]]]' },
    { source: 'behn', type: 'timer', data: '/kokomo' },
    { source: '~luc', type: 'poke', data: '[%derp-action [%del-derp "slurp"]]' },
    { source: 'behn', type: 'timer', data: '/bonobo' },
    { source: '~zod', type: 'poke', data: '[%derp-action [%add-derp "burp"]]' },
    { source: 'behn', type: 'timer', data: '/chocobo' },
    { source: '~nec', type: 'poke', data: '[%derp-action [%add-derp "herp"]' },
    { source: '~bus', type: 'poke', data: '[%derp-action [%mod-derp [[%id 5] [%derp "gurp nurp"]]]]' },
    { source: 'behn', type: 'timer', data: '/kokomo' },
    { source: '~luc', type: 'poke', data: '[%derp-action [%del-derp "slurp"]]' },
    { source: 'behn', type: 'timer', data: '/bonobo' },
    { source: '~zod', type: 'poke', data: '[%derp-action [%add-derp "burp"]]' },
  ])

  if (!tests.length) setTests([
    {
      name: 'me test',
      imports: [
        { face: 'moop', path: '/lib/moop/hoon' }, 
        { face: 'doop', path: '/lib/doop/hoon'}
      ],
      steps: [
        { // TestPokeStep
          payload: {
            who: '~bus',
            to: '~molten-martyr',
            app: 'my-app',
            mark: 'my-app-update',
            payload: '[%more-beeves %please]'
          },
          expected: [{ // TestScryStep
            payload: { 
              who: '~bus', 
              'mold-name': '@ud', 
              care: 'gx', 
              app: 'my-app', 
              path: 'beeves-count' 
            },
            expected: '6'
          }]
        },
        { // TestWaitStep
          until: 30
        },
        { // TestScryStep
          payload: { 
            who: '~bus', 
            'mold-name': '@ud', 
            care: 'gx', 
            app: 'my-app', 
            path: 'beeves-count' 
          },
          expected: '6'
        },
      ]
    }
  ])

  const blankShip = { name: '', apps: {}, expanded: true, active: false }
  const blankPoke = { ship: '', data: '' }
  const blankScry = { ship: '', data: '', app: '' }
  const [query, setQuery] = useState<string>('')
  const [newScry, setNewScry] = useState<RScry>(blankPoke)
  const [newPoke, setNewPoke] = useState<RPoke>(blankScry)
  const [newShip, setNewShip] = useState<RShip>(blankShip)
  const [newFace, setNewFace] = useState<string>('')
  const [newPath, setNewPath] = useState<string>('')
  const [newTest, setNewTest] = useState<string>('')

  const togglePokeExpanded = (poke: RPoke, key: 'expanded' | 'expandedApps' | 'expandedShips') => {
    setPokes(pokes.map(p => ({ 
      ...p, 
      [key]: samePoke(p, poke) ? !p[key] : p[key] })))
  }
  const toggleScryExpanded = (scry: RScry, key: 'expanded' | 'expandedShips') => {
    setScries(scries.map(p => ({ 
      ...p, 
      [key]: sameScry(p, scry) ? !p[key] : p[key] })))
  }

  const samePoke = (p: RPoke, poke: RPoke) => (p.ship === poke.ship && p.app === poke.app && p.data === poke.data)
  const sameScry = (s: RScry, scry: RScry) => (s.ship === scry.ship && s.data === scry.data)

  const addView = (query: string) => {
    if (!query || views.find(v => v.name === query)) return
    setViews([...views, { name: query, active: true }])
    setQuery('')
  }

  const activeShip = useMemo(() => ships.find(s => s.active), [ships])
  const addStepToTest = (test: RTest, step: StringTestStep) => {
    let ourStep: TestStep | undefined = undefined

    switch (step) {
      case 'read':
        ourStep = { tag: '', payload: '', expected: '' } as TestCustomReadStep
        break
      case 'rsub':
        ourStep = { payload: { who: '', to: '', app: '', path: '' }, expected: '' } as TestReadSubscriptionStep
        break
      case 'scry':
        ourStep = { payload: { who: '', "mold-name": '', care: '', app: '', path: '' }, expected: '' } as TestScryStep
        break
      case 'dbug':
        ourStep = { payload: { who: '', "mold-name": '', app: '' }, expected: '' } as TestDbugStep
        break
      case 'wait':
        ourStep = { until: 1 } as TestWaitStep
        break
      case 'dojo': 
        ourStep = { payload: { who: '', payload: '' }, expected: [] } as TestDojoStep
        break
      case 'poke':
        ourStep = { payload: { who: '', to: '', app: '', mark: '', payload: '' }, expected: [] } as TestPokeStep
        break
      case 'subs': 
        ourStep = { payload: { who: '', to: '', app: '', path: '' }, expected: [] } as TestSubscribeStep
        break
      case 'writ':
        ourStep = { tag: '', payload: '', expected: [] } as TestCustomWriteStep
        break
    }

    ourStep !== undefined && setTests(tests.map(t => ({ ...t, 
      newStepOpen: false, 
      steps: t.name === test.name ? [...t.steps, ourStep as TestStep] : t.steps 
    })))
  }

  useDocumentTitle(`${zigguratTitleBase} REPL`)
  return (<>
    <OpenFileHeader />
    <Container className='repl-view'>
      <Row>
        <Col className='ships'>
          {ships.map((ship, i) => <Card 
              onClick={() => setShips(ships.map(s => ({ ...s, active: ship.name === s.name })))}
              className={classNames('p05 mb1 ship', { active: ship.active })} key={i}>
            <Row>
              <Button onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShips(ships.map(s => ({ ...s, expanded: (ship.name === s.name) ? (!s.expanded) : s.expanded })))}
                } style={{ alignSelf: 'flex-start', marginRight: '0.5em' }} variant='unstyled' iconOnly 
                icon={ship.expanded ? <FaChevronDown /> : <FaChevronRight />} />
              <Text small bold> {ship.name} </Text>
              {ship.expanded && <Button style={{ marginLeft: 'auto', alignSelf: 'flex-start' }} variant='unstyled' iconOnly icon={<FaRegTrashAlt />} 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (window.confirm('Are you sure you want to delete fakeship ' + ship.name + '?'))
                    setShips(ships.filter(s => s.name !== ship.name))
                }} />}
            </Row>
            {ship.expanded ? <Col>
              <Text small> Agents: </Text>
              {Object.keys(ship.apps).map(k => <Text small ml1 key={k}>%{k}</Text>)}
            </Col> : <></>}
          </Card>)}
          <Divider className='mb1'/>
          <Card className='ship'><Row>
            <Input className='new-ship' placeholder='~sampel-palnet' onChange={(e) => setNewShip({ ...newShip, name: e.currentTarget.value })} />
            <Button variant='unstyled' icon={<FaPlus />} iconOnly style={{ marginLeft: 'auto' }} onClick={() => {
              setShips([...ships, newShip])
              setNewShip(blankShip)
            }} />
          </Row></Card>
        </Col>

        <Col className='mid'>
          <Row className='tabs'>
            {tabs.map(tab => <Card 
                onClick={() => setTabs(tabs.map(t => ({ ...t, active: tab.name === t.name })))} 
                className={classNames('tab', { active: tab.active})} 
                key={tab.name}>
              {tab.name}
            </Card>)}
          </Row>
          {tabs.find(t => t.name === 'state')?.active && activeShip && <Card className='tab-body state' title={`state: ${activeShip.name}`}>
            <Row between className='states-views'>
              <Col className='states'>
                <Json json={activeShip!.apps} />
              </Col>
              <Col className='views'>
                <Text bold style={{marginTop:16}}>Views</Text>
                {views.map(view => <Checkbox key={view.name} label={view.name} className='view' isSelected={view.active} 
                  onCheckboxChange={() => setViews(views.map(v => ({ 
                    ...v, active: (v.name === view.name ? !view.active : v.active) 
                })))} />)}
              </Col>
            </Row>
            <Row className='input w100'>
              <Input value={query} className='query' name='query' placeholder='query...' 
                onChange={(e)=> setQuery(e.currentTarget.value)} />
              <Button onClick={() => addView(query)}>add view</Button>
            </Row>
          </Card>}
          {tabs.find(t => t.name === 'events')?.active && activeShip && <Card className='tab-body events' title={`events: ${activeShip.name}`}>
            <Col className='events-table mt1'>
              <Row className='tr'>
                <Text bold className='td th'>from</Text>
                <Text bold className='td th'>type</Text>
                <Text bold className='td th'>values</Text>
              </Row>
              {events.map((revent, i) => <Row className='tr' key={i}>
                <Text className='td'>{revent.source}</Text>
                <Text className='td'>{revent.type}</Text>
                <Text mono className='td'>{revent.data}</Text>
              </Row>)}
            </Col>
          </Card>}
          {tabs.find(t => t.name === 'tests')?.active && <Card className='tab-body tests' title='tests'>
            {tests.map((test, i) => <Col key={i} className='test'>
              <Row>
                <Text large>{test.name}</Text>
                <Row className='buttons'>
                  <Button icon={<FaRegTrashAlt />} iconOnly variant='unstyled' />
                  <Button icon={<FaPlay />} iconOnly variant='unstyled' />
                </Row>
              </Row>
              <Field name='Name'>
                <Input value={test.name} onChange={(e) => setTests(tests.map(t => ({ ...t,
                  name: (t.name === test.name ? e.currentTarget.value : t.name)
                })))} />
              </Field>
              <Field name='File' className='w100'>
                <Text>Import steps from file:</Text>
                <Dropdown value={test.filePath || 'No file selected'} open={Boolean(test.filePathDropOpen)}
                  style={{ marginLeft: 'auto' }}
                  toggleOpen={() => setTests(tests.map(t => ({ ...t, 
                    filePathDropOpen: t.name === test.name ? !t.filePathDropOpen : false })))}>
                  <option onClick={(e) => {
                      console.log(e)
                      setTests(tests.map(t => ({ ...t, 
                        filePathDropOpen: false,
                        filePath: t.name === test.name ? undefined : t.filePath 
                    })))}}
                    key={'null'}>None (use manual steps)</option>
                  {projects[currentProject].dir.map(file => <option key={file}
                    onClick={(e) => {
                      setTests(tests.map(t => ({ ...t, 
                        filePathDropOpen: false,
                        filePath: t.name === test.name ? e.currentTarget.value : t.filePath 
                    })))}} value={file}>{file}</option>)}
                </Dropdown>
              </Field>
              {!Boolean(test.filePath) && <><Field name='Steps'>
                <Col className='w100'>
                  {Boolean(test.steps.length) 
                    ? test.steps.map((step, j) => <TestStepRow index={j} test={test} step={step} key={j} />)
                    : <Text>None</Text>}
                </Col>
              </Field>
              <Field name='Add' className='ml1 mt1'>
                <Dropdown value={'Select step type...'} open={Boolean(test.newStepOpen)} toggleOpen={() => setTests(tests.map(t => ({ ...t, newStepOpen: t.name === test.name ? !t.newStepOpen : false })))}>
                  <Text bold>Read step</Text>
                  <option onClick={() => { addStepToTest(test, 'scry') }}>Scry</option>
                  <option onClick={() => { addStepToTest(test, 'rsub') }}>Read Subscription</option>
                  <option onClick={() => { addStepToTest(test, 'wait') }}>Wait</option>
                  <option onClick={() => { addStepToTest(test, 'dbug') }}>Dbug</option>
                  <option onClick={() => { addStepToTest(test, 'read') }}>Custom Read</option>
                  <Divider />
                  <Text bold>Write</Text>
                  <option onClick={() => { addStepToTest(test, 'poke') }}>Poke</option>
                  <option onClick={() => { addStepToTest(test, 'subs') }}>Subscribe</option>
                  <option onClick={() => { addStepToTest(test, 'dojo') }}>Dojo</option>
                  <option onClick={() => { addStepToTest(test, 'writ') }}>Custom Write</option>
                </Dropdown>
                <Row className='buttons'>
                  <Button variant='unstyled' iconOnly icon={<FaPlus />} disabled={false} 
                    onClick={() => {}} />
                </Row>
              </Field></>}
              <Field name='Imports' className='imports wrap'>
                {test.imports.map((imp, j) => <Row className='import w100' key={j}>
                  <Text mr1 ml1>Face</Text>
                  <Input value={imp.face} onChange={(e) => setTests(tests.map(t => ({ 
                    ...t, 
                    imports: t.name === test.name 
                    ? test.imports.map(im => im.face === imp.face 
                      ? { ...im, face: e.currentTarget.value }
                      : im)
                      : t.imports 
                  })))} />
                  <Text mr1 ml1>Path</Text>
                  <Dropdown open={Boolean(imp.dropOpen)} toggleOpen={() => setTests(tests.map(t => ({ 
                    ...t, 
                    imports: t.imports.map(im => ({ ...im, dropOpen: im.face === imp.face ? !im.dropOpen : false }))})))} 
                  value={imp.path}>
                    {projects[currentProject].dir.map(file => <option value={file} key={file} 
                      onClick={(e) => setTests(tests.map(t => ({ 
                      ...t, 
                      imports: t.name === test.name 
                        ? test.imports.map(im => ({ ...im, 
                          dropOpen: false, 
                          path: im.face === imp.face ? e.currentTarget.value : im.path }))
                        : t.imports
                    })))}>{file}</option>)}
                  </Dropdown>
                  <Row className='buttons'>
                    <Button variant='unstyled' iconOnly icon={<FaRegTrashAlt />} onClick={() => setTests(tests.map(t => ({
                      ...t, imports: t.name === test.name ? t.imports.filter(im => im.face !== imp.face) : t.imports
                    })))} />
                  </Row>
                </Row>)}
                <Field name='Add' className='ml1 mt1 w100 add-import'>
                  <Input className='mr1' placeholder='face' value={newFace} onChange={(e) => setNewFace(e.currentTarget.value)} />
                  <Input placeholder='path' value={newPath} onChange={(e) => setNewPath(e.currentTarget.value)} />
                  <Button variant='unstyled' style={{ marginLeft: 'auto', border: '1px solid transparent' }}
                    iconOnly icon={<FaPlus />} disabled={!Boolean(newFace) || !Boolean(newPath)}
                    onClick={() => {
                      setNewFace('')
                      setNewPath('')
                      setTests(tests.map(t => ({ ...t, imports: t.name === test.name 
                      ? [...t.imports, { face: newFace, path: newPath }]
                      : t.imports })))}} />
                </Field>
              </Field>
            </Col>)}
            <Divider />
            <Row className='test new'>
              <Input placeholder='name' value={newTest} onChange={(e) => setNewTest(e.currentTarget.value)} />
              <Button disabled={!Boolean(newTest)} style={{ marginLeft: 'auto' }} variant='unstyled' onClick={(e) => {
                  Boolean(newTest) && setTests([...tests, { name: newTest, filePath: undefined, imports: [], steps: [], expanded: true }])
                  setNewTest('')
                }}>
                <Row>
                <FaPlus className='mr1' />
                <Text>Add new test</Text>
                </Row>
              </Button>
            </Row>
          </Card>}
        </Col>

        <Col className='pokes-scries'>
          <Entry>
            <Card title='Pokes'>
              {pokes.map((poke,i) => <Col key={i} className='poke'>
                <Row className='w100'>
                  <Button className='expander' variant='unstyled' iconOnly icon={poke.expanded ? <FaChevronDown /> : <FaChevronRight />}
                  onClick={() => togglePokeExpanded(poke, 'expanded')} />
                  <Text>{poke.ship} - %{poke.app}</Text>
                  <Row className='buttons'>
                    {poke.expanded && <Button className='poker' variant='unstyled' iconOnly icon={<FaRegTrashAlt />} 
                    onClick={()=>window.confirm('Are you sure you want to delete this poke?') && setPokes(pokes.filter(s => !samePoke(s, poke))) }/>}
                    <Button className='poker' variant='unstyled' iconOnly icon={<FaRegHandPointer />} />
                  </Row>
                </Row>
                <Row className={classNames('showable', { show: poke.expanded })}>
                  <Dropdown open={poke.expandedShips || false} value={poke.ship} toggleOpen={() => togglePokeExpanded(poke, 'expandedShips')}>
                    {ships.map(ship => <option onClick={() => setPokes(pokes.map(p => ({ ...p, 
                      ship: samePoke(p, poke) ? ship.name : p.ship,
                      expandedShips: false
                    })))} key={ship.name} value={ship.name}>{ship.name}</option>)}
                  </Dropdown>
                  <Dropdown open={poke.expandedApps || false} value={poke.app} toggleOpen={() => togglePokeExpanded(poke, 'expandedApps')}>
                    {activeShip && Object.keys(activeShip.apps).map(app => <option onClick={() => setPokes(pokes.map(p => ({ 
                      ...p,
                      app: samePoke(p, poke) ? app : p.app,
                      expandedApps: false
                    })))} key={app} value={app}>{app}</option>)}
                  </Dropdown>
                  <Input onChange={(e) => setPokes(pokes.map(p => ({ 
                    ...p, 
                    data: samePoke(p, poke) ? e.currentTarget.value : p.data, 
                  })))} className='pokeData' name='poke-data' placeholder='cage...' value={poke.data} />
                </Row>
              </Col>)}
              <Divider className='mt1' />
              <Col className='poke new'>
                <Row>
                  <Dropdown open={newPoke.expandedShips || false} value={newPoke.ship || ships[0].name} toggleOpen={() => setNewPoke({ ...newPoke, expandedShips: !newPoke.expandedShips })}>
                    {ships.map(ship => ship && <option onClick={() => setNewPoke({...newPoke, ship: ship.name })} key={ship.name} value={ship.name}>{ship.name}</option>)}
                  </Dropdown>
                  <Dropdown open={newPoke.expandedApps || false} value={newPoke.app || activeShip && Object.keys(activeShip.apps)[0]} toggleOpen={() => setNewPoke({ ...newPoke, expandedApps: !newPoke.expandedApps })}>
                    {activeShip && Object.keys(activeShip.apps).map(app => <option onClick={() => setNewPoke({...newPoke, app })} key={app} value={app}>{app}</option>)}
                  </Dropdown>
                  <Input onChange={(e) => setNewPoke({ ...newPoke, data: e.currentTarget.value})} 
                  className='pokeData' name='poke-data' placeholder='[=mark =vase]' value={newPoke.data} />
                  <Button className='scrier' variant='unstyled' iconOnly icon={<FaPlus />} onClick={() => {
                    setScries([...scries, {...newPoke}])
                    setNewPoke(blankScry)
                  }} />
                </Row>
              </Col>
            </Card>
          </Entry>
          <Entry>
            <Card title='Scries'>
              {scries.map((scry,i) => <Col key={i} className='scry'>
                <Row className='w100'>
                  <Button className='expander' variant='unstyled' iconOnly icon={scry.expanded ? <FaChevronDown /> : <FaChevronRight />}
                  onClick={() => toggleScryExpanded(scry, 'expanded')} />
                  <Text>{scry.ship} - {scry.data.split(' ')[0]}</Text>
                  <Row className='buttons'>
                    {scry.expanded && <Button className='poker' variant='unstyled' iconOnly icon={<FaRegTrashAlt />} 
                    onClick={()=>window.confirm('Are you sure you want to delete this scry?') && setScries(scries.filter(s => !sameScry(s, scry))) }/>}
                    <Button className='scrier' variant='unstyled' iconOnly icon={<FaRegEye />} />
                  </Row>
                </Row>
                <Row className={classNames('showable', { show: scry.expanded })}>
                  <Dropdown open={scry.expandedShips || false} value={scry.ship} toggleOpen={() => toggleScryExpanded(scry, 'expandedShips')}>
                    {ships.map(ship => <option onClick={() => setScries(scries.map(s => ({ ...s, 
                      ship: sameScry(s, scry) ? ship.name : s.ship,
                      expandedShips: false
                    })))} key={ship.name} value={ship.name}>{ship.name}</option>)}
                  </Dropdown>
                  <Input onChange={(e) => setScries(scries.map(s => ({ 
                    ...s, 
                    data: sameScry(s, scry) ? e.currentTarget.value : s.data, 
                  })))} className='scryData' name='scry-data' placeholder='%gx /ship/...' value={scry.data} />
                </Row>
              </Col>)}
              <Divider className='mt1' />
              <Col className='scry new'>
                <Row>
                  <Dropdown open={newScry.expandedShips || false} value={newScry.ship || ships[0].name} toggleOpen={() => setNewScry({ ...newScry, expandedShips: !newScry.expandedShips })}>
                    {ships.map(ship => <option onClick={() => setNewScry({...newScry, ship: ship.name })} key={ship.name} value={ship.name}>{ship.name}</option>)}
                  </Dropdown>
                  <Input onChange={(e) => setNewScry({ ...newScry, data: e.currentTarget.value})} 
                  className='scryData' name='scry-data' placeholder='%gx /ship/...' value={newScry.data} />
                  <Button className='scrier' variant='unstyled' iconOnly icon={<FaPlus />} onClick={() => {
                    setScries([...scries, {...newScry}])
                    setNewScry(blankScry)
                  }} />
                </Row>
              </Col>
            </Card>
          </Entry>
        </Col>
      </Row>
    </Container>
  </>)
}

export default ReplView

