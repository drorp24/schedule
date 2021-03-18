import axios from 'axios'

const resourcesApi = async runId => {
  const resources = `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_RESOURCES_ENDPOINT}${runId}`
  try {
    const response = await axios.get(resources)
    if (!response) throw new Error('No response')
    if (response.error) throw new Error(response.error.message?.toString())
    return response.data
  } catch (error) {
    return { error }
  }
}

export default resourcesApi
