import { RawMetadata } from "../../code-text/test-data/fungible"
import Button from "../form/Button"
import Form from "../form/Form"
import Input from "../form/Input"

interface MetadataFormProps {
  metadata: RawMetadata
  setMetadata: (m: RawMetadata) => void
  onSubmit: () => void
}

export const MetadataForm = ({ metadata, setMetadata, onSubmit }: MetadataFormProps) => {
  return (
    <Form style={{ borderRadius: 4, alignItems: 'center' }}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onSubmit()
      }}
    >
      <Input
        containerStyle={{ marginTop: 8 }}
        style={{ width: 300 }}
        onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
        value={metadata.name}
        label="Name (longform)"
        autoFocus
        required
      />
      <Input
        containerStyle={{ marginTop: 8 }}
        style={{ width: 300 }}
        onChange={(e) => setMetadata({ ...metadata, symbol: e.target.value.toUpperCase() })}
        value={metadata.symbol}
        label="Symbol (3-4 characters)"
        maxLength={4}
        required
      />
      <Input
        containerStyle={{ marginTop: 8 }}
        style={{ width: 300 }}
        onChange={(e) => setMetadata({ ...metadata, salt: e.target.value.replace(/[^0-9]/gi, '') })}
        value={metadata.salt}
        label="Salt (integer, at least 10 digits)"
        required
        minLength={10}
      />
      <Input
        containerStyle={{ marginTop: 8 }}
        style={{ width: 300 }}
        onChange={(e) => setMetadata({ ...metadata, decimals: e.target.value.replace(/[^0-9]/gi, '') })}
        value={metadata.decimals}
        label="Decimals (integer)"
        required
      />
      <Input
        containerStyle={{ marginTop: 8 }}
        style={{ width: 300 }}
        onChange={(e) => setMetadata({ ...metadata, supply: e.target.value.replace(/[^0-9]/gi, '') })}
        value={metadata.supply}
        label="Supply (integer)"
        required
      />
      <Input
        containerStyle={{ marginTop: 8 }}
        style={{ width: 300 }}
        onChange={(e) => setMetadata({ ...metadata, cap: e.target.value.replace(/[^0-9]/gi, '') })}
        value={metadata.cap}
        label="Cap (optional, integer)"
      />
      <Input
        label="Mintable"
        type="checkbox"
        containerStyle={{ width: 300, marginTop: 8, flexDirection: 'row', alignSelf: 'flex-start' }}
        onChange={(e) => setMetadata({ ...metadata, mintable: metadata.mintable ? '' : 't' }) }
        value={metadata.mintable}
        checked={Boolean(metadata.mintable)}
      />
      {Boolean(metadata.mintable) && <Input
        containerStyle={{ marginTop: 8 }}
        style={{ width: 300 }}
        onChange={(e) => setMetadata({ ...metadata, minters: e.target.value.replace(/[^0-9a-fA-Fx,]/gi, '') })}
        value={metadata.minters}
        label="Minters (comma-separated addresses)"
      />}
      <Input
        containerStyle={{ marginTop: 8 }}
        style={{ width: 300 }}
        onChange={(e) => setMetadata({ ...metadata, deployer: e.target.value.replace(/[^0-9a-fA-Fx]/gi, '') })}
        value={metadata.deployer}
        label="Deployer"
        required
      />
      {/* <Input
        containerStyle={{ marginTop: 8 }}
        style={{ width: 300 }}
        onChange={(e) => setMetadata({ ...metadata, salt: e.target.value.replace(/[^0-9a-fA-Fx]/gi, '') })}
        value={metadata.salt}
        label="salt"
        required
      /> */}
      <Button variant='dark' type="submit" style={{ margin: '16px 0px 8px', width: 240, justifyContent: 'center' }}>
        Next
      </Button>
    </Form>
  )
}