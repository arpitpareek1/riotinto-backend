const express = require('express');
const settingsController = require('../controllers/settingsController');
const router = express.Router();
router.post('/insert', async (req, res) => {
    const { key, value } = req.body;
    try {
        const setting = await settingsController.createSetting(key, value);
        res.status(201).json(setting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/getAll', async (req, res) => {
    try {
        const settings = await settingsController.getAllSettings();
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put('/update', async (req, res) => {
    const { key, value } = req.body;
    try {
        const setting = await settingsController.updateSettingByKey(key, value);
        if (setting) {
            res.status(200).json(setting);
        } else {
            res.status(404).json({ error: 'Setting not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
