import { Typography } from '@mui/material'
import { useEffect, useReducer } from 'react'
import './App.scss'
import Event from './Event'
import PlayerList, { Player } from './PlayerList'
import dedupeEvents from './dedupeEvents'
import getData from './getData'

export interface Performance {
  name: string
  section: string
  reg: string
  quick: string
  blitz: string
}

export interface EventInfo {
  date: string
  id: string
  name: string
}

export interface IEvent {
  info: EventInfo
  performances: Performance[]
}

interface State {
  events: IEvent[]
  players: Player[]
}

type Action =
  | { type: 'ADD_PERFORMANCES'; payload: IEvent[] }
  | { type: 'ADD_PLAYER'; payload: Player }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_PERFORMANCES':
      const set = new Set(state.events.map(s => s.info.id))

      return {
        ...state,
        events: [
          ...state.events.map(s => {
            const events = action.payload.filter(
              e =>
                e.info.id === s.info.id &&
                !s.performances.some(
                  ss =>
                    ss.name === e.performances[0].name && ss.section === e.performances[0].section,
                ),
            )
            return {
              ...s,
              performances: [...s.performances, ...events.flatMap(e => e.performances)].sort(
                (a, b) =>
                  a.section === b.section
                    ? a.name > b.name
                      ? 1
                      : -1
                    : a.section > b.section
                    ? 1
                    : -1,
              ),
            }
          }),

          // Events that are not yet in state
          ...dedupeEvents(action.payload.filter(e => !set.has(e.info.id))),
        ],
      }

    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.payload] }

    default:
      return state
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, { events: [], players: [] })

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
        Edit URL to add/remove players.
        <br />
        Now showing USCF events for:
      </Typography>
      <PlayerList players={state.players} />

      {state.events
        .sort((a, b) => (a.info.date > b.info.date ? -1 : 1))
        .map((event, i) => (
          <Event key={i} event={event} />
        ))}
    </div>
  )
}

export default App
