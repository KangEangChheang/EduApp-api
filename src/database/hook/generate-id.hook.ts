import { nanoid } from 'nanoid';

/**
 * Global Sequelize Hooks
 */
export const generateIdHooks = {
  beforeCreate: (instance: any) => {
    if (!instance.id) {
      instance.id = nanoid(); // Automatically set ID if not provided
    }
  },
  beforeBulkCreate: (instances: any[]) => {
    instances.forEach((instance) => {
      if (!instance.id) {
        instance.id = nanoid(); // Automatically set ID for each instance
      }
    });
  },
};
