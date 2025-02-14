import Layout from "@/components/Layout";
import HotelForm from "@/components/HotelForm";

export default function NewHotel() {
  return (
    <Layout>
      <h1 className="text-center text-primary text-2xl mb-4">New Hotel</h1>
      <HotelForm/>
    </Layout>
  );
}
