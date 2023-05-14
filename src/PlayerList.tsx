import { Typography } from '@mui/material'
import { FC } from 'react'

export interface Player {
  name: string
  id: string
}

interface Props {
  players: Player[]
}

const PlayerList: FC<Props> = props => {
  return (
    <>
      {props.players.map((p, i) => (
        <Typography key={i}>
          {p.id} {p.name}
        </Typography>
      ))}
    </>
  )
}

export default PlayerList
