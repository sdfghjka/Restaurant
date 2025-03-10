'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = await queryInterface.sequelize.query('SELECT id, name FROM Categories');
    const categoryMap = Object.fromEntries(categories[0].map(category => [category.name, category.id]));

    const restaurants = [
      {
        name: 'Sababa 沙巴巴中東美食',
        name_en: 'Sababa Pita Bar',
        categoryId: categoryMap['中東料理'] || null,
        location: '台北市羅斯福路三段 283 巷 17 號',
        phone: '02 2363 8009',
        google_map: 'https://goo.gl/maps/BJdmLuVdDbw',
        rating: 4.1,
        description: '沙巴巴批塔是台灣第一家純手工批塔專賣店,只選用最新鮮的頂級原料,以及道地的中東家傳配方。',
        image: 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5635/01.jpg',
        userId: 1,
        view_Counts: 0,
      },
      {
        name: '梅子鰻蒲燒專賣店',
        name_en: 'Umeko Japanese Unagi House',
        categoryId: categoryMap['日本料理'] || null,
        location: '台北市中山區林森北路 107 巷 8 號',
        phone: '02 2521 2813',
        google_map: 'https://goo.gl/maps/cUJEmFSRKyH2',
        rating: 4.3,
        description: '鰻魚、鰻魚飯、真空鰻魚',
        image: 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5628/02.jpg',
        userId: 1,
        view_Counts: 0,
      },
      {
        name: 'ZIGA ZIGA',
        name_en: 'Ziga Zaga',
        categoryId: categoryMap['義式餐廳'] || null,
        location: '台北市信義區松壽路 2 號',
        phone: '02 2720 1230',
        google_map: 'https://goo.gl/maps/bnZKC2YjYZp',
        rating: 4.2,
        description: '以頂級食材與料理技法完美呈現各類經典義式料理，獅頭造型烤爐現作pizza與開放式廚房現作龍蝦茄汁雞蛋銀絲麵是不可錯過的必嚐推薦！',
        image: 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5629/03.jpg',
        userId: 1,
        view_Counts: 0,
      },
      {
        name: '艾朋牛排餐酒館',
        name_en: 'A Point Steak & Bar',
        categoryId: categoryMap['美式'] || null,
        location: '110 台北市信義區忠孝東路五段 139 號 2 樓',
        phone: '02 2756 7788',
        google_map: 'https://goo.gl/maps/6Lq7U2ahp152',
        rating: 4.2,
        description: '艾朋牛排餐酒館提供高級料理與親切服務，讓顧客享用鮮嫩Steak牛排與義大利麵層次風味！',
        image: 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5630/04.jpg',
        userId: 1,
        view_Counts: 0,
      },
      {
        name: 'Gusto Pizza',
        name_en: 'Gusto Pizza',
        categoryId: categoryMap['義式餐廳'] || null,
        location: '北市中正區連雲街 74 號',
        phone: '02 2358 7001',
        google_map: 'https://goo.gl/maps/rqzbVyrR9Gp',
        rating: 4.7,
        description: '來自倫敦的披薩師傅帶來經典義大利披薩，麵團發酵24小時，堅持純手工與傳統製作。',
        image: 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5631/05.jpg',
        userId: 1,
        view_Counts: 0,
      },
      {
        name: 'WXYZ Bar',
        name_en: 'WXYZ Bar',
        categoryId: categoryMap['酒吧'] || null,
        location: '台北市中山區雙城街',
        phone: '02 7743 9999',
        google_map: 'https://goo.gl/maps/rFLNu87ruBM2',
        rating: 4.3,
        description: '現代創意料理酒吧，提供純素、無麩質與素食選擇。',
        image: 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5632/06.jpg',
        userId: 1,
        view_Counts: 0,
      },
      {
        name: 'Fika Fika Cafe',
        name_en: 'Fika Fika Cafe',
        categoryId: categoryMap['咖啡'] || null,
        location: '台北市中山區伊通街 33 號',
        phone: '02 2507 0633',
        google_map: 'https://goo.gl/maps/Y1iyiSK7EeR2',
        rating: 4.3,
        description: '我們在乎每位顧客與每滴咖啡，希望將這份美好體驗分享給大家。',
        image: 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5633/07.jpg',
        userId: 1,
        view_Counts: 0,
      },
      {
        name: '布娜飛比利時啤酒餐廳',
        name_en: 'Bravo Beer',
        categoryId: categoryMap['義式餐廳'] || null,
        location: '台北市松山區市民大道四段 185 號',
        phone: '02 2570 1255',
        google_map: 'https://goo.gl/maps/V9mKwVJ4s5v',
        rating: 4.7,
        description: 'Bravo Beer 帶來美食與對生活的熱情，讓大家輕鬆品嚐美酒與美食。',
        image: 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5634/08.jpg',
        userId: 1,
        view_Counts: 0,
      },
    ].map(restaurant => ({ ...restaurant, createdAt: new Date(), updatedAt: new Date() }));

    await queryInterface.bulkInsert('Restaurants', restaurants);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Restaurants', null, {});
  },
};
