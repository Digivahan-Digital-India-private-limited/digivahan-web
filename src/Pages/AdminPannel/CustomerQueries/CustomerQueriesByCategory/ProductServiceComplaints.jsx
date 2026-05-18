import React from "react";
import BaseQueryCategoryPage from "./BaseQueryCategoryPage";

const ProductServiceComplaints = () => {
  return (
    <BaseQueryCategoryPage
      categoryTitle="Product / Service Complaints"
      queryTypes={["Product"]}
    />
  );
};

export default ProductServiceComplaints;
