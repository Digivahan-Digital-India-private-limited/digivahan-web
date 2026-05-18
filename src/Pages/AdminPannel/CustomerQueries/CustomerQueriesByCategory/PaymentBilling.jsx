import React from "react";
import BaseQueryCategoryPage from "./BaseQueryCategoryPage";

const PaymentBilling = () => {
  return (
    <BaseQueryCategoryPage
      categoryTitle="Payment / Billing"
      queryTypes={["Payment"]}
    />
  );
};

export default PaymentBilling;
