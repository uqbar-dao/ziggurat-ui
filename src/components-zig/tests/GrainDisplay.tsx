import { useCallback } from "react"
import useZigguratStore from "../../stores/zigguratStore"
import { Test } from "../../types/ziggurat/TestData"
import { truncateString } from "../../utils/format"
import Button from "../../components/form/Button"
import Row from "../../components/spacing/Row"
import Text from "../../components/text/Text"

export const GrainDisplaySmall = ({ grain, field, test }: { grain: string, field?: string, test: Test }) => {
  const { updateTest } = useZigguratStore()

  const removeGrain = useCallback(() => {
    const newTest = { ...test }

    // if (field && newTest.input.action[field] && Array.isArray(newTest.input.action[field])) {
    //   newTest.input.action[field] = (newTest.input.action[field] as string[]).filter(g => g !== grain)
    // } else {
    //   newTest.input.cart.grains = newTest.input.cart.grains.filter((g) => g !== grain)
    // }

  }, [test])

  return (
    <Row between style={{ margin: 4, padding: '2px 6px', background: 'white', borderRadius: 4 }}>
      <Text mono style={{ marginRight: 8 }}>ID: {grain.length > 11 ? truncateString(grain) : grain}</Text>
      <Button
        onClick={removeGrain}
        variant='unstyled'
        className="delete"
        style={{ fontSize: 20 }}
      >
        &times;
      </Button>
    </Row>
  )
}
