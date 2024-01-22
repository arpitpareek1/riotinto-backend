const News = require("../models/newsModel");


const validateAnnouncement = (announcement) => {
    console.log(announcement);
    const errors = [];

    if (!announcement.title) {
        errors.push('Title is required');
    }

    if (!announcement.date || !isValidDate(announcement.date)) {
        errors.push('Invalid date format');
    }

    if (!announcement.description) {
        errors.push('Description is required');
    }

    if (!announcement.imageSource || !isValidUrl(announcement.imageSource)) {
        errors.push('Invalid image URL');
    }

    if (!announcement.category) {
        errors.push('Category is required');
    }

    return errors;
};

const isValidDate = (dateString) => {
    // Implement your date validation logic here
    // For simplicity, assuming any non-empty string is valid in this example
    return !!dateString;
};

const isValidUrl = (url) => {
    // Implement your URL validation logic here
    // For simplicity, assuming any non-empty string is valid in this example
    return !!url;
};


const insertNews = async (req, res) => {
    try {
        const newNews = req.body;

        const errors = validateAnnouncement(newNews);

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const newNewsData = await News.create(req.body);

        res.status(201).json(newNewsData);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAllNews = async (req, res) => {
    try {
        const getAllNewsData = await News.find();
        res.status(200).json(getAllNewsData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateNews = async (req, res) => {
    const updatedAnnouncement = req.body;
    const { _id } = req.body

    const errors = validateAnnouncement(updatedAnnouncement);
    
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const NewsData = await News.findByIdAndUpdate(
            _id,
            updatedAnnouncement,
            { new: true }
        );

        if (!NewsData) {
            return res.status(404).json({ error: 'News not found' });
        }

        res.status(200).json(NewsData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    insertNews,
    getAllNews,
    updateNews
}