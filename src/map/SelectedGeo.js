/** @jsxImportSource @emotion/react */
import { useEffect, useRef, memo } from 'react'
import { useSelector } from 'react-redux'
import { selectSelectedEntities } from '../redux/recommendations'
import { selectLocations as selectReqLocations } from '../redux/requests'

import { useMap, Polygon, Polyline, Marker, FeatureGroup } from 'react-leaflet'
import isEqual from 'lodash.isequal'

import { flyToOptions, dropIcon } from './config'

// https://github.com/PaulLeCam/react-leaflet/issues/453
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css' // Re-uses images from ~leaflet package
import * as L from 'leaflet'
import 'leaflet-defaulticon-compatibility'

const styles = {
  pathOptions: { color: 'deepskyblue' },
}

// ! Preventing unnecessary flyTo's with nasty shake effect
// This should be the go-to solution for the nasty shaking effect that's the result of flyingTo the same location:
// use a ref to keep previous selectedId and coordinates to supress flyTo when
// - repetitively selecting the same entity
// - selecting a different entity that has the very same coordinates (lodash isEqual to the rescue)
// If there are multiple reqLocations (e.g., polygon) whose bounds center happens to equal that of different ones,
// then nasty shaking is inevitable.
//

const SelectedGeo = () => {
  const map = useMap()
  const { selectedIds, reqDropPoints } = useSelector(selectSelectedEntities)
  const reqLocations = useSelector(selectReqLocations)
  const selectedRef = useRef()

  const locations = reqDropPoints?.length ? reqDropPoints : reqLocations

  const selectedId = selectedIds.length === 1 && selectedIds[0]
  const sameId = selectedId && selectedId === selectedRef.current?.selectedId
  const sameCoordinates =
    locations?.length < 3 && isEqual(locations, selectedRef.current?.locations)

  useEffect(() => {
    if (!map || !locations || !locations?.length || sameId || sameCoordinates)
      return

    selectedRef.current = { selectedId, locations }

    const locationPoints = locations.map(({ coordinates }) => [...coordinates])
    const locationBounds = L.latLngBounds(locationPoints)

    map.flyToBounds(locationBounds, flyToOptions)
  }, [map, locations, sameId, sameCoordinates, selectedId, selectedRef])

  const eventHandlers = {
    click: () => {
      // console.log(`${id} clicked`)
    },
  }
  const { pathOptions } = styles

  if (!locations?.length) return null

  return (
    <FeatureGroup>
      {locations.map(({ type, coordinates: positions, color }, index) => {
        switch (type) {
          case 'Polygon':
            return (
              <Polygon
                {...{ positions, eventHandlers, pathOptions }}
                key={`${selectedId}-${index}`}
              />
            )
          case 'Point':
            return (
              <Marker
                {...{ position: positions, eventHandlers, pathOptions }}
                key={`${selectedId}-${index}`}
                icon={dropIcon(color)}
              />
            )
          case 'LineString':
            return (
              <Polyline
                {...{ positions, eventHandlers, pathOptions }}
                key={`${selectedId}-${index}`}
              />
            )
          default:
            return (
              <Polygon
                {...{ positions, eventHandlers, pathOptions }}
                key={`${selectedId}-${index}`}
              />
            )
        }
      })}
    </FeatureGroup>
  )
}

export default memo(SelectedGeo)
