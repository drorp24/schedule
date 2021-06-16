import axios from 'axios'
import sampleRequests from './sampleData/requests.json'

const requestsApi = async runId => {
  const requests = `${process.env.REACT_APP_API_SERVER}${runId}/${process.env.REACT_APP_REQUESTS_ENDPOINT}`
  try {
    const response = await axios.get(requests)
    if (!response) throw new Error('No response')
    if (response.error) throw new Error(response.error.message?.toString())
    return response.data
  } catch (error) {
    console.error('error: ', error)
    // eslint-disable-next-line no-throw-literal
    throw {
      api: 'requests',
      issue: error.response?.data?.error || 'No response from Api',
      status: error.response?.status,
    }
  }
}

// test data
const sampleRequestsApi = runId => Promise.resolve(sampleRequests)

// export default requestsApi
export default sampleRequestsApi