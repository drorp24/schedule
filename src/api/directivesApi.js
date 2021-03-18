import axios from 'axios'

const directivesApi = async runId => {
  const directives = `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_DIRECTIVES_ENDPOINT}${runId}`
  try {
    const response = await axios.get(directives)
    if (!response) throw new Error('No response')
    if (response.error) throw new Error(response.error.message?.toString())
    return response.data
  } catch (error) {
    return { error }
  }
}

export default directivesApi
