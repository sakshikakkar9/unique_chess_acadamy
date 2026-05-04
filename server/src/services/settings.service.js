import prisma from '../../lib/prisma.js';

export const settingsService = {
  getSettings: async () => {
    return await prisma.globalSettings.upsert({
      where: { id: 'default' },
      update: {},
      create: { id: 'default' }
    });
  },

  updateSettings: async (data) => {
    return await prisma.globalSettings.upsert({
      where: { id: 'default' },
      update: data,
      create: { id: 'default', ...data }
    });
  }
};