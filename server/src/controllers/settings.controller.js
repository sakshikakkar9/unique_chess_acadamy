import { settingsService } from '../services/settings.service.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const getSettings = async (req, res) => {
  try {
    const settings = await settingsService.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updateData = {};

    if (req.files && req.files.scanner) {
      const scannerUrl = await uploadToCloudinary(req.files.scanner[0].buffer, 'settings');
      if (scannerUrl) {
        updateData.upiScannerUrl = scannerUrl;
      }
    }

    const settings = await settingsService.updateSettings(updateData);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};