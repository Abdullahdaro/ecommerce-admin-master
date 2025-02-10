import Layout from "@/components/Layout";
import HotelForm from "@/components/HotelForm";
import axios from "axios";
import { useRouter } from "next/router";

export default function NewHotel() {
  const router = useRouter();

  async function handleSubmit(hotelData) {
    try {
      await axios.post('/api/hotels', hotelData);
      router.push('/hotels');
    } catch (error) {
      console.error('Error saving hotel:', error);
    }
  }

  return (
    <Layout>
      <h1 className="text-center text-primary text-2xl mb-4">New Hotel</h1>
      <HotelForm onSubmit={handleSubmit} />
    </Layout>
  );
}
