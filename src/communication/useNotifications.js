import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const useNotifications = setOpen => {
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('')

  const userError = useSelector(store => store.users.error)
  const runsError = useSelector(store => store.runs.error)
  const requestsError = useSelector(store => store.requests.error)
  const depotsError = useSelector(store => store.depots.error)
  const zonesError = useSelector(store => store.zones.error)
  const deliveriesError = useSelector(store => store.deliveries.error)

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
    if (depotsError) {
      setOpen(true)
      setMessage(
        'There are issues with the depots api. Check log for more details'
      )
      setSeverity('error')
    }
    if (zonesError) {
      setOpen(true)
      setMessage(
        'There are issues with the zones api. Check log for more details'
      )
      setSeverity('error')
    }
    if (deliveriesError) {
      setOpen(true)
      setMessage(
        'There are issues with the deliveries api. Check log for more details'
      )
      setSeverity('error')
    }
  }, [
    setOpen,
    userError,
    runsError,
    requestsError,
    depotsError,
    zonesError,
    deliveriesError,
  ])

  return { message, severity }
}

export default useNotifications
