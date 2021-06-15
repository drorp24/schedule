/** @jsxImportSource @emotion/react */

import SelectedGeo from './SelectedGeo'
import ZonesControl from './ZonesControl'
import { selectSelectedEntities as selectSelectedRequests } from '../redux_new/requests'
import { selectSelectedEntities as selectSelectedDepots } from '../redux_new/depots'
import { selectSelectedEntities as selectSelectedZones } from '../redux_new/zones'

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
  const { mode } = useMode()
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
      <SelectedGeo fetchPlans selectSelectedEntities={selectSelectedRequests} />
      <SelectedGeo selectSelectedEntities={selectSelectedDepots} />
      <SelectedGeo selectSelectedEntities={selectSelectedZones} />
    </MapContainer>
  )
}

export default Map
