/** @jsxImportSource @emotion/react */
import { useEffect, memo } from 'react'
import { useSelector } from 'react-redux'

import { useMap, Polygon, Marker, FeatureGroup, Popup } from 'react-leaflet'
import farEnough from '../utility/farEnough'
import FeatureProperties from './FeatureProperties'
import usePopupContainerFix from './usePopupContainerFix'

import { flyToOptions, dropIcon } from './config'
import config from '../lists/config'
// https://github.com/PaulLeCam/react-leaflet/issues/453
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css' // Re-uses images from ~leaflet package
import * as L from 'leaflet'
import 'leaflet-defaulticon-compatibility'

const SelectedGeo = ({ selectSelectedEntities, entities }) => {
  console.log('SelectedGeo is rendered')
  const map = useMap()
  const { locations } = useSelector(selectSelectedEntities)

  useEffect(() => {
    if (!map || !locations?.length) return

    const locationPoints = locations.map(({ geometry: { coordinates } }) => [
      ...coordinates,
    ])
    const locationBounds = L.latLngBounds(locationPoints)
    const mapBounds = map.getBounds()

    if (farEnough(locationBounds, mapBounds))
      map.flyToBounds(locationBounds, flyToOptions)
  }, [map, locations])

  usePopupContainerFix()

  const styles = {
    pathOptions: { color: config[entities].color },

    popup: theme => ({
      '& .leaflet-popup-content': {
        margin: '1.5rem 1rem 2.5rem',
        position: 'relative',
      },
      '& .leaflet-popup-content-wrapper': {
        backgroundColor: theme.palette.background.paper,
        color: 'pink',
      },
      '& .leaflet-popup-tip': {
        backgroundColor: theme.palette.background.paper,
      },
    }),
  }
  const { pathOptions } = styles

  if (!locations?.length) return null

  return (
    <FeatureGroup>
      {locations.map(
        ({ geometry: { type, coordinates: positions }, properties }, index) => {
          const { color } = properties
          switch (type) {
            case 'Polygon':
              return (
                <Polygon {...{ positions, pathOptions }} key={index}>
                  <Popup direction="left" css={styles.popup}>
                    <FeatureProperties {...{ properties, entities }} />
                  </Popup>
                </Polygon>
              )
            case 'Point':
              return (
                <Marker
                  {...{ position: positions, pathOptions }}
                  key={index}
                  icon={dropIcon({ entities, color })}
                >
                  <Popup direction="left" css={styles.popup}>
                    <FeatureProperties {...{ properties, entities }} />
                  </Popup>
                </Marker>
              )
            default:
              return <Polygon {...{ positions, pathOptions }} key={index} />
          }
        }
      )}
    </FeatureGroup>
  )
}

export default memo(SelectedGeo)
