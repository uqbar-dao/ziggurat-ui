import classNames from 'classnames'
import { useMemo, useState } from 'react'
import { FaChevronDown, FaChevronRight, FaRegEye, FaRegHandPointer } from 'react-icons/fa'
import Card from '../../components-indexer/card/Card'
import Checkbox from '../../components-zig/forms/Checkbox'
import { OpenFileHeader } from '../../components-zig/nav/OpenFileHeader'
import Button from '../../components/form/Button'
import Input from '../../components/form/Input'
import Dropdown from '../../components/popups/Dropdown'
import Col from '../../components/spacing/Col'
import Container from '../../components/spacing/Container'
import Entry from '../../components/spacing/Entry'
import Row from '../../components/spacing/Row'
import Json from '../../components/text/Json'
import Text from '../../components/text/Text'
import useZigguratStore from '../../stores/zigguratStore'
import { Tab, Poke, Scry } from '../../types/ziggurat/Repl'

import './ReplView.scss'


const ReplView = () => {
  const { ships, setShips, views, setViews, pokes, setPokes, scries, setScries } = useZigguratStore()

  const [tabs, setTabs] = useState<Tab[]>([
    { name: 'state', active: true },
    { name: 'subs', active: false },
    { name: 'arvo', active: false },
    { name: 'dojo', active: false},
  ])

  if (!ships.length) setShips([
    { name: '~bus',
      active: true,
      apps: { myapp: { herp: 'derp' },
              bubba: { dubba: 'gubba', lubba: 'slubba' },
              beebo: { neebo: [7, 3, 3, 8, 0] } } },
    { name: '~nec',
      active: false,
      apps: { myapp: { herp: 'burp' },
              bubba: { dubba: 'gubba', lubba: 'slubba' },
              beebo: { neebo: [7, 3, 3, 8, 0] } } },
    { name: '~luc',
      active: false,
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
    { app: 'myapp', ship: '~bud', data: "{ 'add-herp': 'derp' }" },
    { app: 'myapp', ship: '~luc', data: "{ 'add-herp': 'gurp' }" },
  ])

  if (!scries.length) setScries([
    { ship: '~nec', data: '%gx /beep/jeep/deep/sleep' },
    { ship: '~luc', data: '%cx /gup/dup/lup/pup' },
    { ship: '~bud', data: '%ax /oop/doop/sloop' },
  ])

  const [query, setQuery] = useState<string>('')
  const togglePokeExpanded = (poke: Poke, key: 'expanded' | 'expandedApps' | 'expandedShips') => {
    setPokes(pokes.map(p => ({ 
      ...p, 
      [key]: samePoke(p, poke) ? !p[key] : p[key] })))
  }
  const toggleScryExpanded = (scry: Scry, key: 'expanded' | 'expandedShips') => {
    setScries(scries.map(p => ({ 
      ...p, 
      [key]: sameScry(p, scry) ? !p[key] : p[key] })))
  }

  const samePoke = (p: Poke, poke: Poke) => (p.ship === poke.ship && p.app === poke.app && p.data === poke.data)
  const sameScry = (s: Scry, scry: Scry) => (s.ship === scry.ship && s.data === scry.data)

  const addView = (query: string) => {
    if (!query || views.find(v => v.name === query)) return
    setViews([...views, { name: query, active: true }])
    setQuery('')
  }

  const activeShip = useMemo(() => ships.find(s => s.active), [ships])

  return (<>
    <OpenFileHeader />
    <Container className='repl-view'>
      <Row>
        <Col className='ships'>
          {ships.map((ship, i) => <Card 
              onClick={() => setShips(ships.map(s => ({ ...s, active: ship.name === s.name })))}
              className={classNames('mb1 ship', { active: ship.active })} key={i}>
            <Text bold> {ship.name} </Text>
            {Object.keys(ship.apps).map(k => <Text ml1 key={k}>{k}</Text>)}
          </Card>)}
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
          {activeShip && <Card className='tab-body' title={`${activeShip.name} state`}>
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
        </Col>

        <Col className='pokes-scries'>
          <Entry>
            <Card title='Pokes'>
              {pokes.map((poke,i) => <Col key={i} className='poke'>
                <Row className='w100'>
                  <Button className='expander' variant='unstyled' iconOnly icon={poke.expanded ? <FaChevronDown /> : <FaChevronRight />}
                  onClick={() => togglePokeExpanded(poke, 'expanded')} />
                  <Text>{poke.ship} - %{poke.app}</Text>
                  <Button className='poker' variant='unstyled' iconOnly icon={<FaRegHandPointer />} />
                </Row>
                <Row className={classNames('showable', { show: poke.expanded })}>
                  <Dropdown open={poke.expandedShips || false} value={poke.ship} toggleOpen={() => togglePokeExpanded(poke, 'expandedShips')}>
                    {ships.map(ship => <option onClick={() => setPokes(pokes.map(p => ({ ...p, 
                      ship: samePoke(p, poke) ? ship.name : p.ship,
                      expandedShips: false
                    })))} key={ship.name} value={ship.name}>{ship.name}</option>)}
                  </Dropdown>
                  <Dropdown open={poke.expandedApps || false} value={poke.app} toggleOpen={() => togglePokeExpanded(poke, 'expandedApps')}>
                    {Object.keys(activeShip!.apps).map(app => <option onClick={() => setPokes(pokes.map(p => ({ 
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
            </Card>
          </Entry>
          <Entry>
            <Card title='Scries'>
              {scries.map((scry,i) => <Col key={i} className='scry'>
                <Row className='w100'>
                  <Button className='expander' variant='unstyled' iconOnly icon={scry.expanded ? <FaChevronDown /> : <FaChevronRight />}
                  onClick={() => toggleScryExpanded(scry, 'expanded')} />
                  <Text>{scry.ship} - {scry.data.split(' ')[0]}</Text>
                  <Button className='poker' variant='unstyled' iconOnly icon={<FaRegEye />} />
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
            </Card>
          </Entry>
        </Col>
      </Row>
    </Container>
  </>)
}

export default ReplView