import Log from '../models/Log.js';

export const logAction = async ({ user, role, action, entityType, entityName }) => {
  try {
    await Log.create({ user, role, action, entityType, entityName });
  } catch (err) {
    console.error('❌ Failed to log action:', err.message);
  }
};
