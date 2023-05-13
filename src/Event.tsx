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
import { IEvent } from './App'
import './event.scss'

interface Props {
  event: IEvent
}

const Event: FC<Props> = props => {
  const regExists = props.event.performances.some(p => p.reg !== '&nbsp;')
  const quickExists = props.event.performances.some(p => p.quick !== '&nbsp;')
  const blitzExists = props.event.performances.some(p => p.blitz !== '&nbsp;')

  return (
    <Paper className='event'>
      <Typography variant='body2' className='date'>
        {props.event.info.date}
      </Typography>
      <Typography variant='h6'>
        {listNames(props.event.performances.map(p => p.name))} attended{' '}
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
                <TableCell align='center' dangerouslySetInnerHTML={{ __html: p.reg }} />
              )}
              {quickExists && (
                <TableCell align='center' dangerouslySetInnerHTML={{ __html: p.quick }} />
              )}
              {blitzExists && (
                <TableCell align='center' dangerouslySetInnerHTML={{ __html: p.blitz }} />
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
