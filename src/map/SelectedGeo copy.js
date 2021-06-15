/** @jsxImportSource @emotion/react */
import { useEffect, useRef, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectSelectedEntities } from '../redux/recommendations'
import { fetchDeliveryPlans } from '../redux_new/deliveryPlans'
import { useRunId } from '../utility/appUtilities'

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

// ! Preventing flyTo's trembling effect
// Previous selectedId and coordinates (kept in ref) are compared to the current ones to prevent flyTo when:
// - repetitively selecting the same entity
// - selecting a different entity with identical coordinates (lodash isEqual to the rescue)
// - not yet handled: multiple reqLocations (e.g., polygon) whose bounds center is similar (not necessarily identical)
//   to the previous one.

// ToDo:
// - create 'selectSelectedEntities' for depots, zones and workPlan too
// - Map - call SelectedGeo 4 times: for requests, depots, zones and workPlan (rename it)
// - accept selectSelectedEntities from caller Map and extract drop poinhts or locations accordingly
const SelectedGeo = ({ fetchPlans = false, selectSelectedEntities }) => {
  console.log('SelectedGeo is rendered')
  const map = useMap()
  const selectedRef = useRef()
  const runId = useRunId()
  const dispatch = useDispatch()
  const {dropPoints: locations} = 
  // const locations = reqDropPoints?.length ? reqDropPoints : reqLocations

  const selectedId = selectedIds.length === 1 && selectedIds[0]
  const sameId = selectedId && selectedId === selectedRef.current?.selectedId
  const sameCoordinates = false
  // locations?.length < 5 && isEqual(locations, selectedRef.current?.locations)

  useEffect(() => {
    if (!fetchPlans) return
    dispatch(fetchDeliveryPlans({ runId }))
  }, [dispatch, fetchPlans, runId])

  const selectedRequests = useSelector(selectSelectedRequests)
  console.log('selectedRequests: ', selectedRequests)

  useEffect(() => {
    if (
      !map ||
      /* !locations ||  !locations?.length ||*/
      sameId ||
      sameCoordinates
    )
      return

    // selectedRef.current = { selectedId, locations }

    // const locationPoints = locations.map(({ coordinates }) => [...coordinates])
    // const locationBounds = L.latLngBounds(locationPoints)

    // map.flyToBounds(locationBounds, flyToOptions)
  }, [map, /* locations,  */ sameId, sameCoordinates, selectedId, selectedRef])

  const eventHandlers = {
    click: () => {
      // console.log(`${id} clicked`)
    },
  }
  const { pathOptions } = styles

  // if (!locations?.length) return null

  const locations = []

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
