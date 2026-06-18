require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categories = [
  { name: 'Electronics', slug: 'electronics', image: '📱', description: 'Gadgets and gear' },
  { name: 'Fashion', slug: 'fashion', image: '👕', description: 'Trendy apparel' },
  { name: 'Home & Living', slug: 'home-living', image: '🏠', description: 'Essentials for home' },
  { name: 'Books', slug: 'books', image: '📚', description: 'Bestsellers and more' },
];

const products = [
  {
    name: 'Pro Wireless Headphones',
    description: 'High-fidelity audio with noise cancellation. 20-hour battery life.',
    price: 12999,
    discountPrice: 9999,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'],
    brand: 'AudioPro',
    stock: 50,
    rating: 4.8,
    numReviews: 120,
    featured: true,
  },
  {
    name: 'Smart Watch Series 7',
    description: 'Advanced health tracking and always-on retina display.',
    price: 45000,
    discountPrice: 39999,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'],
    brand: 'TechStyle',
    stock: 30,
    rating: 4.7,
    numReviews: 85,
    featured: true,
  },
  {
    name: 'Minimalist Camera',
    description: '4k mirrorless camera with vintage aesthetic.',
    price: 85000,
    discountPrice: 79999,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800'],
    brand: 'Capture',
    stock: 15,
    rating: 4.9,
    numReviews: 42,
    featured: true,
  },
  {
    name: 'Cotton Oxford Shirt',
    description: '100% organic cotton, perfect for any occasion.',
    price: 3500,
    discountPrice: 2499,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'],
    brand: 'ShopEZ Essentials',
    stock: 100,
    rating: 4.5,
    numReviews: 210,
    featured: false,
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected for seeding');

    await Category.deleteMany();
    await Product.deleteMany();

    const createdCategories = await Category.insertMany(categories);
    console.log('📂 Categories seeded');

    // Manually assign categories to products for reliability
    const electronics = createdCategories.find(c => c.slug === 'electronics')._id;
    const fashion = createdCategories.find(c => c.slug === 'fashion')._id;

    const finalProducts = [
      { ...products[0], category: electronics },
      { ...products[1], category: electronics },
      { ...products[2], category: electronics },
      { ...products[3], category: fashion },
    ];

    await Product.insertMany(finalProducts);
    console.log('📦 Products seeded');

    console.log('✨ Seeding complete!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
