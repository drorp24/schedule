/** @jsxImportSource @emotion/react */
import { useEffect, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectSelectedEntities } from '../redux/recommendations'

import { fetchDeliveryPlans } from '../redux_new/deliveryPlans'
import { useRunId } from '../utility/appUtilities'

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

const SelectedGeo = ({ fetchPlans = false, selectSelectedEntities }) => {
  console.log('SelectedGeo is rendered')
  const map = useMap()
  const runId = useRunId()
  const dispatch = useDispatch()
  const { locations } = useSelector(selectSelectedEntities)

  useEffect(() => {
    if (fetchPlans) dispatch(fetchDeliveryPlans({ runId }))
  }, [dispatch, fetchPlans, runId])

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

  const eventHandlers = {
    click: () => {
      // console.log(`${id} clicked`)
    },
  }
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
              return (
                <Polygon
                  {...{ positions, eventHandlers, pathOptions }}
                  key={index}
                />
              )
            case 'Point':
              console.log('Point. positions: ', positions)
              return (
                <Marker
                  {...{ position: positions, eventHandlers, pathOptions }}
                  key={index}
                  icon={dropIcon(color)}
                />
              )
            default:
              return (
                <Polygon
                  {...{ positions, eventHandlers, pathOptions }}
                  key={index}
                />
              )
          }
        }
      )}
    </FeatureGroup>
  )
}

export default memo(SelectedGeo)
