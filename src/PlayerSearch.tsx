import { Button, Dialog, TextField } from '@mui/material'
import { FC, useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

const AddPlayer: FC<Props> = props => {
  const [id, setId] = useState('')

  return (
    <Dialog {...props}>
      <TextField
        label='USCF ID (usually 8-digit number)'
        value={id}
        onChange={e => setId(e.target.value)}
      />
      <Button onClick={() => {}}>Add</Button>
    </Dialog>
  )
}

export default AddPlayer
