const EARTH_RADIUS_MILES = 3958.8;
const EARTH_RADIUS_METERS = 6_371_000;

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

// Central angle (in radians) between two lat/lng points on a sphere.
function centralAngle(lat1: number, lng1: number, lat2: number, lng2: number) {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;

  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number) {
  return EARTH_RADIUS_MILES * centralAngle(lat1, lng1, lat2, lng2);
}

export function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  return EARTH_RADIUS_METERS * centralAngle(lat1, lng1, lat2, lng2);
}
