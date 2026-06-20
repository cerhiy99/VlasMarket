'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('brends', 'nameuk', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn('brends', 'nameru', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('brends', 'nameuk');

    await queryInterface.removeColumn('brends', 'nameru');
  },
};
