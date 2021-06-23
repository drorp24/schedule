/** @jsxImportSource @emotion/react */
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import SelectedGeo from './SelectedGeo'
import ZonesControl from './ZonesControl'
import { selectSelectedEntities as selectSelectedRequests } from '../redux/requests'
import { selectSelectedEntities as selectSelectedDepots } from '../redux/depots'
import { selectSelectedEntities as selectSelectedZones } from '../redux/zones'
import { fetchDeliveryPlans } from '../redux/deliveryPlans'

import 'leaflet/dist/leaflet.css'
import {
  MapContainer,
  WMSTileLayer,
  LayersControl,
  ZoomControl,
} from 'react-leaflet'
import { tileProviders, locations } from './config'

import { useMode } from '../utility/appUtilities'
import { useRunId } from '../utility/appUtilities'

const styles = {
  map: {
    height: '100%',
    overflow: 'hidden',
  },
}

const Map = () => {
  console.log('Map is rendered')
  const { mode } = useMode()

  const runId = useRunId()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchDeliveryPlans({ runId }))
  }, [dispatch, runId])

  return (
    <MapContainer
      center={locations.home}
      zoom={11}
      scrollWheelZoom={false}
      css={styles.map}
      zoomControl={false}
    >
      <LayersControl position="bottomright">
        {tileProviders.map(({ name, checked, args, bestFor }) => (
          <LayersControl.BaseLayer
            {...{ name, checked: bestFor === mode }}
            key={name}
          >
            <WMSTileLayer {...{ ...args }} />
          </LayersControl.BaseLayer>
        ))}
      </LayersControl>
      <ZonesControl />
      <ZoomControl position="bottomleft" />
      <SelectedGeo selectSelectedEntities={selectSelectedRequests} />
      <SelectedGeo selectSelectedEntities={selectSelectedDepots} />
      <SelectedGeo selectSelectedEntities={selectSelectedZones} />
    </MapContainer>
  )
}

export default Map
