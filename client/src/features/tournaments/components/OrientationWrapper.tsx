import React from "react";
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
  return (
    <div className="grid lg:grid-cols-12 gap-12 items-start">
      {/* Left Column: Media + Info + Scanner */}
      <div className="lg:col-span-5 space-y-10">
        {poster}
        {details}
      </div>

      {/* Right Column: Registration Form */}
      <div className="lg:col-span-7">
        {form}
      </div>
    </div>
  );
};

export default OrientationWrapper;
