const Category = require('../models/Category');

// @GET /api/categories
const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
};

// @POST /api/categories (admin)
const createCategory = async (req, res) => {
  const { name, slug, image, description } = req.body;
  const exists = await Category.findOne({ slug });
  if (exists) return res.status(400).json({ message: 'Category already exists' });
  const category = await Category.create({ name, slug, image, description });
  res.status(201).json(category);
};

// @PUT /api/categories/:id (admin)
const updateCategory = async (req, res) => {
  const { name, slug, image, description } = req.body;
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  category.name = name || category.name;
  category.slug = slug || category.slug;
  category.image = image || category.image;
  category.description = description || category.description;
  await category.save();
  res.json(category);
};

// @DELETE /api/categories/:id (admin)
const deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category deleted' });
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
