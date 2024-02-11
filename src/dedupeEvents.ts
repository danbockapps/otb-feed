import { IEvent } from './App'

const dedupeEvents = (events: IEvent[]) =>
  events.reduce((acc, cur) => {
    const existingEvent = acc.find(e => e.info.id === cur.info.id)
    if (existingEvent) {
      existingEvent.performances.push(...cur.performances)
      return acc
    } else return [...acc, cur]
  }, [] as IEvent[])

export default dedupeEvents
