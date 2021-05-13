/** @jsxImportSource @emotion/react */
import { memo, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchResources,
  selectEntities,
  selectEntityById,
} from '../../redux/resources'
import { selectSelectedEntity } from '../../redux/recommendations'
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
    color: config.resources.color,
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
  const selectedRecommendation = useSelector(selectSelectedEntity)
  const { sortedEntities } = useSelector(selectEntities)
  const { selectedId: runId } = useSelector(selectRuns)

  const [filter, setFilter] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    if (runId) dispatch(fetchResources({ runId, resourcesFields }))
  }, [dispatch, runId])

  useEffect(() => {
    if (!selectedRecommendation || !selectedRecommendation.employs) return

    const { platform_id, drone_package_config_id } = selectedRecommendation

    const employed = {}

    // ToDo: no foreign key from recommendation into resources
    // the following is merely a guesswork:

    sortedEntities.forEach(
      ({ id, drone_loading_dock: { name, drone_type } }) => {
        if (`${name}-${drone_type}` === platform_id)
          employed[id] = drone_package_config_id
      }
    )

    setFilter(employed)
  }, [selectedRecommendation, sortedEntities])

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
