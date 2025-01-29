import {Product} from "@/models/Product";
import {mongooseConnect} from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Product.findOne({_id:req.query.id}));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === 'POST') {
    try {
      const {title, description, price, images, category, properties, address, details,
        included,
        notIncluded} = req.body;
      const productDoc = await Product.create({
        title,
        description,
        price,
        images,
        category,
        properties,
        address,
        details,
        included,
        notIncluded
      });
      res.json(productDoc);
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  }

  if (method === 'PUT') {
    try {
      const {title, description, price, images, _id, category, properties, address, details,
        included,
        notIncluded} = req.body;
      await Product.updateOne({_id}, {
        title,
        description,
        price,
        images,
        category,
        properties,
        address,
        details,
        included,
        notIncluded
      });
      res.json(true);
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Product.deleteOne({_id:req.query?.id});
      res.json(true);
    }
  }
}