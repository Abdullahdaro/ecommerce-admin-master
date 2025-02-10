import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function HotelForm({ initialData, onSubmit }) {
  const [hotelData, setHotelData] = useState(initialData || {
    name: '',
    description: '',
    images: [],
    category: '',
    location: '',
    price: '',
    rating: '',
    reviews: [],
    amenities: [],
    availability: true,
    booking: false,
    checkIn: '',
    checkOut: '',
  });
  const router = useRouter();

  function handleChange(ev) {
    const { name, value } = ev.target;
    setHotelData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    await onSubmit(hotelData);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Hotel name"
          name="name"
          value={hotelData.name}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <textarea
          placeholder="Description"
          name="description"
          value={hotelData.description}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Location"
          name="location"
          value={hotelData.location}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <input
          type="number"
          placeholder="Price"
          name="price"
          value={hotelData.price}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <input
          type="number"
          placeholder="Rating"
          name="rating"
          value={hotelData.rating}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Check-in time"
          name="checkIn"
          value={hotelData.checkIn}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Check-out time"
          name="checkOut"
          value={hotelData.checkOut}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <div className="flex gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="availability"
              checked={hotelData.availability}
              onChange={e => setHotelData(prev => ({...prev, availability: e.target.checked}))}
            />
            Available
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="booking"
              checked={hotelData.booking}
              onChange={e => setHotelData(prev => ({...prev, booking: e.target.checked}))}
            />
            Booking enabled
          </label>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => router.push('/hotels')}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
} 