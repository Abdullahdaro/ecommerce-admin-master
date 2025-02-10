import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";

export default function DeleteHotel() {
  const router = useRouter();
  const [hotel, setHotel] = useState(null);
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    // Fetch hotel details
    axios.get(`/api/hotels?id=${id}`).then(response => {
      setHotel(response.data);
    });
  }, [id]);

  async function handleDelete() {
    try {
      await axios.delete(`/api/hotels?id=${id}`);
      router.push('/hotels');
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-8">
        <h1 className="text-center text-2xl mb-4">Delete Hotel</h1>
        {hotel ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl mb-2">Are you sure you want to delete &quot;{hotel.name}&quot;?</h2>
            <p className="text-gray-500 mb-4">This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => router.push('/hotels')}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">Loading...</div>
        )}
      </div>
    </Layout>
  );
}
