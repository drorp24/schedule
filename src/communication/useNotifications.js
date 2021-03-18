import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const useNotifications = setOpen => {
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('')

  const userError = useSelector(store => store.users.error)
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
    if (requestsError) {
      setOpen(true)
      setMessage(
        "There are issues with the file's requests. Check log for more details"
      )
      setSeverity('error')
    }
    if (resourcesError) {
      setOpen(true)
      setMessage(
        "There are issues with the file's resources. Check log for more details"
      )
      setSeverity('error')
    }
    if (directivesError) {
      setOpen(true)
      setMessage(
        "There are issues with the file's directives. Check log for more details"
      )
      setSeverity('error')
    }
    if (recommendationsError) {
      setOpen(true)
      setMessage(
        "There are issues with the file's recommendations. Check log for more details"
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
  ])

  return { message, severity }
}

export default useNotifications
