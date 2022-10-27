import { useCallback } from "react"
import useZigguratStore from "../../stores/zigguratStore"
import { Test } from "../../types/ziggurat/TestData"
import { truncateString } from "../../utils/format"
import Button from "../../components/form/Button"
import Row from "../../components/spacing/Row"
import Text from "../../components/text/Text"

export const ItemDisplaySmall = ({ item, field, test }: { item: string, field?: string, test: Test }) => {
  const { updateTest } = useZigguratStore()

  const removeItem = useCallback(() => {
    const newTest = { ...test }

    // if (field && newTest.input.action[field] && Array.isArray(newTest.input.action[field])) {
    //   newTest.input.action[field] = (newTest.input.action[field] as string[]).filter(g => g !== item)
    // } else {
    //   newTest.input.cart.items = newTest.input.cart.items.filter((g) => g !== item)
    // }

  }, [test])

  return (
    <Row between style={{ margin: 4, padding: '2px 6px', background: 'white', borderRadius: 4 }}>
      <Text mono style={{ marginRight: 8 }}>ID: {item.length > 11 ? truncateString(item) : item}</Text>
      <Button
        onClick={removeItem}
        variant='unstyled'
        className="delete"
        style={{ fontSize: 20 }}
      >
        &times;
      </Button>
    </Row>
  )
}
