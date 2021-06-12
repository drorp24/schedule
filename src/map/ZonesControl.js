/** @jsxImportSource @emotion/react */
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchZones, selectEntities } from '../redux/zones'
import { useRunId } from '../utility/appUtilities'

import { LayersControl, Popup, Polygon } from 'react-leaflet'

const ZonesControl = () => {
  const { loaded, sortedEntities } = useSelector(selectEntities)
  const dispatch = useDispatch()
  const runId = useRunId()

  useEffect(() => {
    if (runId) dispatch(fetchZones({ runId }))
  }, [dispatch, runId])

  if (!loaded) return null

  return (
    <LayersControl>
      {sortedEntities.map(({ id, positions }) => (
        <LayersControl.Overlay name={id}>
          <Polygon {...{ positions }}>
            <Popup>{id}</Popup>
          </Polygon>
        </LayersControl.Overlay>
      ))}
    </LayersControl>
  )
}

export default ZonesControl
