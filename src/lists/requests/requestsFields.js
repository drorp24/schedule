const swap = ({ type, coordinates }) => ({
  type,
  coordinates: [coordinates[1], coordinates[0]],
})

const deliveryPoints = delivery_options => {
  const points = []

  delivery_options?.length &&
    delivery_options.forEach(({ customer_delivery_table }) => {
      customer_delivery_table?.length &&
        customer_delivery_table.forEach(({ customer_deliveries }) => {
          customer_deliveries?.length &&
            customer_deliveries.forEach(({ package_delivery_plans }) => {
              package_delivery_plans?.length &&
                package_delivery_plans.forEach(
                  ({ drop_point: { center_x, center_y } }) =>
                    points.push({
                      type: 'Point',
                      coordinates: [center_x, center_y],
                    })
                )
            })
        })
    })

  return points
}

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
  dropPoints: deliveryPoints(delivery_options),
})

export default requestsFields
