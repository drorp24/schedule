import { current } from '@reduxjs/toolkit'

// ! All effects recorded once and on one entity
// While a redux action can be dispatched and consequently update multiple store parts,
// the update of each is done by its own separate reducer.
// That reducer is not exposed to any other part of the store, nor can it update anything in it.
// The way I usually go about that challenge is the following:
//
// The effecting entity's selector returns the list of updates on the other entities;
// then those affected entities' useEffects each dispatches its own updating action to update its affected entity.
//
// Here I employ a different strategy altogether, saving: calling the same selector 3 times
// (or making 3 separate full-scan selectors),
// which would require either (external) memoization or some kind of ugly bookkeeping,
// then updating 3 different entities, ending up with a lot of code and confusion.
// My new strategy may actually may be the go-to solution to follow in similar use cases:
//
// With no selector at all, just one action, I record all effects on one entity only: the effecting one (here: 'delivery'),
// with keys that guarantee that the affected entities ('requests', 'depots') can each find its data using a direct access.
//
// That action should be run from the useEffect whose entity is to blame for all effects,
// and get as argument the affected entities (since an action is not otherwise exposed to other keys).
// Its dependency array should include the effecting entity
// as well as all affected entities to guranatee they all have been fetched already.
// That's it.

// ! Why update
// In the common dilemma whether to calculate-on-the-fly or calculate-once-and-record, this case absolutely requires
// the latter. Mainly because vis-timeline, whenever another task (delivery) is selected, returns all of the selected tasks.
// Had I calculated the derived requests/depots on the fly I would have repeated previous calculations.
// Another reason is UX: while it is common to wait to the data from the server, when user selects a delivery, or
// changes criteria, he expects an instant reaction.
//

export const updateEffects = (
  state,
  { payload: { deliveryPlans, requests } }
) => {
  const deliveries = current(state)

  if (
    !deliveries.ids?.length ||
    !deliveryPlans.ids?.length ||
    !requests.ids?.length
  )
    return {}

  state.fulfilledRequests = {}
  state.employedDepots = {}

  Object.values(deliveries.entities).forEach(
    ({
      id: deliveryId,
      drone_deliveries = [],
      depart_depot_id,
      arrive_depot_id,
      color,
    }) => {
      const delivery = state.entities[deliveryId]

      delivery.fulfilledRequests = []
      delivery.employedDepots = []

      const depotIds = []
      depotIds[0] = depart_depot_id
      if (depart_depot_id !== arrive_depot_id) depotIds.push(arrive_depot_id)

      depotIds.forEach(depotId => {
        state.employedDepots[depotId] = state.employedDepots[depotId] || {
          deliveries: [],
          locations: [],
        }
        state.employedDepots[depotId].deliveries.push({ id: deliveryId, color })
      })

      drone_deliveries.forEach(({ package_delivery_plan_ids = [] }) => {
        package_delivery_plan_ids.forEach(deliveryPlanId => {
          const requestId = requests.planIds[deliveryPlanId]
          const deliveryPlan = deliveryPlans.entities[deliveryPlanId]
          const {
            geolocation: { geometry, properties },
          } = deliveryPlan
          const extendedGeolocation = {
            geometry,
            properties: {
              ...properties,
              deliveryId,
              deliveryPlanId,
              requestId,
            },
          }

          state.fulfilledRequests[requestId] = state.fulfilledRequests[
            requestId
          ] || { locations: [], deliveries: [] }
          let fulfilledRequest = state.fulfilledRequests[requestId]
          fulfilledRequest.locations.push(extendedGeolocation)
          fulfilledRequest.deliveries.push({ id: deliveryId, color })

          delivery.fulfilledRequests = fulfilledRequest
          delivery.employedDepots = depotIds

          depotIds.forEach(depotId => {
            state.employedDepots[depotId].locations.push({
              geometry,
              properties: { ...extendedGeolocation.properties, depotId },
            })
          })
        })
      })
    }
  )
}
