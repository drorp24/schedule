const requestsFields = ({ run_id, ...rest }) => ({
  id: run_id,
  ...rest,
})

export default requestsFields
