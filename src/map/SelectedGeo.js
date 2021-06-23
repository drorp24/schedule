/** @jsxImportSource @emotion/react */
import { useEffect, memo } from 'react'
import { useSelector } from 'react-redux'

import { useMap, Polygon, Marker, FeatureGroup } from 'react-leaflet'
import farEnough from '../utility/farEnough'

import { flyToOptions, dropIcon } from './config'

// https://github.com/PaulLeCam/react-leaflet/issues/453
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css' // Re-uses images from ~leaflet package
import * as L from 'leaflet'
import 'leaflet-defaulticon-compatibility'

const styles = {
  pathOptions: { color: 'deepskyblue' },
}

const SelectedGeo = ({ selectSelectedEntities }) => {
  console.log('SelectedGeo is rendered')
  const map = useMap()
  const { locations } = useSelector(selectSelectedEntities)

  useEffect(() => {
    if (!map || !locations?.length) return

    const locationPoints = locations.map(
      ({
        geolocation: {
          geometry: { coordinates },
        },
      }) => [...coordinates]
    )
    const locationBounds = L.latLngBounds(locationPoints)
    const mapBounds = map.getBounds()

    if (farEnough(locationBounds, mapBounds))
      map.flyToBounds(locationBounds, flyToOptions)
  }, [map, locations])

  const { pathOptions } = styles

  if (!locations?.length) return null

  return (
    <FeatureGroup>
      {locations.map(
        (
          {
            geolocation: {
              geometry: { type, coordinates: positions, color },
            },
          },
          index
        ) => {
          switch (type) {
            case 'Polygon':
              return <Polygon {...{ positions, pathOptions }} key={index} />
            case 'Point':
              return (
                <Marker
                  {...{ position: positions, pathOptions }}
                  key={index}
                  icon={dropIcon(color)}
                />
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
