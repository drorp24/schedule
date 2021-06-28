export const criteriaDefaults = {
  selectedDeliveries: {
    value: false,
    map: true,
  },
  matched: {
    value: false,
    map: false,
  },
  unmatched: {
    value: false,
    map: false,
  },
}

export const initialCriteria = {
  selectedDeliveries: criteriaDefaults.selectedDeliveries.value,
  matched: criteriaDefaults.matched.value,
  unmatched: criteriaDefaults.unmatched.value,
  filter: false,
  map: { value: true, user: false },
}
