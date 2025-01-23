import {mongooseConnect} from "@/lib/mongoose";
import {Tour} from "@/models/Tour";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Tour.findOne({_id:req.query.id}));
    } else {
      res.json(await Tour.find());
    }
  }

  if (method === 'POST') {
    const {
      name, duration, maxGroupSize, difficulty,
      price, description, imageCover, images,
      startDates, location, rating,
    } = req.body;
    const tourDoc = await Tour.create({
      name, duration, maxGroupSize, difficulty,
      price, description, imageCover, images,
      startDates, location, rating,
    });
    res.json(tourDoc);
  }

  if (method === 'PUT') {
    const {
      name, duration, maxGroupSize, difficulty,
      price, description, imageCover, images,
      startDates, location, rating, _id
    } = req.body;
    await Tour.updateOne({_id}, {
      name, duration, maxGroupSize, difficulty,
      price, description, imageCover, images,
      startDates, location, rating,
    });
    res.json(true);
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Tour.deleteOne({_id:req.query.id});
      res.json(true);
    }
  }
} 