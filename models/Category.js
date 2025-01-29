import mongoose, {model, models, Schema} from "mongoose";

const CategorySchema = new Schema({
  name: {type:String,required:true},
  parent: {type:mongoose.Types.ObjectId, ref:'Category'},
  properties: [{type:Object}],
  description: {type: String},
  images: [{type: String}],
}, {
  timestamps: true,
});

export const Category = models?.Category || model('Category', CategorySchema);