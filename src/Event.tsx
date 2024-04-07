import {
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { FC } from 'react'
import PerformanceRow from './PerformanceRow'
import './event.scss'
import { IEvent } from './reducer'

interface Props {
  event: IEvent
}

const Event: FC<Props> = props => {
  const regExists = props.event.performances.some(p => p.reg)
  const quickExists = props.event.performances.some(p => p.quick)
  const blitzExists = props.event.performances.some(p => p.blitz)

  return (
    <Paper className='event'>
      <Typography variant='body2' className='date'>
        {props.event.info.date}
      </Typography>

      <Typography variant='h6'>
        {listNames(props.event.performances.map(p => p.name))} played in{' '}
        <Link
          underline='hover'
          href={`https://www.uschess.org/msa/XtblMain.php?${props.event.info.id
            .replace('**', '')
            .trim()}.0`}
          target='_blank'
          dangerouslySetInnerHTML={{ __html: props.event.info.name }}
        />
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            {regExists && <TableCell align='center'>Reg</TableCell>}
            {quickExists && <TableCell align='center'>Quick</TableCell>}
            {blitzExists && <TableCell align='center'>Blitz</TableCell>}
          </TableRow>
        </TableHead>

        <TableBody>
          {props.event.performances.map((p, i) => (
            <TableRow key={i}>
              <TableCell>
                {p.name}
                <br />
                <Typography variant='caption'>{p.section}</Typography>
              </TableCell>

              {regExists && (
                <PerformanceRow performance={p} category='reg' eventId={props.event.info.id} />
              )}

              {quickExists && (
                <PerformanceRow performance={p} category='quick' eventId={props.event.info.id} />
              )}

              {blitzExists && (
                <PerformanceRow performance={p} category='blitz' eventId={props.event.info.id} />
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

const listNames = (names: string[]) => {
  const deduped = Array.from(new Set(names))
  switch (deduped.length) {
    case 1:
      return deduped[0]
    case 2:
      return `${deduped[0]} and ${deduped[1]}`
    case 3:
      return `${deduped.slice(0, -1).join(', ')}, and ${deduped.slice(-1)}`
    default:
      return `${deduped.length} players`
  }
}

export default Event
