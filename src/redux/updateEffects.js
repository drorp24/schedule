import { current } from '@reduxjs/toolkit'

// ! Why update
// In the common dilemma whether to calculate-on-the-fly or calculate-once-and-record, this case absolutely requires
// the latter. Mainly because vis-timeline, whenever another task (delivery) is selected, returns all of the selected tasks.
// Had I calculated the derived requests/depots on the fly I would have repeated previous calculations.
// Another reason is UX: while it is common to wait for the data from the server, when user selects a delivery, or
// changes criteria, he expects an instant reaction.
//
// ! All effects recorded once and on one entity
// While a redux action can be processed by multiple store parts,
// the update of each is done by its own separate reducer, on its own store slice.
// That reducer is not exposed to any other part of the store, nor can it update anything in a different slice.
//
// The way I usually go about that challenge is the following:
// The effecting entity's selector returns the list of updates on the other entities;
// then those affected entities' useEffects each dispatches its own updating action to update its own entity.
//
// Here I employ a different strategy altogether, saving: calling the same selector 3 times
// (or making 3 separate full-scan selectors),
// which would require either (external) memoization or some kind of ugly bookkeeping,
// then updating 3 different entities, ending up with a lot of code and confusion.
// My new strategy may actually may be the go-to solution to follow in similar use cases:
//
// With no selector at all, just one action, I record all effects on one entity only: the effecting one (here: 'delivery'),
// with keys that enable the affected entities ('requests', 'depots') to directly access their data with their id's.
//
// That action should be run from the useEffect whose entity is to effecting one,
// and get as argument the affected entities (since an action is not otherwise exposed to other keys).
// Its dependencies should include the effecting as well as affected entities, to guranatee they've all been populated.
// A 'run already' selector will prevent calling that useEffect for every change in those entities.
// That's it.

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

      drone_deliveries.forEach(
        ({ package_delivery_plan_ids = [] }, deliveryLegIndex) => {
          package_delivery_plan_ids.forEach(
            (deliveryPlanId, deliveryPlanIndex) => {
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
                  deliveryLeg: deliveryLegIndex,
                  deliveryPlanId,
                  requestId,
                  color,
                },
              }

              state.entities[deliveryId].drone_deliveries[
                deliveryLegIndex
              ].fulfilledRequests =
                state.entities[deliveryId].drone_deliveries[deliveryLegIndex]
                  .fulfilledRequests || []

              state.entities[deliveryId].drone_deliveries[
                deliveryLegIndex
              ].fulfilledRequests[deliveryPlanIndex] = {
                deliveryPlanId,
                location: extendedGeolocation,
              }

              state.entities[deliveryId].drone_deliveries[
                deliveryLegIndex
              ].employedDepots = depotIds

              state.fulfilledRequests[requestId] = state.fulfilledRequests[
                requestId
              ] || { locations: [], deliveries: [] }
              let fulfilledRequest = state.fulfilledRequests[requestId]
              fulfilledRequest.locations.push(extendedGeolocation)
              fulfilledRequest.deliveries.push({ id: deliveryId, color })

              depotIds.forEach(depotId => {
                state.employedDepots[depotId].locations.push({
                  geometry,
                  properties: { ...extendedGeolocation.properties, depotId },
                })
              })
            }
          )
        }
      )
    }
  )
}
