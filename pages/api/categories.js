import {Category} from "@/models/Category";
import {mongooseConnect} from "@/lib/mongoose";
import {getServerSession} from "next-auth";
import {authOptions, isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === 'GET') {
    res.json(await Category.find().populate('parent'));
  }

  if (method === 'POST') {
    try {
      const {name,parentCategory,properties,description,images} = req.body;
      console.log('Received data:', {name,parentCategory,properties,description,images}); // Debug log
      
      const categoryDoc = await Category.create({
        name,
        parent: parentCategory || undefined,
        properties,
        description,
        images, // Make sure this is an array
      });
      console.log('Saved category:', categoryDoc); // Debug log
      res.json(categoryDoc);
    } catch (error) {
      console.error('Error saving category:', error);
      res.status(500).json({ error: error.message });
    }
  }

  if (method === 'PUT') {
    try {
      const {name,parentCategory,properties,description,images,_id} = req.body;
      console.log('Updating category with:', {name,parentCategory,properties,description,images}); // Debug log
      
      const categoryDoc = await Category.findByIdAndUpdate(_id, {
        name,
        parent: parentCategory || undefined,
        properties,
        description,
        images,
      }, { new: true }); // Return updated document
      
      console.log('Updated category:', categoryDoc); // Debug log
      res.json(categoryDoc);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: error.message });
    }
  }

  if (method === 'DELETE') {
    const {_id} = req.query;
    await Category.deleteOne({_id});
    res.json('ok');
  }
}