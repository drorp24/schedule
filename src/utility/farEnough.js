// Find if two map bounds are close enough
const proximity = 0.3

const closeEnough = (bounds1, bounds2) =>
  Math.abs(bounds1._northEast?.lat - bounds2._northEast?.lat) < proximity &&
  Math.abs(bounds1._northEast?.lng - bounds2._northEast?.lng) < proximity &&
  Math.abs(bounds2._southWest?.lat - bounds2._southWest?.lat) < proximity &&
  Math.abs(bounds2._southWest?.lng - bounds2._southWest?.lng) < proximity

const farEnough = (bounds1, bounds2) => !closeEnough(bounds1, bounds2)

export default farEnough
