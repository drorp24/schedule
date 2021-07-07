import axios from 'axios'
import sampleRuns from './sampleData/runs.json'
import fakeDelay from './fakeDelay'

const runsApi = async runId => {
  const runs = `${process.env.REACT_APP_API_SERVER}/${process.env.REACT_APP_RUNS_ENDPOINT}`
  try {
    const response = await axios.get(runs)
    if (!response) throw new Error('No response')
    if (response.error) throw new Error(response.error.message?.toString())
    return response.data
  } catch (error) {
    console.error('error: ', error)
    // eslint-disable-next-line no-throw-literal
    throw {
      api: 'runs',
      issue: error.response?.data?.error || 'No response from Api',
      status: error.response?.status,
    }
  }
}

// test data
const sampleRunsApi = runId => fakeDelay(sampleRuns)

// export default runsApi
export default sampleRunsApi
