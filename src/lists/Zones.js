/** @jsxImportSource @emotion/react */
import { memo, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchZones,
  selectEntities,
  selectEntityById,
  selectOne,
  selectMulti,
  selectCriteria,
  selectCriteriaEntities,
  setCriteria,
  toggleFilter,
  toggleShowOnMap,
} from '../redux/zones'

import { selectEntities as selectRuns } from '../redux/runs'

import config from './config'

import Table from './Table'

const properties = [{ name: 'id' }]

const { zones: conf } = config

const Zones = () => {
  const { selectedId: runId } = useSelector(selectRuns)

  const dispatch = useDispatch()

  useEffect(() => {
    if (runId) dispatch(fetchZones({ runId }))
  }, [dispatch, runId])

  return (
    <Table
      {...{
        selectOne,
        selectMulti,
        selectEntities,
        selectCriteria,
        selectCriteriaEntities,
        setCriteria,
        toggleFilter,
        toggleShowOnMap,
        selectEntityById,
        properties,
        conf,
      }}
    />
  )
}

export default memo(Zones)
