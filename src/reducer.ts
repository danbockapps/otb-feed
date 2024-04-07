import { Player } from './PlayerList'
import dedupeEvents from './dedupeEvents'

export interface Performance {
  id: string
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
  | { type: 'REMOVE_PLAYER'; payload: string }

export const reducer = (state: State, action: Action): State => {
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

    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.payload),
        events: state.events
          .map(e => ({
            ...e,
            performances: e.performances.filter(p => p.id !== action.payload),
          }))
          .filter(e => e.performances.length > 0),
      }

    default:
      return state
  }
}
