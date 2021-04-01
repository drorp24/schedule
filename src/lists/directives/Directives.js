/** @jsxImportSource @emotion/react */
import { memo, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  fetchDirectives,
  selectEntities,
  selectEntityById,
} from '../../redux/directives'

import directivesFields from '../directives/directivesFields'
import TooltipDetails from '../directives/DirectiveDetails'
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
    color: config.directives.color,
  },
  centered: {
    textAlign: 'center',
  },
}

const properties = [
  { name: 'id' },
  { name: 'customer_delivery_unit_id' },
  {
    name: 'dangerZones',
    rowStyle: styles.typeIcon,
    icon: <PinDropOutlinedIcon />,
  },
  {
    name: 'flightDistricts',
    rowStyle: styles.typeIcon,
    icon: <PinDropOutlinedIcon />,
  },
]

const { directives: conf } = config

const Directives = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchDirectives({ directivesFields }))
  }, [dispatch])

  return (
    <Table
      {...{
        selectEntities,
        selectEntityById,
        properties,
        TooltipDetails,
        conf,
      }}
    />
  )
}

export default memo(Directives)
