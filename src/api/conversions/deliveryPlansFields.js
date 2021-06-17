const deliveryPlansFields = ({
  package_delivery_plan_id,
  drop_point,
  package_type,
  ...rest
}) => ({
  id: package_delivery_plan_id,
  geolocation: {
    geometry: { type: 'Point', coordinates: [drop_point[1], drop_point[0]] },
    properties: {
      packageType: package_type,
    },
  },
  ...rest,
})

export default deliveryPlansFields
