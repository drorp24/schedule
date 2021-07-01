import axios from 'axios'
import sampleDeliveryPlans from './sampleData/package_delivery_plans.json'

const deliveryPlansApi = async runId => {
  const deliveryPlans = `${process.env.REACT_APP_API_SERVER}${runId}/${process.env.REACT_APP_DELIVERYPLANS_ENDPOINT}`
  try {
    const response = await axios.get(deliveryPlans)
    if (!response) throw new Error('No response')
    if (response.error) throw new Error(response.error.message?.toString())
    return response.data
  } catch (error) {
    console.error('error: ', error)
    // eslint-disable-next-line no-throw-literal
    throw {
      api: 'deliveryPlans',
      issue: error.response?.data?.error || 'No response from Api',
      status: error.response?.status,
    }
  }
}

// test data
const sampleDeliveryPlansApi = runId => {
  console.log('3. sampleDeliveryPlansApi called')
  console.groupEnd()
  return Promise.resolve(sampleDeliveryPlans)
}

export default deliveryPlansApi
// export default sampleDeliveryPlansApi
