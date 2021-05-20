/** @jsxImportSource @emotion/react */
import { memo, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchResources,
  selectEntities,
  selectEntityById,
} from '../../redux/resources'
import { selectSelectedEntities } from '../../redux/recommendations'
import { selectEntities as selectRuns } from '../../redux/runs'

import resourcesFields from '../resources/resourcesFields'
import TooltipDetails from '../resources/ResourceDetails'
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
    // color: config.resources.color,
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
  { name: 'name' },
  { name: 'drone_type' },
]

const { resources: conf } = config

const Resources = () => {
  const { selectedId: runId } = useSelector(selectRuns)
  const { resEmployed } = useSelector(selectSelectedEntities)

  const [filter, setFilter] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    if (runId) dispatch(fetchResources({ runId, resourcesFields }))
  }, [dispatch, runId])

  useEffect(() => {
    setFilter(resEmployed)
  }, [resEmployed])

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

export default memo(Resources)
