import Layout from "@/components/Layout";
import HotelForm from "@/components/HotelForm";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function EditHotel() {
  const [hotelData, setHotelData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/hotels?id=${id}`).then(response => {
      setHotelData(response.data);
      setIsLoading(false);
    });
  }, [id]);

  async function handleSubmit(updatedData) {
    try {
      await axios.put(`/api/hotels?id=${id}`, updatedData);
      router.push('/hotels');
    } catch (error) {
      console.error('Error updating hotel:', error);
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-center text-primary text-2xl mb-4">Edit Hotel</h1>
      <HotelForm initialData={hotelData} onSubmit={handleSubmit} />
    </Layout>
  );
}
