import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  image: String,
  isFavorite: Boolean,
  category: String,
  material: String,
  occasion: String,
  modelNumber: String,
  description: String,
  weight: String,
  shopFor: String,
  reviews: Number,
  rating: Number,
  createdAt: Date,
  updatedAt: Date
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;