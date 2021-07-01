/** @jsxImportSource @emotion/react */
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDeliveryPlans } from '../redux/deliveryPlans'
import { selectEntities as selectRuns } from '../redux/runs'

import ZonesControl from './ZonesControl'
import SelectedLocations from './SelectedLocations'

import 'leaflet/dist/leaflet.css'
import {
  MapContainer,
  WMSTileLayer,
  LayersControl,
  ZoomControl,
} from 'react-leaflet'
import { tileProviders, locations } from './config'

import { useMode } from '../utility/appUtilities'

const styles = {
  map: {
    height: '100%',
    overflow: 'hidden',
  },
}

const Map = () => {
  console.log('Map is rendered')
  const { mode } = useMode()

  const { selectedId: runId } = useSelector(selectRuns)
  const dispatch = useDispatch()

  useEffect(() => {
    if (runId) dispatch(fetchDeliveryPlans({ runId }))
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
      <SelectedLocations />
    </MapContainer>
  )
}

export default Map
