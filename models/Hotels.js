import mongoose, {model, models, Schema} from "mongoose";

const HotelSchema = new Schema({
  name: {type:String,required:true},
  description: {type: String},
  images: [{type: String}],
  category: {type:mongoose.Types.ObjectId, ref:'Category'},
  location: {type:String},
  price: {type:Number},
  rating: {type:Number},
  reviews: [{type:Object}],
  amenities: [{type:String}],
  availability: {type:Boolean},
  booking: {type:Boolean},
  checkIn: {type:String},
  checkOut: {type:String},
}, {
  timestamps: true,
});

delete mongoose.models.Hotel;
export const Hotel = models?.Hotel || model('Hotel', HotelSchema);