const swap = ({ type, coordinates }) => ({
  type,
  coordinates: [coordinates[1], coordinates[0]],
})
const requestsFields = ({
  id,
  suppliers_category_id,
  update_time,
  start_time,
  end_time,
  score,
  location,
  data: { delivery_options },
}) => ({
  id,
  suppliers_category_id,
  update_time,
  start_time,
  end_time,
  score,
  location: swap(JSON.parse(location)),
  options: delivery_options.map(({ id, priority }) => ({ id, priority })),
})

export default requestsFields
