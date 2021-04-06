/** @jsxImportSource @emotion/react */
import { memo, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchRequests,
  selectEntities,
  selectEntityById,
} from '../../redux/requests'
import { selectSelectedEntity } from '../../redux/recommendations'
import { selectEntities as selectRuns } from '../../redux/runs'

import requestsFields from './requestsFields'
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
    color: config.requests.color,
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
  console.log('Requests is rendered')
  const selectedRecommendation = useSelector(selectSelectedEntity)
  const { selectedId: runId } = useSelector(selectRuns)

  const [filter, setFilter] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    if (runId) dispatch(fetchRequests({ runId, requestsFields }))
  }, [dispatch, runId])

  useEffect(() => {
    if (!selectedRecommendation || !selectedRecommendation.fulfills?.length)
      return

    const fulfilled = {}

    selectedRecommendation.fulfills.forEach(
      ({ delivery_request_id, option_id }) => {
        // ToDo: there's no point in assigning option_id as there are multiple per request
        // a 'true' value or similar would be less confusing
        fulfilled[delivery_request_id] = option_id
      }
    )

    setFilter(fulfilled)
  }, [selectedRecommendation])

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
