const depotsFields = ({ depot_id, location, ...rest }) => ({
  id: depot_id,
  geolocation: {
    geometry: { type: 'Point', coordinates: [location[1], location[0]] },
  },
  ...rest,
})

export default depotsFields
