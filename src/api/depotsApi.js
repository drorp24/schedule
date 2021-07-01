import axios from 'axios'
import sampleDepots from './sampleData/depots.json'

const depotsApi = async runId => {
  const depots = `${process.env.REACT_APP_API_SERVER}${runId}/${process.env.REACT_APP_DEPOTS_ENDPOINT}`
  try {
    const response = await axios.get(depots)
    if (!response) throw new Error('No response')
    if (response.error) throw new Error(response.error.message?.toString())
    return response.data
  } catch (error) {
    console.error('error: ', error)
    // eslint-disable-next-line no-throw-literal
    throw {
      api: 'depots',
      issue: error.response?.data?.error || 'No response from Api',
      status: error.response?.status,
    }
  }
}

// test data
const sampleDepotsApi = runId => Promise.resolve(sampleDepots)

export default depotsApi
// export default sampleDepotsApi
