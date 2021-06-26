/** @jsxImportSource @emotion/react */
import { memo, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchDepots,
  selectEntities,
  selectEntityById,
  selectOne,
  selectMulti,
} from '../redux/depots'
import { selectSelectedEntities } from '../redux/deliveries'
import { selectEntities as selectRuns } from '../redux/runs'

import config from './config'

import Table from './Table'

const properties = [{ name: 'id' }, { name: 'drone_type' }]

const { depots: conf } = config

const Depots = () => {
  const { selectedId: runId } = useSelector(selectRuns)

  const [filter, setFilter] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    if (runId) dispatch(fetchDepots({ runId }))
  }, [dispatch, runId])

  return (
    <Table
      {...{
        selectOne,
        selectMulti,
        selectEntities,
        selectEntityById,
        selectSelectedEntities,
        properties,
        filter,
        conf,
      }}
    />
  )
}

export default memo(Depots)
