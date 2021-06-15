import axios from 'axios'
import sampleWorkPlan from './sampleData/work_plan.json'

const workPlanApi = async runId => {
  const workPlan = `${process.env.REACT_APP_API_SERVER}${runId}/${process.env.REACT_APP_WORKPLAN_ENDPOINT}`
  try {
    const response = await axios.get(workPlan)
    if (!response) throw new Error('No response')
    if (response.error) throw new Error(response.error.message?.toString())
    return response.data
  } catch (error) {
    console.error('error: ', error)
    // eslint-disable-next-line no-throw-literal
    throw {
      api: 'workPlan',
      issue: error.response?.data?.error || 'No response from Api',
      status: error.response?.status,
    }
  }
}

// test data
const sampleWorkPlanApi = runId => Promise.resolve(sampleWorkPlan)

// export default workPlanApi
export default sampleWorkPlanApi
