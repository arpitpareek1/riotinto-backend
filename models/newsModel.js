const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageSource: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const News = mongoose.model('News', NewsSchema);

module.exports = News;
