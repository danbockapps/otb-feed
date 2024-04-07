import { Button, CircularProgress, Typography } from '@mui/material'
import { useEffect, useReducer, useState } from 'react'
import AddPlayer from './AddPlayer'
import './App.scss'
import Event from './Event'
import PlayerList from './PlayerList'
import getData from './getData'
import { reducer } from './reducer'

function App() {
  const [state, dispatch] = useReducer(reducer, { events: [], players: [] })
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  console.log({ state })

  useEffect(() => {
    ;[...new Set(new URLSearchParams(window.location.search).get('players')?.split(','))].forEach(
      id =>
        getData(id).then(({ name, events }) => {
          dispatch({ type: 'ADD_PLAYER', payload: { id, name } })
          dispatch({ type: 'ADD_PERFORMANCES', payload: events })
        }),
    )
  }, [])

  return (
    <div className='App'>
      <Typography className='title' variant='h6'>
        ♟ OTB Feed ♟
      </Typography>

      <Typography className='subhed' variant='body2'>
        Now showing USCF events for:
      </Typography>

      <PlayerList
        players={state.players}
        onDelete={id => {
          dispatch({ type: 'REMOVE_PLAYER', payload: id })
          window.history.replaceState(
            null,
            '',
            `?players=${state.players
              .filter(p => p.id !== id)
              .map(p => p.id)
              .join(',')}`,
          )
        }}
      />

      <div className='add-player-button-container'>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button variant='contained' onClick={() => setOpen(true)}>
            Add Player
          </Button>
        )}
      </div>

      <AddPlayer
        open={open}
        onClose={() => setOpen(false)}
        onAdd={id => {
          if (!state.players.some(p => p.id === id)) {
            window.history.replaceState(
              null,
              '',
              `?players=${state.players.map(p => p.id).join(',')},${id}`,
            )

            setLoading(true)

            getData(id)
              .then(({ name, events }) => {
                dispatch({ type: 'ADD_PLAYER', payload: { id, name } })
                dispatch({ type: 'ADD_PERFORMANCES', payload: events })
              })
              .finally(() => setLoading(false))
          }
        }}
      />

      {[...state.events]
        .sort((a, b) => (a.info.date > b.info.date ? -1 : 1))
        .map((event, i) => (
          <Event key={i} event={event} />
        ))}
    </div>
  )
}

export default App
