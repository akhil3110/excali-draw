"use client"

import { Toaster } from "react-hot-toast";
import ModalProider from "./modalProvider";


export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <>
        <ModalProider />
        <Toaster />
        {children}
    </>
  );
}
