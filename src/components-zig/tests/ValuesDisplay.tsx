import { Droppable } from 'react-beautiful-dnd'
import { Test } from "../../types/ziggurat/TestData"
import { truncateString } from "../../utils/format"
import Col from "../../components/spacing/Col"
import Row from "../../components/spacing/Row"
import { ItemDisplaySmall } from './ItemDisplay'

interface ValuesProps {
  values: any
  test?: Test
  indent?: number
}

export const Values = ({ values, test, indent = 0 }: ValuesProps) => {
  const indentStyle = { paddingLeft: indent * 8 }

  if (typeof values === 'string') {
    return <div style={indentStyle}>{values.length > 11 ? truncateString(values) : values}</div>
  } else if (Array.isArray(values)) {
    return (
      <Col style={indentStyle}>
        {values.map((value) => (
          <Values key={JSON.stringify(value)} values={value} indent={indent + 1} />
        ))}
      </Col>
    )
  }

  return <>
    {Object.keys(values).map((key) => {
      // if (actionMold && test && (actionMold?.[key] as any)?.includes('%item')) {
      //   return (
      //     <Row style={{ ...indentStyle, marginTop: 4 }} key={key}>
      //       <div style={{ width: 115 }}>{key}:</div>
      //       <Droppable droppableId={`${test.id}___${key}`} style={{ width: '100%' }}>
      //         {(provided: any) => (
      //           <Row {...provided.droppableProps} innerRef={provided.innerRef}
      //           style={{ background: 'lightgray', width: 'calc(100% - 120px)', height: 35, borderRadius: 4, overflow: 'scroll', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      //             {(test.input.action[key] as any).map((item: string) => (
      //               <ItemDisplaySmall key={item} item={item} field={key} test={test} />
      //             ))}
      //             {provided.placeholder}
      //           </Row>
      //         )}
      //       </Droppable>
      //     </Row>
      //   )
      // }

      return (
        key === 'type' ? null :
        <Row style={{ ...indentStyle, marginTop: 4 }} key={key}>
          <div style={{ width: 110 }}>{key}:</div>
          <Values values={(values as any)[key]} indent={indent + 1} test={test} />
        </Row>
      )
      })}
  </>
}
