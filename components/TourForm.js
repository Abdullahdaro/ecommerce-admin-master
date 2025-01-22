import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import {ReactSortable} from "react-sortablejs";

export default function TourForm({
  _id,
  name: existingName,
  duration: existingDuration,
  maxGroupSize: existingMaxGroupSize,
  difficulty: existingDifficulty,
  price: existingPrice,
  description: existingDescription,
  imageCover: existingImageCover,
  images: existingImages,
  startDates: existingStartDates,
  location: existingLocation,
  rating: existingRating,
}) {
  const [name, setName] = useState(existingName || '');
  const [duration, setDuration] = useState(existingDuration || '');
  const [maxGroupSize, setMaxGroupSize] = useState(existingMaxGroupSize || '');
  const [difficulty, setDifficulty] = useState(existingDifficulty || '');
  const [price, setPrice] = useState(existingPrice || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [imageCover, setImageCover] = useState(existingImageCover || '');
  const [images, setImages] = useState(existingImages || []);
  const [startDates, setStartDates] = useState(existingStartDates || []);
  const [location, setLocation] = useState(existingLocation || '');
  const [rating, setRating] = useState(existingRating || '');
  const [goToTours, setGoToTours] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  async function saveTour(ev) {
    ev.preventDefault();
    const data = {
      name, duration, maxGroupSize, difficulty,
      price, description, imageCover, images,
      startDates, location, rating,
    };
    if (_id) {
      //update
      await axios.put('/api/tours', {...data,_id});
    } else {
      //create
      await axios.post('/api/tours', data);
    }
    setGoToTours(true);
  }

  if (goToTours) {
    router.push('/tours');
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/upload', data);
      setImages(oldImages => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }

  async function uploadCoverImage(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      data.append('file', files[0]);
      const res = await axios.post('/api/upload', data);
      setImageCover(res.data.links[0]);
      setIsUploading(false);
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  return (
    <form onSubmit={saveTour}>
      <label>Tour name</label>
      <input
        type="text"
        placeholder="Tour name"
        value={name}
        onChange={ev => setName(ev.target.value)}
      />
      
      <label>Duration (days)</label>
      <input
        type="number"
        placeholder="Duration"
        value={duration}
        onChange={ev => setDuration(ev.target.value)}
      />

      <label>Max Group Size</label>
      <input
        type="number"
        placeholder="Max group size"
        value={maxGroupSize}
        onChange={ev => setMaxGroupSize(ev.target.value)}
      />

      <label>Difficulty</label>
      <select 
        value={difficulty}
        onChange={ev => setDifficulty(ev.target.value)}
      >
        <option value="">Select difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="difficult">Difficult</option>
      </select>

      <label>Cover Image</label>
      <div className="mb-2">
        {imageCover && (
          <div className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
            <img src={imageCover} alt="" className="rounded-lg"/>
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div>
            Add cover image
          </div>
          <input type="file" onChange={uploadCoverImage} className="hidden"/>
        </label>
      </div>

      <label>Tour Images</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}>
          {!!images?.length && images.map(link => (
            <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
              <img src={link} alt="" className="rounded-lg"/>
            </div>
          ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div>
            Add image
          </div>
          <input type="file" onChange={uploadImages} className="hidden"/>
        </label>
      </div>

      <label>Description</label>
      <textarea
        placeholder="Description"
        value={description}
        onChange={ev => setDescription(ev.target.value)}
      />

      <label>Location</label>
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={ev => setLocation(ev.target.value)}
      />

      <label>Price (in USD)</label>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={ev => setPrice(ev.target.value)}
      />

      <label>Rating</label>
      <input
        type="number"
        placeholder="Rating"
        min="1"
        max="5"
        step="0.1"
        value={rating}
        onChange={ev => setRating(ev.target.value)}
      />

      <label>Start Dates</label>
      <input
        type="date"
        value={startDates}
        onChange={ev => setStartDates([...startDates, ev.target.value])}
      />
      
      <button
        type="submit"
        className="btn-primary">
        Save
      </button>
    </form>
  );
} 