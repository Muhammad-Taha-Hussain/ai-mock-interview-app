import React from "react";
import Header from "./_components/Header";
import { Toaster } from "/components/ui/sonner";

function DashBoardLayout({ children }) {
  return (
    <div className="flex flex-col justify-center">
      <Header />
      <div className="mx-5 md:mx-20 lg:mx-36">
        <Toaster />
        {children}
      </div>
    </div>
  );
}

export default DashBoardLayout;
