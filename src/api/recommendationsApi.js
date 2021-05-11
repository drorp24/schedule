import axios from 'axios'
import sampleJson from './sampleJson'

const recommendationsApi = async runId => {
  const recommendations = `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_RECOMMENDATIONS_ENDPOINT}${runId}`
  try {
    const response = await axios.get(recommendations)
    if (!response) throw new Error('No response')
    if (response.error) throw new Error(response.error.message?.toString())
    return { response: response.data, newFormat: sampleJson }
  } catch (error) {
    return { error }
  }
}

export default recommendationsApi
