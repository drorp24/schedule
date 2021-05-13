const parse = record => {
  // ToDo: desctructure argument once all fields have underscores
  const customer_delivery_plan_data = JSON.parse(
    record['customer delivery plan data']
  )

  const matched_status = record['matched status']
  const loading_docks_ids = JSON.parse(record.loading_docks_ids)
  const number_of_drones_in_formation = record['number of drones in formation']
  const recommendation_board_id = record['recommandation board id']
  const selected_option = record['selected option']
  const {
    data,
    drone_formation_id,
    drone_package_config_id,
    id: delivery_request_id,
    lat,
    lon,
    op_end_time,
    op_start_time,
    platform_id,
    score,
    single_op_id,
    suppliers_category_id,
  } = record

  const delivery_options = data.delivery_options?.map(({ id, priority }) => ({
    id,
    priority,
  }))

  return {
    request: {
      delivery_request_id,
      delivery_options,
      customer_delivery_plan_data,
      score,
      suppliers_category_id,
    },
    resource: {
      platform_id,
      loading_docks_ids,
    },
    match: {
      matched_status,
      single_op_id,
      op_start_time,
      op_end_time,
      recommendation_board_id,
      lat,
      lon,
      selected_option,
      drone_formation_id,
      number_of_drones_in_formation,
      drone_package_config_id,
    },
  }
}

const createEntities = data => {
  const recommendations = {}

  data.forEach(record => {
    const parsedRecord = parse(record)
    const {
      match: { single_op_id = 'None' },
      request: { delivery_request_id = 'None', customer_delivery_plan_data },
    } = parsedRecord

    recommendations[single_op_id] = recommendations[single_op_id] || {}
    recommendations[single_op_id][delivery_request_id] =
      recommendations[single_op_id][delivery_request_id] || {}
    const curPlans =
      recommendations[single_op_id][delivery_request_id].plans || []

    const updPlans = [...curPlans, customer_delivery_plan_data]
    recommendations[single_op_id][delivery_request_id].plans = updPlans
  })

  return recommendations
}

export default createEntities
