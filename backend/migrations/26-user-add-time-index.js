import { Sequelize } from 'sequelize';

export default {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addIndex('users', ['createdAt'], {
            name: 'users_created_at_index'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeIndex('users', 'users_created_at_index');
    }
};
