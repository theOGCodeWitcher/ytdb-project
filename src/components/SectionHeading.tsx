import React from "react";

type SectionHeadingProps = {
  children: React.ReactNode;
};

export default function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2 className=" text-xl sm:text-3xl font-bold capitalize text-center md:mt-2 md:py-2  mx-2 md:px-2 ">
      {children}
    </h2>
  );
}
