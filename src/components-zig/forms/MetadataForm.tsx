import { RawMetadata } from "../../types/ziggurat/Metadata"
import Button from "../../components/form/Button"
import Form from "../../components/form/Form"
import Input from "../../components/form/Input"
import { ListInput } from "../../components/form/ListInput"

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
        maxLength={60}
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
        label="Salt (integer)"
        maxLength={20}
        required
      />
      {/* {metadata.decimals !== undefined && (
        <Input
          containerStyle={{ marginTop: 8 }}
          style={{ width: 300 }}
          onChange={(e) => setMetadata({ ...metadata, decimals: e.target.value.replace(/[^0-9]/gi, '') })}
          value={metadata.decimals}
          label="Decimals (integer)"
          maxLength={2}
          required
        />
      )} */}
      {metadata.properties !== undefined && (
        <ListInput
          containerStyle={{ marginTop: 8 }}
          label="Properties (text)"
          values={metadata.properties}
          setValues={(values: string[]) => setMetadata({ ...metadata, properties: values })}
        />
      )}
      {/* <Input
        containerStyle={{ marginTop: 8 }}
        style={{ width: 300 }}
        onChange={(e) => setMetadata({ ...metadata, supply: e.target.value.replace(/[^0-9]/gi, '') })}
        value={metadata.supply}
        label="Supply (integer)"
        maxLength={15}
        required
      />
      <Input
        containerStyle={{ marginTop: 8 }}
        style={{ width: 300 }}
        onChange={(e) => setMetadata({ ...metadata, cap: e.target.value.replace(/[^0-9]/gi, '') })}
        value={metadata.cap}
        label="Cap (optional, integer, must be >= supply)"
      />
      <Input
        label="Mintable"
        type="checkbox"
        containerStyle={{ width: 300, marginTop: 8, flexDirection: 'row', alignSelf: 'flex-start' }}
        onChange={(e) => setMetadata({ ...metadata, mintable: metadata.mintable ? '' : 't' }) }
        value={metadata.mintable}
        checked={Boolean(metadata.mintable)}
      />
      {Boolean(metadata.mintable) && (
        <ListInput
          containerStyle={{ marginTop: 8 }}
          label="Minters (addresses)"
          values={metadata.minters}
          setValues={(values: string[]) => setMetadata({ ...metadata, minters: values })}
        />
      )}
      <Input
        containerStyle={{ marginTop: 8 }}
        style={{ width: 300 }}
        onChange={(e) => setMetadata({ ...metadata, deployer: e.target.value.replace(/[^0-9a-fA-Fx]/gi, '') })}
        value={metadata.deployer}
        label="Deployer"
        required
      /> */}
      <Button variant='dark' type="submit" style={{ margin: '16px 0px 8px', width: '100%', justifyContent: 'center' }}>
        Next
      </Button>
    </Form>
  )
}