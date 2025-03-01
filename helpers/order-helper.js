const getOrder = (req) => {
    const order = Number(req.query.order);
  
    switch (order) {
      case 1:
        return [['view_Counts', 'DESC']];
      case 2:
        return [['createdAt', 'DESC']];
      default:
        return [];
    }
  };
  
  module.exports = {
    getOrder
  };
  