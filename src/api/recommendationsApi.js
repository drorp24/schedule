import axios from 'axios'
import sampleJson from './sampleJson'
import createEntities from './createEntities'

const recommendationsApi = async runId => {
  const recommendationsEndpoint = `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_RECOMMENDATIONS_ENDPOINT}${runId}`
  try {
    // console.log('sampleJson: ', sampleJson)
    // const recommendations = createEntities(sampleJson)
    // console.log('recommendations: ', recommendations)

    // const ops = {}
    // sampleJson.forEach(({ single_op_id }) => {
    //   if (single_op_id) ops[single_op_id] = single_op_id
    // })

    // console.log('Object.values(ops).length: ', Object.values(ops).length)
    // console.log('ops: ', ops)

    // console.log('requests: ', requests)
    // console.log('resources: ', resources)
    // console.log('recommendations: ', recommendations)

    const response = await axios.get(recommendationsEndpoint)
    if (!response) throw new Error('No response')
    if (response.error) throw new Error(response.error.message?.toString())
    return response.data
  } catch (error) {
    return { error }
  }
}

export default recommendationsApi
