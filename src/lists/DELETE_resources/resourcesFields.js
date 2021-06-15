const resourcesFields = ({
  data: {
    id,
    number_of_drones_for_supplier_category,
    related_supplier_categories_ids,
    start_time,
    end_time,
    drone_loading_dock,
  },
  relevant_packages,
}) => ({
  id,
  location: 'To be provided',
  drone_count: number_of_drones_for_supplier_category,
  suppliers_category_id: related_supplier_categories_ids[0],
  availability: {
    start: start_time.format,
    end: end_time.format,
  },
  drone_loading_dock: {
    id: drone_loading_dock.id,
    name: drone_loading_dock.name,
    drone_type: drone_loading_dock.drone_type?.name,
    max_usage: drone_loading_dock.max_usage_per_day,
  },
  packages: relevant_packages.map(({ name }) => ({ name })),
})

export default resourcesFields
