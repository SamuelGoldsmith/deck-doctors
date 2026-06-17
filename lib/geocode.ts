import { haversineMeters } from "./geo";

export type GeocodePrecision = "precise" | "approximate" | "area";

// Classify how tightly Nominatim localized the match using its bounding-box
// diagonal. A rooftop/road hit spans a few–hundreds of meters; a town,
// postcode, or admin-area centroid spans kilometers and must not be trusted as
// an exact job-site coordinate. Missing/odd boxes fall back to "approximate".
function classifyPrecision(boundingbox: unknown): GeocodePrecision {
  if (!Array.isArray(boundingbox) || boundingbox.length !== 4) return "approximate";
  const [south, north, west, east] = boundingbox.map(Number);
  if ([south, north, west, east].some((n) => Number.isNaN(n))) return "approximate";

  const diagonalM = haversineMeters(south, west, north, east);
  if (diagonalM <= 2000) return "precise";
  if (diagonalM <= 8000) return "approximate";
  return "area";
}

export async function geocodeAddress(
  address: string,
  city: string,
  stateAbr: string
): Promise<{ lat: number; lng: number; precision: GeocodePrecision } | null> {
  try {
    const query = `${address}, ${city}, ${stateAbr}`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      headers: {
        "User-Agent": "DeckDoctorsApp/1.0 (employee-portal job geocoding)",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const results = await res.json();
    if (!Array.isArray(results) || results.length === 0) return null;

    const { lat, lon, boundingbox } = results[0];
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;

    return { lat: latitude, lng: longitude, precision: classifyPrecision(boundingbox) };
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
}
