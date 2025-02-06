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
      const {
        title, description, price, images, category, 
        properties, details, included, notIncluded, 
        address, language, numberOfSeats, babySeat, 
        disableSeat, meetAndGreet
      } = req.body;

      const productDoc = await Product.create({
        title, description, price, images, category,
        properties, details, included, notIncluded,
        address, language, numberOfSeats, babySeat,
        disableSeat, meetAndGreet
      });

      res.json(productDoc);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  if (method === 'PUT') {
    try {
      const {
        _id,
        title, 
        description, 
        price, 
        images, 
        category,
        properties, 
        details, 
        included, 
        notIncluded,
        address, 
        language, 
        numberOfSeats, 
        babySeat,
        disableSeat, 
        meetAndGreet
      } = req.body;

      const existingProduct = await Product.findById(_id);
      console.log("existingProduct", existingProduct);
      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      // Update the product with explicit fields
      const updatedProduct = await Product.findByIdAndUpdate(
        _id,
        {
          title, 
          description, 
          price, 
          images, 
          category,
          properties, 
          details, 
          included, 
          notIncluded,
          address, 
          language, 
          numberOfSeats, 
          babySeat,
          disableSeat, 
          meetAndGreet
        },
        { 
          new: true,
          runValidators: true 
        }
      );
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Product.deleteOne({_id:req.query?.id});
      res.json(true);
    }
  }
}