import axios from 'axios'

const requestsApi = async runId => {
  const requests = `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_REQUESTS_ENDPOINT}${runId}`
  try {
    const response = await axios.get(requests)
    if (!response) throw new Error('No response')
    if (response.error) throw new Error(response.error.message?.toString())
    return response.data
  } catch (error) {
    return { error }
  }
}

export default requestsApi
