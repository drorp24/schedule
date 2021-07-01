/** @jsxImportSource @emotion/react */
import { useEffect, memo, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectSelectedEntities as selectSelectedRequests } from '../redux/requests'
import { selectSelectedEntities as selectSelectedDepots } from '../redux/depots'
import { selectSelectedEntities as selectSelectedZones } from '../redux/zones'
import { selectSelectedEntities as selectSelectedDeliveries } from '../redux/deliveries'

import { useMap } from 'react-leaflet'
import farEnough from '../utility/farEnough'
import usePopupContainerFix from './usePopupContainerFix'
import EntitiesLocations from './EntitiesLocations'

import { flyToOptions } from './config'
// https://github.com/PaulLeCam/react-leaflet/issues/453
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css' // Re-uses images from ~leaflet package
import * as L from 'leaflet'
import 'leaflet-defaulticon-compatibility'

const SelectedLocations = () => {
  console.log('SelectedLocations is rendered')
  const map = useMap()

  const { locations: requestsLocations } = useSelector(selectSelectedRequests)
  const { locations: depotsLocations } = useSelector(selectSelectedDepots)
  const { locations: zonesLocations } = useSelector(selectSelectedZones)
  const { locations: deliveriesLocations } = useSelector(
    selectSelectedDeliveries
  )

  const locations = useMemo(
    () => [
      ...requestsLocations,
      ...depotsLocations,
      ...zonesLocations,
      ...deliveriesLocations,
    ],
    [deliveriesLocations, depotsLocations, requestsLocations, zonesLocations]
  )

  const entitiesLocations = [
    { entities: 'requests', locations: requestsLocations, key: 'requests' },
    { entities: 'depots', locations: depotsLocations, key: 'depots' },
    { entities: 'zones', locations: zonesLocations, key: 'zones' },
    { entities: 'requests', locations: deliveriesLocations, key: 'deliveries' },
  ]

  useEffect(() => {
    if (!map || !locations?.length) return

    const locationPoints = locations.map(({ geometry: { coordinates } }) => [
      ...coordinates,
    ])
    const locationBounds = L.latLngBounds(locationPoints)
    const mapBounds = map.getBounds()

    if (farEnough(locationBounds, mapBounds)) {
      map.flyToBounds(locationBounds, flyToOptions)
    }
  }, [map, locations])

  usePopupContainerFix()

  return (
    <>
      {entitiesLocations.map(({ entities, locations, key }) => (
        <EntitiesLocations {...{ entities, locations }} key={key} />
      ))}
    </>
  )
}

export default memo(SelectedLocations)
