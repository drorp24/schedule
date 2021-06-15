/** @jsxImportSource @emotion/react */
import { memo, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchZones,
  selectEntities,
  selectEntityById,
  selectOne,
  selectMulti,
} from '../redux_new/zones'
import { selectSelectedEntities } from '../redux/recommendations'
import { selectEntities as selectRuns } from '../redux/runs'

import config from './config'

import Table from './Table'

const properties = [{ name: 'id' }]

const { zones: conf } = config

const Zones = () => {
  const { selectedId: runId } = useSelector(selectRuns)
  const { reqFulfilled } = useSelector(selectSelectedEntities)

  const [filter, setFilter] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    if (runId) dispatch(fetchZones({ runId }))
  }, [dispatch, runId])

  useEffect(() => {
    setFilter(reqFulfilled)
  }, [reqFulfilled])

  return (
    <Table
      {...{
        selectOne,
        selectMulti,
        selectEntities,
        selectEntityById,
        properties,
        filter,
        conf,
      }}
    />
  )
}

export default memo(Zones)
