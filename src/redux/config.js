export const criteriaDefaults = {
  matched: {
    value: true,
    map: false,
  },
  unmatched: {
    value: true,
    map: false,
  },
  selectedDeliveries: {
    value: true,
    map: true,
  },
}

export const initialCriteria = {
  selectedDeliveries: criteriaDefaults.selectedDeliveries.value,
  matched: criteriaDefaults.matched.value,
  unmatched: criteriaDefaults.unmatched.value,
  map: { value: true, user: false },
}
