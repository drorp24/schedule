import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const useNotifications = setOpen => {
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('')

  const userError = useSelector(store => store.users.error)
  const runsError = useSelector(store => store.runs.error)
  const requestsError = useSelector(store => store.requests.error)
  const resourcesError = useSelector(store => store.resources.error)
  const directivesError = useSelector(store => store.directives.error)
  const recommendationsError = useSelector(store => store.recommendations.error)

  useEffect(() => {
    if (userError) {
      setOpen(true)
      setMessage(userError || 'Something went wrong')
      setSeverity('error')
    }
    if (runsError) {
      setOpen(true)
      setMessage(
        'There are issues with the runs api. Check log for more details'
      )
      setSeverity('error')
    }
    if (requestsError) {
      setOpen(true)
      setMessage(
        'There are issues with the requests api. Check log for more details'
      )
      setSeverity('error')
    }
    if (resourcesError) {
      setOpen(true)
      setMessage(
        'There are issues with the resources api. Check log for more details'
      )
      setSeverity('error')
    }
    if (directivesError) {
      setOpen(true)
      setMessage(
        'There are issues with the directives api. Check log for more details'
      )
      setSeverity('error')
    }
    if (recommendationsError) {
      setOpen(true)
      setMessage(
        'There are issues with the recommendations api. Check log for more details'
      )
      setSeverity('error')
    }
  }, [
    setOpen,
    userError,
    recommendationsError,
    requestsError,
    resourcesError,
    directivesError,
    runsError,
  ])

  return { message, severity }
}

export default useNotifications
