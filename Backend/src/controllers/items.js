const Item = require('../models/Item');
const Joi = require('joi');

const itemSchema = Joi.object({ title: Joi.string().min(1).required(), description: Joi.string().allow('', null) });

exports.list = async (req, res, next) => {
  try {
    const items = await Item.find({ owner: req.user._id });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { error, value } = itemSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const item = new Item({ ...value, owner: req.user._id });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, owner: req.user._id });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { error, value } = itemSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const item = await Item.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, value, { new: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
