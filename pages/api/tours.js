import {mongooseConnect} from "@/lib/mongoose";
import Tour from "@/models/Tour";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  try {
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req,res);

    if (method === 'GET') {
      try {
        if (req.query?.id) {
          const tour = await Tour.findOne({_id:req.query.id});
          if (!tour) {
            return res.status(404).json({ error: "Tour not found" });
          }
          res.json(tour);
        } else {
          const tours = await Tour.find();
          res.json(tours);
        }
      } catch (error) {
        res.status(500).json({ error: "Error fetching tours: " + error.message });
      }
    }

    if (method === 'POST') {
      try {
        const {
          name, duration, maxGroupSize, difficulty,
          price, description, imageCover, images,
          startDates, location, rating,
        } = req.body;

        if (!name || !price) {
          return res.status(400).json({ error: "Name and price are required" });
        }

        const tourDoc = await Tour.create({
          name, duration, maxGroupSize, difficulty,
          price, description, imageCover, images,
          startDates, location, rating,
        });
        res.json(tourDoc);
      } catch (error) {
        res.status(500).json({ error: "Error creating tour: " + error.message });
      }
    }

    if (method === 'PUT') {
      try {
        const {
          name, duration, maxGroupSize, difficulty,
          price, description, imageCover, images,
          startDates, location, rating, _id
        } = req.body;

        if (!_id) {
          return res.status(400).json({ error: "Tour ID is required" });
        }

        const updatedTour = await Tour.findByIdAndUpdate(_id, {
          name, duration, maxGroupSize, difficulty,
          price, description, imageCover, images,
          startDates, location, rating,
        }, { new: true });

        if (!updatedTour) {
          return res.status(404).json({ error: "Tour not found" });
        }

        res.json(updatedTour);
      } catch (error) {
        res.status(500).json({ error: "Error updating tour: " + error.message });
      }
    }

    if (method === 'DELETE') {
      try {
        if (!req.query?.id) {
          return res.status(400).json({ error: "Tour ID is required" });
        }

        const deletedTour = await Tour.findByIdAndDelete(req.query.id);
        
        if (!deletedTour) {
          return res.status(404).json({ error: "Tour not found" });
        }

        res.json({ message: "Tour deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Error deleting tour: " + error.message });
      }
    }

  } catch (error) {
    // Handle any unexpected errors
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
} 