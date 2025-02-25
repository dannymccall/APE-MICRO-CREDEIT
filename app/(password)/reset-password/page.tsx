import React, {Suspense} from "react";
import ResetPassword from "@/app/ui/Password/ResetPassword";
const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
};

export default page;
