import React from "react";

type SectionHeadingProps = {
  children: React.ReactNode;
};

export default function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2 className=" mt-8 sm:mt-0 text-xl sm:text-3xl font-medium capitalize mb-8 text-center">
      {children}
    </h2>
  );
}
