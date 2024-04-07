import { FC } from 'react'
import { Performance } from './reducer'
import { Link, TableCell } from '@mui/material'

interface Props {
  performance: Performance
  category: 'reg' | 'quick' | 'blitz'
  eventId: string
}

const PerformanceRow: FC<Props> = props => (
  <TableCell align='center'>
    <Link
      href={getUscfUrl(props.eventId, props.performance.section, props.performance.id)}
      target='_blank'
    >
      {props.performance[props.category]}
    </Link>
  </TableCell>
)

// Replace is used to remove non-numeric characters from the eventId
const getUscfUrl = (eventId: string, section: string, id: string) =>
  `https://uschess.org/msa/XtblPlr.php?${eventId.replace(/\D/g, '')}-00${section[0]}-${id}`

export default PerformanceRow
