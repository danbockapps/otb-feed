import { useEffect, useReducer } from 'react'
import './App.scss'
import Event from './Event'

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

interface Action {
  type: 'ADD_PERFORMANCES'
  payload: IEvent[]
}

const reducer = (state: IEvent[], action: Action) => {
  switch (action.type) {
    case 'ADD_PERFORMANCES':
      const set = new Set(state.map(s => s.info.id))
      return [
        ...state.map(s => {
          const event = action.payload.find(
            e =>
              e.info.id === s.info.id &&
              !s.performances.some(ss => ss.name === e.performances[0].name),
          ) ?? { performances: [] }
          return { ...s, performances: [...s.performances, ...event.performances] }
        }),
        ...action.payload.filter(e => !set.has(e.info.id)),
      ]

    default:
      return state
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, [])
  console.log(state.length)

  useEffect(() => {
    ;['12911649', '12663913', '30094337'].forEach(n =>
      fetch(`https://cors-anywhere.herokuapp.com/http://www.uschess.org/msa/MbrDtlTnmtHst.php?${n}`)
        .then(r => r.text())
        .then(t => {
          const parser = new DOMParser()
          const doc = parser.parseFromString(t, 'text/html')
          const tables = doc.getElementsByTagName('table')
          const idAndName = tables[3].getElementsByTagName('b')[0].innerText

          const events: IEvent[] = Array.from(tables[6].getElementsByTagName('tr'))
            .slice(2)
            .map(tr => {
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
                    name: toUpperCamelCase(idAndName.split(':')[1].trim()),
                    section: getSmallText(eventAndSection.innerHTML),
                    reg: reg.innerHTML,
                    quick: quick.innerHTML,
                    blitz: blitz.innerHTML,
                  },
                ],
              }
            })

          console.log({ playerEvents: events })

          dispatch({ type: 'ADD_PERFORMANCES', payload: events })
        }),
    )
  }, [])

  return (
    <div className='App'>
      {state
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
