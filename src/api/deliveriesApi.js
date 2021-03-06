import axios from 'axios'
import sampleDeliveries from './sampleData/work_plan.json'
import fakeDelay from './fakeDelay'
import config from './config'

const deliveriesApi = async runId => {
  const deliveries = `${process.env.REACT_APP_API_SERVER}${runId}/${process.env.REACT_APP_DELIVERIES_ENDPOINT}`
  try {
    const response = await axios.get(deliveries)
    if (!response) throw new Error('No response')
    if (response.error) throw new Error(response.error.message?.toString())
    return response.data
  } catch (error) {
    console.error('error: ', error)
    // eslint-disable-next-line no-throw-literal
    throw {
      api: 'deliveries',
      issue: error.response?.data?.error || 'No response from Api',
      status: error.response?.status,
    }
  }
}

// test data
const sampleDeliveriesApi = runId => fakeDelay(sampleDeliveries, 400)

const api = config.fake ? sampleDeliveriesApi : deliveriesApi

export default api
