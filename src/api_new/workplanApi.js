import axios from 'axios'

const workplanApi = async runId => {
  const workplan = `${process.env.REACT_APP_API_SERVER}${runId}/${process.env.REACT_APP_WORKPLAN_ENDPOINT}`
  try {
    const response = await axios.get(workplan)
    if (!response) throw new Error('No response')
    if (response.error) throw new Error(response.error.message?.toString())
    return response.data
  } catch (error) {
    console.error('error: ', error)
    // eslint-disable-next-line no-throw-literal
    throw {
      api: 'workplan',
      issue: error.response?.data?.error || 'No response from Api',
      status: error.response?.status,
    }
  }
}

export default workplanApi
