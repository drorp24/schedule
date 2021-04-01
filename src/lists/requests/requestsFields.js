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
  location,
  options: delivery_options.map(({ id, priority }) => ({ id, priority })),
})

export default requestsFields
