/**
 * Global Sequelize Hooks
 */
export const generateIdHooks = {
  beforeCreate: async (instance: any) => {
    const { nanoid } = await import('nanoid'); // Dynamically import nanoid
    if (!instance.id) {
      instance.id = nanoid(); // Automatically set ID if not provided
    }
  },
  beforeBulkCreate: async (instances: any[]) => {
    const { nanoid } = await import('nanoid'); // Dynamically import nanoid
    instances.forEach((instance) => {
      if (!instance.id) {
        instance.id = nanoid(); // Automatically set ID for each instance
      }
    });
  },
};
