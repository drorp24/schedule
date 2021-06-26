/** @jsxImportSource @emotion/react */
import { memo, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchRequests,
  selectEntities,
  selectEntityById,
  selectOne,
  selectMulti,
} from '../redux/requests'
import { selectSelectedEntities } from '../redux/deliveries'
import { selectEntities as selectRuns } from '../redux/runs'

import config from './config'

import Table from './Table'

const properties = [
  { name: 'priority' },
  { name: 'id', fn: id => id.slice(-7) },
]

const { requests: conf } = config

const Requests = () => {
  const { selectedId: runId } = useSelector(selectRuns)

  const [filter, setFilter] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    if (runId) dispatch(fetchRequests({ runId }))
  }, [dispatch, runId])

  return (
    <Table
      {...{
        selectOne,
        selectMulti,
        selectEntities,
        selectSelectedEntities,
        selectEntityById,
        properties,
        filter,
        conf,
      }}
    />
  )
}

export default memo(Requests)
