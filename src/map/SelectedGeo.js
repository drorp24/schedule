/** @jsxImportSource @emotion/react */
import { useEffect, useRef, memo } from 'react'
import { useSelector } from 'react-redux'
import {
  selectSelectedId,
  selectSelectedEntity,
  selectSelectedLocations,
} from '../redux/recommendations'

import { useMap, Polygon, Polyline, Marker, FeatureGroup } from 'react-leaflet'
import isEqual from 'lodash.isequal'

import { flyToOptions } from './config'

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
// If there are multiple locations (e.g., polygon) whose bounds center happens to equal that of different ones,
// then nasty shaking is inevitable.
//
const SelectedGeo = () => {
  const map = useMap()
  const selectedId = useSelector(selectSelectedId)
  const selectedEntity = useSelector(selectSelectedEntity)
  const locations = useSelector(selectSelectedLocations)

  const selectedRef = useRef()
  const sameId = selectedId === selectedRef.current?.selectedId
  const sameCoordinates = isEqual(locations, selectedRef.current?.locations)

  useEffect(() => {
    if (
      !map ||
      !selectedId ||
      !selectedEntity ||
      !locations?.length ||
      sameId ||
      sameCoordinates
    )
      return

    selectedRef.current = { selectedId: selectedId, locations }

    const locationPoints = locations.map(({ coordinates }) => [...coordinates])
    const locationBounds = L.latLngBounds(locationPoints)

    map.flyToBounds(locationBounds, flyToOptions)
  }, [map, selectedId, selectedEntity, locations, sameCoordinates, sameId])

  const eventHandlers = {
    click: () => {
      // console.log(`${id} clicked`)
    },
  }
  const { pathOptions } = styles

  if (!locations?.length) return null

  console.log(
    'coordinates, #, equal?',
    locations.map(({ coordinates }) => ({ coordinates })),
    locations.length,
    locations.length === 2 && isEqual(locations[0], locations[1])
  )

  return (
    <FeatureGroup>
      {locations.map(({ type, coordinates: positions }, index) => {
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
