import classNames from 'classnames'
import { useMemo, useState } from 'react'
import { FaChevronDown, FaChevronRight, FaPlus, FaRegEye, FaRegHandPointer, FaRegTrashAlt, FaTimes } from 'react-icons/fa'
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
import Row from '../../components/spacing/Row'
import Json from '../../components/text/Json'
import Text from '../../components/text/Text'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import useZigguratStore from '../../stores/zigguratStore'
import { Tab, Poke as RPoke, Scry as RScry } from '../../types/ziggurat/Repl'
import { TestDisplay } from '../../components-zig/tests/TestDisplay'
import { useNavigate } from 'react-router-dom'

import './ReplView.scss'
import { MiniTest } from '../../components-zig/tests/MiniTest'
import TestStepRow from '../../components-zig/tests/TestStepRow'

const ReplView = () => {
  const { zigguratTitleBase, tests, addTest, ships, getShips, setShips, startShips, stopShips, views, setViews, pokes, setPokes, scries, setScries, events, currentProject, setLoading } = useZigguratStore()
  const nav = useNavigate()

  if (!currentProject) {
    nav('/')
  }

  const [tabs, setTabs] = useState<Tab[]>([
    { name: 'tests', active: true },
    { name: 'state', active: false },
    { name: 'events', active: false },
    { name: 'dojo', active: false },
  ])
  
  const blankPoke = { ship: '', data: '' }
  const blankScry = { ship: '', data: '', app: '' }

  const [query, setQuery] = useState<string>('')
  const [newScry, setNewScry] = useState<RScry>(blankPoke)
  const [newPoke, setNewPoke] = useState<RPoke>(blankScry)
  const [newShip, setNewShip] = useState<string>('')
  const [newTest, setNewTest] = useState<string>('')
  const [newShips, setNewShips] = useState<string[]>([])

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
  


  const onAddTest = async () => {
    if (!Boolean(newTest)) return
    try {
      setLoading(`Creating test '${newTest}'...`)
      const result = await addTest(newTest, {}, [])
    } catch (e) {
      debugger
      alert('Error creating new test.')
    } finally {
      setLoading()
      setNewTest('')
    }
  }

  

  useDocumentTitle(`${zigguratTitleBase} REPL`)
  return (<>
    <OpenFileHeader />
    <Container className='repl-view'>
      <Row>
        <Col className='ships-queue'>
          <Card className='ships smallTitle' title='Virtual Ships'>
            {!Boolean(ships.length) && <Text className='mt1'>No virtualships yet.</Text> }
            {ships.map((ship, i) => <Card
                onClick={() => setShips(ships.map(s => ({ ...s, active: ship.name === s.name })))}
                className={classNames('ship', { mt1: !i, active: ship.active })} key={i}>
              <Row>
                <Button onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShips(ships.map(s => ({ ...s, expanded: (ship.name === s.name) ? (!s.expanded) : s.expanded })))}
                  } style={{ alignSelf: 'flex-start', marginRight: '0.5em' }} variant='unstyled' iconOnly 
                  icon={ship.expanded ? <FaChevronDown /> : <FaChevronRight />} />
                <Text small bold> {ship.name} </Text>
                {/* {ship.expanded && <Button style={{ marginLeft: 'auto', alignSelf: 'flex-start' }} variant='unstyled' iconOnly icon={<FaRegTrashAlt />} 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (window.confirm('Are you sure you want to delete fakeship ' + ship.name + '?'))
                      setShips(ships.filter(s => s.name !== ship.name))
                  }} />} */}
              </Row>
              {ship.expanded ? <Col>
                <Text small> Agents: </Text>
                {Object.keys(ship.apps).map(k => <Text small ml1 key={k}>%{k}</Text>)}
              </Col> : <></>}
            </Card>)}
            {Boolean(ships.length > 0) && <Button onClick={async () => {
              if (!window.confirm(`Are you sure you want to stop ${ships.length} ships?
                You can start them again later.`)) 
                return

              try {
                setLoading(`Stopping ships...`)
                await stopShips(currentProject)
                setShips([])
              } catch (e) {
                alert('Error stopping ships.')
                debugger
              } finally {
                setLoading()
              }
            }}> Stop all ships </Button>}
            {Boolean(ships.length) && <Divider className='mt1'/>}
            <Card className='ship mt1 smallTitle' style={{ overflow: 'hidden' }} title='Start ships'>
              {newShips.map((ship, i) => <Row between key={i}>
                <Text className='new-ship'>{ship}</Text>
                <Button icon={<FaTimes/>} iconOnly variant='slim'
                  onClick={() => setNewShips(newShips.filter(s => s !== ship))} />
              </Row>)}
              <Row>
                <Input placeholder='~dev' style={{ width: '90%' }} value={newShip}
                onChange={(e) => setNewShip(e.currentTarget.value)}
                onKeyUp={(e) => {
                  if (e.key !== 'Enter') return
                  setNewShips([...newShips, newShip])
                  setNewShip('')
                }} />
                <Button variant='slim' disabled={!Boolean(newShip)} onClick={() => {
                  setNewShips([...newShips, newShip])
                  setNewShip('')
                }} iconOnly icon={<FaPlus />} />
              </Row>
              <Button disabled={!Boolean(newShips.length)} variant='slim' fullWidth
                style={{marginTop: '0.5em'}} onClick={async () => {
                  const sigNames = newShips.map(s => s[0] == '~' ? s : '~' + s)
                  try {
                    setLoading(`Starting ${sigNames.join (', ')} (this may take a while)...`)
                    const result = await startShips(currentProject, sigNames)
                  } catch (e) {
                    alert(`Error starting ${sigNames.join(', ')}. Please check ship names for typos.`)
                    debugger
                  } finally {
                    setNewShips([])
                    setLoading(undefined)
                    setShips((await getShips()).ships.map((ship, j) => ({ 
                      name: ship, active: (ships[j])?.active, apps: [] 
                    })))
                  }
              }}> Start {newShips.length} ship(s) </Button>
            </Card>
          </Card>
          <Card className='queue mt1 smallTitle' title='Test Queue'>
            {tests.map((test, i) => <Row className='test' key={test.id}>
              <Text className='mr1'>{i+1}.</Text>
              <Text>{test.name}</Text>
              <Row className='buttons' style={{ marginLeft: 'auto' }}>
                <Button variant='slim' iconOnly icon={<FaTimes />} />
              </Row>
            </Row>)}
          </Card>
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
          {tabs.find(t => t.name === 'state')?.active ? activeShip
          ? <Card className='tab-body state' title={`state: ${activeShip.name}`}>
            <Row between className='states-views'>
              <Col className='states wrap'>
                {views.map((view, i) => <Card className='smallTitle' key={i} style={{ display: view.active ? 'inherit' : 'none' }} title={view.name}>
                  <Text>highly relevant view information</Text>
                </Card>)}
              </Col>
              <Col className='views ml1'>
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
          </Card>
          : <Text className='mt1'>Select a virtualship on the left to view state information.</Text>
          : <></> }
          {tabs.find(t => t.name === 'events')?.active ? activeShip 
          ? <Card className='tab-body events' title={`events: ${activeShip.name}`}>
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
          </Card>
          : <Text className='mt1'>Select a virtualship on the left to view events information.</Text>
          : <></> }
          {tabs.find(t => t.name === 'tests')?.active && <Card className='tab-body tests' title='tests'>
            {tests.map((test, i) => <TestDisplay test={test} key={i} />)}
            <Divider />
            <Row className='test new'>
              <Input placeholder='name' value={newTest} onChange={(e) => setNewTest(e.currentTarget.value)} />
              <Button disabled={!Boolean(newTest)} style={{ marginLeft: 'auto' }} variant='slim' onClick={onAddTest}>
                Add test
              </Button>
            </Row>
          </Card>}
          {tabs.find(tab => tab.name === 'dojo')?.active ? activeShip ?
          <Card className='tab-body dojo' title={`dojo: ${activeShip.name}`}>
            <Text className='mt1'>WIP</Text>
          </Card>
          : <Text className='mt1'>Select a virtualship on the left to view the dojo.</Text>
          : <></>}
        </Col>

        <Col className='pokes-scries'>
          <Entry style={{paddingTop: 0}}>
            <Card title='Pokes' className='smallTitle'>
              {!Boolean(pokes.length) && <Text className='mt1'>No saved pokes yet.</Text> }
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
                <Row className={classNames('showable wrap', { show: poke.expanded })}>
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
                <Row className='wrap'>
                  <Dropdown open={newPoke.expandedShips || false} value={newPoke.ship || ships[0]?.name} toggleOpen={() => setNewPoke({ ...newPoke, expandedShips: !newPoke.expandedShips })}>
                    {ships.map(ship => ship && <option onClick={() => setNewPoke({...newPoke, ship: ship.name })} key={ship.name} value={ship.name}>{ship.name}</option>)}
                  </Dropdown>
                  <Dropdown open={newPoke.expandedApps || false} value={newPoke.app || activeShip && Object.keys(activeShip.apps)[0]} toggleOpen={() => setNewPoke({ ...newPoke, expandedApps: !newPoke.expandedApps })}>
                    {activeShip && Object.keys(activeShip.apps).map(app => <option onClick={() => setNewPoke({...newPoke, app })} key={app} value={app}>{app}</option>)}
                  </Dropdown>
                  <Input onChange={(e) => setNewPoke({ ...newPoke, data: e.currentTarget.value})} 
                  className='pokeData' name='poke-data' placeholder='[=mark =vase]' value={newPoke.data} />
                  <Button className='scrier' variant='slim' iconOnly icon={<FaPlus />} onClick={() => {
                    setScries([...scries, {...newPoke}])
                    setNewPoke(blankScry)
                  }} />
                </Row>
              </Col>
            </Card>
          </Entry>
          <Entry>
            <Card title='Scries' className='smallTitle'>
              {!Boolean(scries.length) && <Text className='mt1'>No saved scries yet.</Text> }
              {scries.map((scry,i) => <Col key={i} className='scry'>
                <Row className='w100'>
                  <Button className='expander' variant='slim' iconOnly icon={scry.expanded ? <FaChevronDown /> : <FaChevronRight />}
                  onClick={() => toggleScryExpanded(scry, 'expanded')} />
                  <Text>{scry.ship} - {scry.data.split(' ')[0]}</Text>
                  <Row className='buttons'>
                    {scry.expanded && <Button className='poker' variant='slim' iconOnly icon={<FaRegTrashAlt />} 
                    onClick={()=>window.confirm('Are you sure you want to delete this scry?') && setScries(scries.filter(s => !sameScry(s, scry))) }/>}
                    <Button className='scrier' variant='slim' iconOnly icon={<FaRegEye />} />
                  </Row>
                </Row>
                <Row className={classNames('showable wrap', { show: scry.expanded })}>
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
                <Row className='wrap'>
                  <Dropdown open={newScry.expandedShips || false} value={newScry.ship || ships[0]?.name} toggleOpen={() => setNewScry({ ...newScry, expandedShips: !newScry.expandedShips })}>
                    {ships.map(ship => <option onClick={() => setNewScry({...newScry, ship: ship.name })} key={ship.name} value={ship.name}>{ship.name}</option>)}
                  </Dropdown>
                  <Input onChange={(e) => setNewScry({ ...newScry, data: e.currentTarget.value})} 
                  className='scryData' name='scry-data' placeholder='%gx /ship/...' value={newScry.data} />
                  <Button className='scrier' variant='slim' iconOnly icon={<FaPlus />} onClick={() => {
                    setScries([...scries, {...newScry}])
                    setNewScry(blankScry)
                  }} />
                </Row>
              </Col>
            </Card>
          </Entry>
          <Entry>
            <Card title='Tests' className='smallTitle'>
              {tests.map((test, i) => <MiniTest test={test} className='test' key={i} />)}
              {!Boolean(tests.length) && <Text>No tests yet.</Text>}
            </Card>
          </Entry>
        </Col>
      </Row>
    </Container>
  </>)
}

export default ReplView

