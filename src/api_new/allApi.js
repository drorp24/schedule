import axios from 'axios'

const allApi = async runId => {
  const requests = `${process.env.REACT_APP_API_SERVER}${runId}/${process.env.REACT_APP_REQUESTS_ENDPOINT}`
  const depots = `${process.env.REACT_APP_API_SERVER}${runId}${process.env.REACT_APP_DEPOTS_ENDPOINT}`
  const zones = `${process.env.REACT_APP_API_SERVER}${runId}${process.env.REACT_APP_ZONES_ENDPOINT}`
  const workplan = `${process.env.REACT_APP_API_SERVER}${runId}${process.env.REACT_APP_WORKPLAN_ENDPOINT}`

  const getRequests = () => axios.get(requests)
  const getDepots = () => axios.get(depots)
  const getZones = () => axios.get(zones)
  const getWorkplan = () => axios.get(workplan)

  return Promise.all([getRequests(), getDepots(), getZones(), getWorkplan()])
    .then(([requests, depots, zones, workplan]) => {
      return [requests.data, depots.data, zones.data, workplan.data]
    })
    .catch(error => {
      console.error(error.message)
    })
}

export default allApi
