import React from "react";

type SectionHeadingProps = {
  children: React.ReactNode;
};

export default function MessageComponent({ children }: SectionHeadingProps) {
  return (
    <h2 className=" md:text-xl text-xs font-semibold capitalize text-red-600 text-center md:mt-2 md:py-2  mx-2 md:px-2 ">
      {children}
    </h2>
  );
}
