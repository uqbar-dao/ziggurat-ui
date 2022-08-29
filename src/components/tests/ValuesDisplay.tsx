import { Droppable } from 'react-beautiful-dnd'
import { Test } from "../../types/TestData"
import { truncateString } from "../../utils/format"
import Col from "../spacing/Col"
import Row from "../spacing/Row"
import { GrainDisplaySmall } from './GrainDisplay'

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
      // if (actionMold && test && (actionMold?.[key] as any)?.includes('%grain')) {
      //   return (
      //     <Row style={{ ...indentStyle, marginTop: 4 }} key={key}>
      //       <div style={{ width: 115 }}>{key}:</div>
      //       <Droppable droppableId={`${test.id}___${key}`} style={{ width: '100%' }}>
      //         {(provided: any) => (
      //           <Row {...provided.droppableProps} innerRef={provided.innerRef}
      //           style={{ background: 'lightgray', width: 'calc(100% - 120px)', height: 35, borderRadius: 4, overflow: 'scroll', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      //             {(test.input.action[key] as any).map((grain: string) => (
      //               <GrainDisplaySmall key={grain} grain={grain} field={key} test={test} />
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
