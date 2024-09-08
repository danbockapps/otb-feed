import { Button, Dialog, DialogActions, DialogTitle, TextField, Typography } from '@mui/material'
import { FC, useState } from 'react'
import './add-player.scss'

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (id: string) => void
}

const AddPlayer: FC<Props> = (props) => {
  const [id, setId] = useState('')

  return (
    <Dialog open={props.open} onClose={props.onClose} className="add-player">
      <DialogTitle>Add Player</DialogTitle>
      <TextField
        className="id"
        label="USCF ID (usually 8-digit number)"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <Typography variant="body2">
        After adding players, bookmark this page in your browser to save your current player list.
      </Typography>

      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            props.onAdd(id)
            props.onClose()
            setId('')
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddPlayer
