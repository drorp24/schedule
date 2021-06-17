const requestsFields = ({ request_id, ...rest }) => ({
  id: request_id,
  ...rest,
})

export default requestsFields
