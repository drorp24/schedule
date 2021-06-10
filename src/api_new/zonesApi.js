import axios from 'axios'

const zonesApi = async runId => {
  const zones = `${process.env.REACT_APP_API_SERVER}${runId}/${process.env.REACT_APP_ZONES_ENDPOINT}`
  try {
    const response = await axios.get(zones)
    if (!response) throw new Error('No response')
    if (response.error) throw new Error(response.error.message?.toString())
    return response.data
  } catch (error) {
    console.error('error: ', error)
    // eslint-disable-next-line no-throw-literal
    throw {
      api: 'zones',
      issue: error.response?.data?.error || 'No response from Api',
      status: error.response?.status,
    }
  }
}

export default zonesApi
