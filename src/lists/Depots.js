/** @jsxImportSource @emotion/react */
import { memo, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchDepots,
  selectEntities,
  selectEntityById,
  selectOne,
  selectMulti,
  selectCriteria,
  selectCriteriaEntities,
  setCriteria,
  toggleFilter,
  toggleShowOnMap,
} from '../redux/depots'
import { selectEntities as selectRuns } from '../redux/runs'

import config from './config'

import Table from './Table'

const properties = [{ name: 'id' }, { name: 'drone_type' }]

const { depots: conf } = config

const Depots = () => {
  const { selectedId: runId } = useSelector(selectRuns)

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
        selectCriteria,
        selectCriteriaEntities,
        setCriteria,
        toggleFilter,
        toggleShowOnMap,
        properties,
        conf,
      }}
    />
  )
}

export default memo(Depots)
