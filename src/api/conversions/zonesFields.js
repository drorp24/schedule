const zonesFields = ({ zone_id, points, ...rest }) => ({
  id: zone_id,
  geolocation: {
    geometry: {
      type: 'Polygon',
      coordinates: points,
    },
  },
  ...rest,
})

export default zonesFields
