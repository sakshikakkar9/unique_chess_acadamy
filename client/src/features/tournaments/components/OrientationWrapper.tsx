import React from "react";
import { Tournament } from "@/types";
import { cn } from "@/lib/utils";

interface OrientationWrapperProps {
  orientation?: "LANDSCAPE" | "PORTRAIT";
  poster: React.ReactNode;
  details: React.ReactNode;
  form: React.ReactNode;
}

const OrientationWrapper: React.FC<OrientationWrapperProps> = ({
  orientation = "LANDSCAPE",
  poster,
  details,
  form
}) => {
  if (orientation === "PORTRAIT") {
    return (
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Poster (Fixed/Sticky on Desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
          {poster}
          <div className="hidden lg:block">
            {details}
          </div>
        </div>

        {/* Right Side: Details (on mobile) and Form */}
        <div className="lg:col-span-7 space-y-8">
          <div className="lg:hidden">
            {details}
          </div>
          {form}
        </div>
      </div>
    );
  }

  // LANDSCAPE: Hero style (Full width top)
  return (
    <div className="space-y-12">
      <div className="w-full">
        {poster}
      </div>
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5">
          {details}
        </div>
        <div className="lg:col-span-7">
          {form}
        </div>
      </div>
    </div>
  );
};

export default OrientationWrapper;
