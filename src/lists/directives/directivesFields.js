const directivesFields = ({
  id,
  name,
  update_time,
  directives: {
    customer_delivery_unit_id,
    supplier_category_id,
    danger_flight_area_policy,
    local_flight_districs,
  },
}) => ({
  id,
  name,
  update_time,
  customer_delivery_unit_id,
  supplier_category_id,
  danger_zones: danger_flight_area_policy.map(
    ({ danger_flight_area: { type, point } }) => ({ type, point })
  ),
  flight_districts: local_flight_districs.map(
    ({ local_flight_district: { geojson } }) => ({
      district: JSON.parse(geojson),
    })
  ),
})

export default directivesFields
