import React from "react";
import BaseQueryCategoryPage from "./BaseQueryCategoryPage";

const OrderServiceStatus = () => {
  return (
    <BaseQueryCategoryPage
      categoryTitle="Order / Service Status"
      queryTypes={["Order Status"]}
    />
  );
};

export default OrderServiceStatus;
