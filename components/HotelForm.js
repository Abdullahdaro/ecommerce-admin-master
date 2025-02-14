import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { ReactSortable } from "react-sortablejs";


export default function HotelForm({ 
  _id,
  name:existingName,
  description:existingDescription,
  images:existingImages,
  category:assignedCategory,
  location:existingLocation,
  price:existingPrice,
  rating:existingRating,
  checkIn:existingCheckIn,
  checkOut:existingCheckOut,
  availability:existingAvailability,
  booking:existingBooking,
}) {

  const [name, setName] = useState(existingName || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [category, setCategory] = useState(assignedCategory || '');
  const [location, setLocation] = useState(existingLocation || '');
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [price, setPrice] = useState(existingPrice || '');
  const [rating, setRating] = useState(existingRating || '');
  const [checkIn, setCheckIn] = useState(existingCheckIn || '');
  const [checkOut, setCheckOut] = useState(existingCheckOut || '');
  const [availability, setAvailability] = useState(existingAvailability || false);
  const [booking, setBooking] = useState(existingBooking || false);
  const [categories, setCategories] = useState([]);
  const [goToHotels, setGoToHotels] = useState(false);

  const router = useRouter();

  
  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    })
  }, []);

  async function handleSubmit(ev) {
    ev.preventDefault();
    const data = {
      name,
      description,
      price,
      images,
      category,
      location,
      rating,
      checkIn,
      checkOut,
      availability,
      booking,
    };

  try {
    if (_id) {
      await axios.put('/api/hotels', {...data, _id});
    } else {
      await axios.post('/api/hotels', data);
    }
    console.log('data', data);
    console.log('goToHotels', goToHotels);
    console.log('id', _id);
    setGoToHotels(true);
  } catch (error) {
    console.error('Error saving hotel:', error);
    alert('Error saving hotel. Please try again.');
  }
}
if (goToHotels) {
  router.push('/hotels');
}


  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      try {
        for (const file of files) {
          data.append('file', file);
        }
        const res = await axios.post('/api/upload', data);
        setImages(oldImages => {
          const newImages = [...oldImages, ...res.data.links];
          if (_id) {
            axios.put('/api/products', {
              _id,
              images: newImages,
            });
          }
          return newImages;
        });
      } catch (error) {
        console.error('Error uploading images:', error);
        alert('Error uploading images. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Hotel name"
          name="name"
          value={name}
          onChange={ev => setName(ev.target.value)}
          className="border rounded p-2"
        />
        <textarea
          placeholder="Description"
          name="description"
          value={description}
          onChange={ev => setDescription(ev.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Location"
          name="location"
          value={location}
            onChange={ev => setLocation(ev.target.value)}
          className="border rounded p-2"
        />
        <label>Category</label>
        <select value={category}
                onChange={ev => setCategory(ev.target.value)}>
          <option value="">Uncategorized</option>
          {categories.length > 0 && categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Price"
          name="price"
          value={price}
            onChange={ev => setPrice(ev.target.value)}
          className="border rounded p-2"
        />
        <input
          type="number"
          placeholder="Rating"
          name="rating"
          value={rating}
          onChange={ev => setRating(ev.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Check-in time"
          name="checkIn"
          value={checkIn}
          onChange={ev => setCheckIn(ev.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Check-out time"
          name="checkOut"
          value={checkOut}
          onChange={ev => setCheckOut(ev.target.value)}
          className="border rounded p-2"
        /> 
        <input
          type="file"
          multiple
          onChange={uploadImages}
          className="border rounded p-2"
        />
        {isUploading && <div className="text-center text-white">Uploading...</div>}
        <div className="flex gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="availability"
              checked={availability}
              onChange={ev => setAvailability(ev.target.checked)}
            />
            Available
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="booking"
              checked={booking}
              onChange={ev => setBooking(ev.target.checked)}
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