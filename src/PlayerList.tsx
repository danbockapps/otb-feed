import { Chip } from '@mui/material'
import { FC } from 'react'
import './player-list.scss'

export interface Player {
  name: string
  id: string
}

interface Props {
  players: Player[]
}

const PlayerList: FC<Props> = props => {
  return (
    <div className='player-list'>
      {props.players.map((p, i) => (
        <Chip className='player-chip' size='small' label={`${p.id} ${p.name}`} key={i} />
      ))}
    </div>
  )
}

export default PlayerList
