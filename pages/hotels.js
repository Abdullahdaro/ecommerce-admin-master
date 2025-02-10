import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  async function fetchHotels() {
    try {
      const response = await axios.get('/api/hotels');
      setHotels(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Hotels</h1>
        <Link 
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
          href="/hotels/new"
        >
          Add New Hotel
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {hotels.map(hotel => (
            <div 
              key={hotel._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{hotel.name}</h2>
                  <p className="text-gray-600">{hotel.location}</p>
                  <p className="text-sm text-gray-500 mt-1">{hotel.description}</p>
                  
                  <div className="mt-2 space-y-1">
                    <p className="text-primary font-semibold">
                      ${hotel.price} per night
                    </p>
                    <p className="text-sm">
                      Rating: {hotel.rating ? `${hotel.rating}/5` : 'No ratings yet'}
                    </p>
                    <p className="text-sm">
                      Check-in: {hotel.checkIn} | Check-out: {hotel.checkOut}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-sm px-2 py-1 rounded ${
                        hotel.availability 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {hotel.availability ? 'Available' : 'Not Available'}
                      </span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        hotel.booking 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {hotel.booking ? 'Booking Enabled' : 'Booking Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/hotels/edit/${hotel._id}`}
                    className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/hotels/delete/${hotel._id}`}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </Link>
                </div>
              </div>

              {hotel.amenities?.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-1">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {hotel.amenities.map((amenity, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {hotels.length === 0 && (
            <div className="text-center text-gray-500">
              No hotels found. Add your first hotel!
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
