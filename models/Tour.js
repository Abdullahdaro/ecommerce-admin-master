const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String
  },
  duration: {
    type: Number
  },
  maxGroupSize: {
    type: Number
  },
  difficulty: {
    type: String
  },
  price: {
    type: Number
  },
  description: {
    type: String
  },
  imageCover: {
    type: String
  },
  images: [String],
  createdAt: {
    type: Date
  },
  startDates: [Date],
  location: {
    type: String
  },
  rating: {
    type: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour; 