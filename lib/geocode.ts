export async function geocodeAddress(
  address: string,
  city: string,
  stateAbr: string
): Promise<{ lat: number; lng: number } | null> {
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

    const { lat, lon } = results[0];
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;

    return { lat: latitude, lng: longitude };
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
}
