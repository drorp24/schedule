/** @jsxImportSource @emotion/react */
import { memo, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchRequests,
  selectEntities,
  selectEntityById,
} from '../../redux_new/requests'
import { selectSelectedEntities } from '../../redux/recommendations'
import { selectEntities as selectRuns } from '../../redux/runs'

import TooltipDetails from './RequestDetails'
import config from '../config'

import Table from '../Table'

import PinDropOutlinedIcon from '@material-ui/icons/PinDropOutlined'

const styles = {
  typeIcon: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '0 12px',
    // color: config.requests.color,
  },
  centered: {
    textAlign: 'center',
  },
}

const properties = [
  {
    name: 'location',
    rowStyle: styles.typeIcon,
    icon: <PinDropOutlinedIcon />,
  },
  { name: 'id' },
  { name: 'suppliers_category_id' },
  { name: 'score' },
]

const { requests: conf } = config

const Requests = () => {
  const { selectedId: runId } = useSelector(selectRuns)
  const { reqFulfilled } = useSelector(selectSelectedEntities)

  const [filter, setFilter] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    if (runId) dispatch(fetchRequests({ runId }))
  }, [dispatch, runId])

  useEffect(() => {
    setFilter(reqFulfilled)
  }, [reqFulfilled])

  return (
    <Table
      {...{
        selectEntities,
        selectEntityById,
        properties,
        filter,
        TooltipDetails,
        conf,
      }}
    />
  )
}

export default memo(Requests)
