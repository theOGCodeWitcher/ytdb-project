import React from "react";

type SectionHeadingProps = {
  children: React.ReactNode;
};

export default function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2 className=" mt-8 sm:mt-4 text-xl sm:text-3xl font-medium capitalize mb-8 md:mb-6  mx-8">
      {children}
    </h2>
  );
}
