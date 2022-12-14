import classNames from 'classnames'
import { useMemo, useState } from 'react'
import Card from '../../components-indexer/card/Card'
import Checkbox from '../../components-zig/forms/Checkbox'
import { OpenFileHeader } from '../../components-zig/nav/OpenFileHeader'
import Button from '../../components/form/Button'
import Input from '../../components/form/Input'
import Col from '../../components/spacing/Col'
import Container from '../../components/spacing/Container'
import Entry from '../../components/spacing/Entry'
import Row from '../../components/spacing/Row'
import Json from '../../components/text/Json'
import Text from '../../components/text/Text'
import useZigguratStore from '../../stores/zigguratStore'
import { Tab } from '../../types/ziggurat/Repl'

import './ReplView.scss'


const ReplView = () => {
  const { ships, setShips, views, setViews } = useZigguratStore()

  const [tabs, setTabs] = useState<Tab[]>([
    { name: 'state', active: true },
    { name: 'subs', active: false },
    { name: 'arvo', active: false },
    { name: 'dojo', active: false},
  ])

  if (!ships.length) setShips([
    { name: '~bus',
      active: true,
      data: { myapp: { herp: 'derp' } } },
    { name: '~nec',
      active: false,
      data: { myapp: { herp: 'burp' } } },
    { name: '~luc',
      active: false,
      data: { myapp: { herp: 'slurp' } } }])

  if (!views.length) setViews([
    { name: 'floopus', active: true },
    { name: 'doopus', active: true },
    { name: 'gloopus', active: true },
    { name: 'a really long one for some reason', active: false }])

  const [query, setQuery] = useState<string>('')

  const addView = (query: string) => {
    if (!query || views.find(v => v.name === query)) return
    setViews([...views, { name: query, active: true }])
    setQuery('')
  }

  const pokes = ['do-herp', 'un-herp']
  const scries = ['herps']
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
            {Object.keys(ship.data).map(k => <Text key={k}>{k}</Text>)}
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
                <Json json={activeShip!.data} />
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
              {pokes.map(poke => <Row key={poke} className='poke'>{poke}</Row>)}
            </Card>
          </Entry>
          <Entry>
            <Card title='Scries'>
              {scries.map(scry => <Row key={scry} className='scry'>{scry}</Row>)}
            </Card>
          </Entry>
        </Col>
      </Row>
    </Container>
  </>)
}

export default ReplView