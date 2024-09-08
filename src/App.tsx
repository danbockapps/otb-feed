import { Button, LinearProgress, Typography } from '@mui/material'
import { useEffect, useReducer, useState } from 'react'
import AddPlayer from './AddPlayer'
import './App.scss'
import Event from './Event'
import PlayerList from './PlayerList'
import getData from './getData'
import getUrlPlayers from './getUrlPlayers'
import { reducer } from './reducer'

function App() {
  const [state, dispatch] = useReducer(reducer, { events: [], players: [] })
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  console.log({ state })

  useEffect(() => {
    const urlPlayerIds = getUrlPlayers()

    if (!urlPlayerIds?.length) {
      document.location.href = `?players=${localStorage.getItem('players') ?? '12892910,16754590,12900032,14821464,12939342'}`
    } else {
      setLoading(true)
      const uniqueIds = [...new Set(urlPlayerIds)]
      localStorage.setItem('players', uniqueIds.join(','))

      Promise.all(
        uniqueIds.map((id) =>
          getData(id).then(({ name, events }) => {
            dispatch({ type: 'ADD_PLAYER', payload: { id, name } })
            dispatch({ type: 'ADD_PERFORMANCES', payload: events })
          }),
        ),
      ).finally(() => setLoading(false))
    }
  }, [])

  const getProgressPct = () => {
    const urlPlayerIds = getUrlPlayers()
    return urlPlayerIds?.length ? state.players.length / urlPlayerIds.length : 0
  }

  return (
    <div className="App">
      <Typography className="title" variant="h6">
        ♟ OTB Feed ♟
      </Typography>

      <Typography className="subhed" variant="body2">
        Now showing USCF events for:
      </Typography>

      <PlayerList
        players={state.players}
        onDelete={(id) => {
          dispatch({ type: 'REMOVE_PLAYER', payload: id })

          const newPlayers = state.players
            .filter((p) => p.id !== id)
            .map((p) => p.id)
            .join(',')

          localStorage.setItem('players', newPlayers)
          window.history.replaceState(null, '', `?players=${newPlayers}`)
        }}
      />

      <div className={`progress-container ${loading ? '' : ' add-player-button-container'}`}>
        {loading ? (
          <LinearProgress variant="determinate" value={getProgressPct()} />
        ) : (
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Player
          </Button>
        )}
      </div>

      <AddPlayer
        open={open}
        onClose={() => setOpen(false)}
        onAdd={(id) => {
          if (!state.players.some((p) => p.id === id)) {
            const newPlayers = [...state.players.map((p) => p.id), id].join(',')
            localStorage.setItem('players', newPlayers)
            window.history.replaceState(null, '', `?players=${newPlayers}`)

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
