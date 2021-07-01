/** @jsxImportSource @emotion/react */
import { Polygon, Marker, FeatureGroup, Popup } from 'react-leaflet'
import FeatureProperties from './FeatureProperties'
import { dropIcon } from './config'
import config from '../lists/config'

const EntitiesLocations = ({ entities, locations }) => {
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

export default EntitiesLocations
