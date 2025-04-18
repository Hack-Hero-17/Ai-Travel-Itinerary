const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

/**
 * Generates a personalized travel itinerary in JSON format using Gemini AI (REST)
 * @param {Object} preferences
 * @returns {Promise<string>}
 */
export async function generateTripPlan(preferences) {
  const prompt = `
Generate a Travel Plan in JSON Format.

Details:
- Location: ${preferences.location}
- Duration: ${preferences.NoofDays} days
- Travel Group: ${preferences.traveler}
- Budget: ${preferences.budget}

Requirements:
1. Provide a list of hotel options with the following structure:
{
  "Hotels": [
    {
      "hotelName": "Hotel Name",
      "hotelAddress": "Full Address",
      "price": "Price range per night",
      "hotelImageUrl": "Image URL of hotel",
      "geoCoordinates": "Latitude, Longitude",
      "rating": "Rating (e.g., 4.5 stars)",
      "description": "Short description of the hotel"
    },
    ...
  ]
}

2. Suggest a ${preferences.NoofDays}-days itinerary plan with the following format:
{
  "Itinerary": [
    {
      "day": "Day 1",
      "places": [
        {
          "placeName": "Attraction Name",
          "placeImageUrl": "Image URL",
          "geoCoordinates": "Latitude, Longitude",
          "ticketPricing": "Cost details",
          "bestTimeToVisit": "Best time of the day",
          "description": "Brief description of the place"
        },
        ...
      ]
    },
    ...
  ]
}

Output strictly in JSON format only. Do not add explanations or text outside the JSON object.
  `;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });
    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text || "No JSON trip plan generated.";
  } catch (err) {
    console.error("Gemini API Error:", err);
    return "Oops! Failed to generate itinerary.";
  }
}
