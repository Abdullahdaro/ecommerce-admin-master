import { Hotel } from "@/models/Hotels";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();

  // Get hotel(s)
  if (method === 'GET') {
    if (req.query?.id) {
      try {
        const hotel = await Hotel.findOne({ _id: req.query.id });
        res.json(hotel);
      } catch (error) {
        res.status(404).json({ error: 'Hotel not found' });
      }
    } else {
      try {
        const hotels = await Hotel.find();
        res.json(hotels);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching hotels' });
      }
    }
  }

  // Create hotel
  if (method === 'POST') {
    try {
      const hotelDoc = await Hotel.create(req.body);
      res.json(hotelDoc);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update hotel
  if (method === 'PUT') {
    const { id } = req.query;
    try {
      const hotelDoc = await Hotel.findByIdAndUpdate(
        id,
        req.body,
        { new: true } // returns updated document
      );
      res.json(hotelDoc);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete hotel
  if (method === 'DELETE') {
    const { id } = req.query;
    try {
      await Hotel.findByIdAndDelete(id);
      res.json({ message: 'Hotel deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
} 