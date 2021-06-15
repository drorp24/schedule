import axios from 'axios'

// import objectify from '../utility/objectify'
// import { keyProxy } from '../utility/proxies'

// const convertAPI = () => {}

const allApi = async runId => {
  const requests = `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_REQUESTS_ENDPOINT}${runId}`
  const resources = `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_RESOURCES_ENDPOINT}${runId}`
  const directives = `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_DIRECTIVES_ENDPOINT}${runId}`
  const recommendations = `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_RECOMMENDATIONS_ENDPOINT}${runId}`
  console.log('recommendations: ', recommendations)

  const getRequests = () => axios.get(requests)
  const getResources = () => axios.get(resources)
  const getDirectives = () => axios.get(directives)
  const getRecommendations = () => axios.get(recommendations)

  return Promise.all([
    getRequests(),
    getResources(),
    getDirectives(),
    getRecommendations(),
  ])
    .then(([requests, resources, directives, recommendations]) => {
      return [
        requests.data,
        resources.data,
        directives.data,
        recommendations.data,
      ]
    })
    .catch(error => {
      console.error(error.message)
    })
}

export default allApi
