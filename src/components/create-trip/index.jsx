// ✅ FIX: Keep libraries outside to prevent re-creation on every render
const libraries = ['places'];
import { generateTripPlan } from '@/service/AIModel'; // Make sure this path matches your actual file


import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { Input } from "@/components/ui/input";
import { SelectTravelesList, SelectBudgetOptions } from '@/constants/options';
import { Button } from '../ui/button';
import { Toaster, toast } from 'sonner'; // ✅ Import both toast & Toaster

function CreateTrip() {
  const [place, setPlace] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const autocompleteRef = useRef(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  function extractJSON(text) {
    // Remove code blocks if wrapped like ```json ... ```
    const clean = text.trim().replace(/^```(?:json)?|```$/g, '').trim();
  
    try {
      return JSON.parse(clean);
    } catch (err) {
      console.warn("⚠️ Still couldn't parse. Returning raw.", err);
      return null;
    }
  }
  

  const handleInputChange = useCallback((name) => (e) => {
    const value = e.target.value;
    if (name === 'location') setPlace(value);

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === 'location' && window.google && value.length > 2) {
      const service = new window.google.maps.places.AutocompleteService();
      service.getQueryPredictions({ input: value }, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSuggestions(predictions || []);
        }
      });
    } else if (name === 'location') {
      setSuggestions([]);
    }
  }, []);

  const handleSelectPlace = (placeObj) => {
    setPlace(placeObj.description);
    setFormData((prev) => ({
      ...prev,
      location: placeObj.description
    }));
    setSuggestions([]);
  };

  const OnGenerateTrip = async () => {
    if (
      !formData?.location ||
      !formData?.NoofDays ||
      !formData?.budget ||
      !formData?.traveler
    ) {
      toast("Please fill all the details.");
      return;
    }
  
    if (formData?.NoofDays > 5) {
      toast("Trips over 5 days are not supported yet.");
      return;
    }
  
    toast("Generating your custom trip plan...");
  
    try {
      const response = await generateTripPlan(formData);
      const parsed = extractJSON(response);
  
      if (parsed) {
        console.log("✅ Trip Plan (Parsed JSON):", parsed);
      } else {
        console.log("⚠️ Raw Response:", response);
      }
    } catch (err) {
      console.error("❌ Gemini Trip Plan Error:", err);
      toast("Something went wrong while generating the trip.");
    }
  };
  


  if (loadError) return <p className="text-red-500">Error loading Maps</p>;
  if (!isLoaded) return <p>Loading map…</p>;

  return (
    <>
      <Toaster /> {/* ✅ Toast component in DOM */}
      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
        <h2 className="font-bold text-3xl">Tell us your travel preference 🎕️🌴</h2>
        <p className="mt-3 text-gray-500 text-xl">
          Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
        </p>

        <div className="mt-20 flex flex-col gap-9">
          <div>
            <h2 className="text-xl my-3 font-medium">What is your destination of choice?</h2>
            <Input
              type="text"
              value={place}
              onChange={handleInputChange('location')}
              placeholder="Search destination..."
            />
            {suggestions.length > 0 && (
              <ul className="border rounded mt-2 max-h-48 overflow-auto bg-white shadow">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectPlace(suggestion)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {suggestion.description}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="text-xl my-3 font-medium">How many days are you planning your trip?</h2>
            <Input
              type="number"
              placeholder="Ex. 3"
              value={formData.NoofDays || ''}
              onChange={handleInputChange('NoofDays')}
            />
          </div>

          <div>
            <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
            <div className="grid grid-cols-3 gap-5 mt-5">
              {SelectBudgetOptions.map((item, index) => (
                <div
                  key={index}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      budget: item.title
                    }))
                  }
                  className={`p-4 border rounded-2xl cursor-pointer bg-gray-100 hover:bg-gray-200 hover:shadow 
                  ${formData?.budget === item.title ? 'shadow-lg border-black' : ''}`}
                >
                  <h2 className="text-4xl">{item.icon}</h2>
                  <h2 className="font-bold text-lg mt-2">{item.title}</h2>
                  <h2 className="text-sm text-gray-600 mt-1">{item.desc}</h2>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl my-3 font-medium">Who do you plan on traveling with on your next adventure?</h2>
            <div className="grid grid-cols-3 gap-5 mt-5">
              {SelectTravelesList.map((item, index) => (
                <div
                  key={index}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      traveler: item.people
                    }))
                  }
                  className={`p-4 border rounded-2xl cursor-pointer bg-gray-100 hover:bg-gray-200 hover:shadow 
                  ${formData?.traveler === item.people ? 'shadow-lg border-black' : ''}`}
                >
                  <h2 className="text-4xl">{item.icon}</h2>
                  <h2 className="font-bold text-lg mt-2">{item.title}</h2>
                  <h2 className="text-sm text-gray-600 mt-1">{item.desc}</h2>
                </div>
              ))}
            </div>
          </div>

          <div className="my-10 justify-end flex">
            <Button onClick={OnGenerateTrip}>Generate Trip</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateTrip;
