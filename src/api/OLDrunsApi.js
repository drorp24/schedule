import axios from 'axios'

const runsApi = async () => {
  const runs = `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_LATEST_RUNS_ENDPOINT}`
  try {
    const response = await axios.get(runs)
    if (!response) throw new Error('No response')
    if (response.error) throw new Error(response.error.message?.toString())
    return response.data
  } catch (error) {
    return { error }
  }
}

export default runsApi
