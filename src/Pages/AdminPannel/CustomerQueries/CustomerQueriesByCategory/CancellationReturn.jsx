import React from "react";
import BaseQueryCategoryPage from "./BaseQueryCategoryPage";

const CancellationReturn = () => {
  return (
    <BaseQueryCategoryPage
      categoryTitle="Cancellation / Return"
      queryTypes={["Billing"]}
    />
  );
};

export default CancellationReturn;
