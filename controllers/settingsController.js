const Settings = require('../models/settings');

const createSetting = async (key, value) => {
  try {
    const setting = await Settings.create({ key, value });
    return setting;
  } catch (error) {
    throw new Error(`Error creating setting: ${error.message}`);
  }
};

const getAllSettings = async () => {
  try {
    const settings = await Settings.find();
    return settings;
  } catch (error) {
    throw new Error(`Error getting settings: ${error.message}`);
  }
};

const getSettingByKey = async (key) => {
  try {
    const setting = await Settings.findOne({ key });
    return setting;
  } catch (error) {
    throw new Error(`Error getting setting: ${error.message}`);
  }
};

const updateSettingByKey = async (key, newValue) => {
  try {
    const setting = await Settings.findOneAndUpdate(
      { key },
      { $set: { value: newValue } },
      { new: true }
    );
    return setting;
  } catch (error) {
    throw new Error(`Error updating setting: ${error.message}`);
  }
};

const deleteSettingByKey = async (key) => {
  try {
    const result = await Settings.deleteOne({ key });
    return result.deletedCount > 0;
  } catch (error) {
    throw new Error(`Error deleting setting: ${error.message}`);
  }
};

module.exports = {
  createSetting,
  getAllSettings,
  getSettingByKey,
  updateSettingByKey,
  deleteSettingByKey,
};
