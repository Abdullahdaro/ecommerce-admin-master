import multiparty from 'multiparty';
import fs from 'fs';
import path from 'path';
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req, res) {
  try {
    await mongooseConnect();
    
    const form = new multiparty.Form();
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const links = [];
    
    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const file of files.file) {
      const ext = path.extname(file.originalFilename);
      const newFilename = Date.now() + ext;
      const newPath = path.join(uploadDir, newFilename);
      
      // Copy file to uploads directory
      fs.copyFileSync(file.path, newPath);
      
      // Create URL for the uploaded file
      const link = `/uploads/${newFilename}`;
      links.push(link);
    }

    res.json({ links });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed: ' + error.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};