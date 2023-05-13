import { Paper, Typography } from '@mui/material'
import { FC } from 'react'
import { IEvent } from './App'
import './event.css'

interface Props {
  event: IEvent
}

const Event: FC<Props> = props => {
  const { event } = props
  return (
    <Paper className='event'>
      <Typography variant='body2' className='date'>
        {event.info.date}
      </Typography>
      <Typography variant='h6'>
        {listNames(event.performances.map(p => p.name))} attended {event.info.name}
      </Typography>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Section</th>
            <th>Reg</th>
            <th>Quick</th>
            <th>Blitz</th>
          </tr>
        </thead>
        <tbody>
          {event.performances.map((p, i) => (
            <tr key={i}>
              <td>{p.name}</td>
              <td>{p.section}</td>
              <td dangerouslySetInnerHTML={{ __html: p.reg }} />
              <td dangerouslySetInnerHTML={{ __html: p.quick }} />
              <td dangerouslySetInnerHTML={{ __html: p.blitz }} />
            </tr>
          ))}
        </tbody>
      </table>
    </Paper>
  )
}

const listNames = (names: string[]) => {
  switch (names.length) {
    case 1:
      return names[0]
    case 2:
      return `${names[0]} and ${names[1]}`
    default:
      return `${names.slice(0, -1).join(', ')}, and ${names.slice(-1)}`
  }
}

export default Event
