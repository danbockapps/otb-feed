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
      href={`https://uschess.org/msa/XtblPlr.php?${props.eventId}-00${props.performance.section[0]}-${props.performance.id}`}
      target='_blank'
    >
      {props.performance[props.category]}
    </Link>
  </TableCell>
)

export default PerformanceRow
