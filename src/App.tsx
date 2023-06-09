import { useEffect, useReducer } from 'react'
import './App.scss'
import Event from './Event'
import PlayerList, { Player } from './PlayerList'
import { Typography } from '@mui/material'

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
          ...action.payload.filter(e => !set.has(e.info.id)),
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
  console.log({ state })

  useEffect(() => {
    ;[...new Set(new URLSearchParams(window.location.search).get('players')?.split(','))].forEach(
      id =>
        fetch(`https://danbock.net/uschess-proxy?${id}`)
          .then(r => r.text())
          .then(t => {
            const parser = new DOMParser()
            const doc = parser.parseFromString(t, 'text/html')
            const tables = doc.getElementsByTagName('table')
            const idAndName = tables[3].getElementsByTagName('b')[0].innerText

            const name = toUpperCamelCase(idAndName.split(':')[1].trim())

            dispatch({ type: 'ADD_PLAYER', payload: { name, id } })

            const rows = Array.from(tables[6].getElementsByTagName('tr'))
            const headerRow = rows.findIndex(r => r.innerHTML.includes('Event ID'))

            const events: IEvent[] = rows.slice(headerRow + 1).map(tr => {
              const [dateAndId, eventAndSection, reg, quick, blitz] = Array.from(
                tr.getElementsByTagName('td'),
              )

              return {
                info: {
                  date: getUpperRow(dateAndId.innerHTML),
                  id: getSmallText(dateAndId.innerHTML),
                  name: eventAndSection.innerHTML.substring(
                    eventAndSection.innerHTML.indexOf('>') + 1,
                    eventAndSection.innerHTML.indexOf('<', 1),
                  ),
                },
                performances: [
                  {
                    name,
                    section: getSmallText(eventAndSection.innerHTML),
                    reg: reg.innerHTML,
                    quick: quick.innerHTML,
                    blitz: blitz.innerHTML,
                  },
                ],
              }
            })

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

const getUpperRow = (html: string) => html.substring(0, html.indexOf('<br>'))
const getSmallText = (html: string) =>
  html.substring(html.indexOf('<small>') + 7, html.indexOf('</small>')).trim()

const toUpperCamelCase = (s: string) =>
  s
    .split(' ')
    .map(w => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')

export default App
