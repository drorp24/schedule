const requestsFields = ({
  id,
  supplier_category,
  update_time,
  start_time,
  end_time,
  score,
  location,
  data: { delivery_options },
}) => ({
  id,
  supplier_category,
  update_time,
  start_time,
  end_time,
  score,
  location,
  options: delivery_options.map(({ id, priority }) => ({ id, priority })),
})

export default requestsFields
