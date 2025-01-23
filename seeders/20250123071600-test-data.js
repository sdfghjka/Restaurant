'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('restaurants',
      Array.from({ length: 10 }).map((_, i) =>
        ({
          name: `Restaurant ${i + 1}`,
          name_en: `Restaurant EN ${i + 1}`,
          category: ["Japanese", "Italian", "Chinese", "French", "Korean"][i % 5],
          location: `City ${i + 1}, Street ${i * 10 + 1}`,
          phone: `090-${1000 + i}-${2000 + i}`,
          google_map: `https://www.google.com/maps?q=Restaurant+${i + 1}`,
          rating: (Math.random() * 5).toFixed(1), 
          description: `This is a description of Restaurant ${i + 1}. Known for its delicious ${["sushi", "pizza", "dumplings", "croissants", "kimchi"][i % 5]}.`,
          image: `https://via.placeholder.com/150?text=Restaurant+${i + 1}`,
        }))
    )
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('restaurant',null);
  }
};
