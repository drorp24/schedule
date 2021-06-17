const workPlanFields = ({ delivering_drones_id, ...rest }) => ({
  id: delivering_drones_id,
  ...rest,
})

export default workPlanFields
