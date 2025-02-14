import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import {ReactSortable} from "react-sortablejs";

export default function ProductForm({
  _id,
  title:existingTitle,
  description:existingDescription,
  price:existingPrice,
  images:existingImages,
  category:assignedCategory,
  properties:assignedProperties,
  details:existingDetails,
  included: existingIncluded,
  notIncluded: existingNotIncluded, 
  address: existingAddress,
  language:existingLanguage,
  numberOfSeats:existingNumberOfSeats,
  babySeat:existingBabySeat,
  disableSeat:existingDisableSeat,
  meetAndGreet:existingMeetAndGreet,  

}) {
  const [title,setTitle] = useState(existingTitle || '');
  const [description,setDescription] = useState(existingDescription || '');
  const [category,setCategory] = useState(assignedCategory || '');
  const [productProperties,setProductProperties] = useState(assignedProperties || {});
  const [price,setPrice] = useState(existingPrice || '');
  const [images,setImages] = useState(existingImages || []);
  const [goToProducts,setGoToProducts] = useState(false);
  const [isUploading,setIsUploading] = useState(false);
  const [categories,setCategories] = useState([]);
  const [language, setLanguage] = useState(existingLanguage || []);
  const [numberOfSeats, setNumberOfSeats] = useState(existingNumberOfSeats || '');
  const [babySeat, setBabySeat] = useState(existingBabySeat || '');
  const [disableSeat, setDisableSeat] = useState(existingDisableSeat || '');
  const [meetAndGreet, setMeetAndGreet] = useState(existingMeetAndGreet || '');
  const [selectedFile, setSelectedFile] = useState(null);

  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    })
  }, []);
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
      language,
      numberOfSeats,
      babySeat,
      disableSeat,
      meetAndGreet,
    };

    try {
      if (_id) {
        await axios.put('/api/products', {...data, _id});

      } else {
        await axios.post('/api/products', data);
      }
      setGoToProducts(true);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  }
  if (goToProducts) {
    router.push('/products');
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

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
  
  function setProductProp(propName,value) {
    setProductProperties(prev => {
      const newProductProps = {...prev};
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({_id}) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while(catInfo?.parent?._id) {
      const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  // Language options with labels
  const languageOptions = {
    en: 'English',
    ar: 'Arabic',
    fr: 'French',
    es: 'Spanish',
    tr: 'Turkish',
    ru: 'Russian'
  };

  const handleLanguageChange = (ev) => {
    const value = ev.target.value;
    setLanguage(prev => {
      if (prev.includes(value)) {
        return prev.filter(lang => lang !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const removeLanguage = (langToRemove) => {
    setLanguage(prev => prev.filter(lang => lang !== langToRemove));
  };

  return (
      <form onSubmit={saveProduct}>
        <label>Product name</label>
        <input
          type="text"
          placeholder="product name"
          value={title}
          onChange={ev => setTitle(ev.target.value)}/>
        <label>Category</label>
        <select value={category}
                onChange={ev => setCategory(ev.target.value)}>
          <option value="">Uncategorized</option>
          {categories.length > 0 && categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        {propertiesToFill.length > 0 && propertiesToFill.map(p => (
          <div key={p.name} className="">
            <label>{p.name}</label>
            <div>
              <select value={productProperties[p.name]}
                      onChange={ev =>
                        setProductProp(p.name,ev.target.value)
                      }
              >
                {p.values.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
        <label>
          Photos
        </label>
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
            <input type="file" onChange={uploadImages} className="hidden" />
          </label>
        </div>
        <label>Description</label>
        <textarea
          placeholder="description"
          value={description}
          onChange={ev => setDescription(ev.target.value)}
        />
        <label>Language</label>
        <div className="flex flex-col gap-2">
          <select 
            value="" 
            onChange={handleLanguageChange}
            className="mb-2"
          >
            <option value="">Add a language...</option>
            {Object.entries(languageOptions).map(([code, name]) => (
              !language.includes(code) && (
                <option key={code} value={code}>
                  {name}
                </option>
              )
            ))}
          </select>
          
          <div className="flex gap-1 flex-wrap">
            {language.map(lang => (
              <div key={lang} 
                   className="bg-white p-1 px-2 rounded-md border border-blue-200 flex gap-1 items-center">
                {languageOptions[lang]}
                <button 
                  type="button"
                  onClick={() => removeLanguage(lang)}
                  className="text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
        <label>Number of seats</label>
        <select value={numberOfSeats} onChange={ev => setNumberOfSeats(ev.target.value)}>
          <option value="1">1</option>
          <option value="1-3">1-3</option>
          <option value="2-6">4-6</option>
          <option value="7-14">7-14</option>
        </select>
        <label>Baby seat</label>
        <select value={babySeat} onChange={ev => setBabySeat(ev.target.value)}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <label>Disable seat</label>
        <select value={disableSeat} onChange={ev => setDisableSeat(ev.target.value)}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <lable>Meet & greet</lable>
        <select value={meetAndGreet} onChange={ev => setMeetAndGreet(ev.target.value)}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <label>Price (in USD)</label>
        <input
          type="number" placeholder="price"
          value={price}
          onChange={ev => setPrice(ev.target.value)}
        />
        <button
          type="submit"
          className="btn-primary">
          Save
        </button>
      </form>
  );
}
