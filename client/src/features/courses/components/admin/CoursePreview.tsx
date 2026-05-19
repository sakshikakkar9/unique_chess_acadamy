import React from "react";
import { Course } from "@/types";
import { CoursePublicView } from "../public/CoursePublicView";

interface CoursePreviewProps {
  course: Course;
}

const CoursePreview: React.FC<CoursePreviewProps> = ({ course }) => {
  return (
    <div className="bg-slate-50 p-4 sm:p-8 rounded-[2rem] border border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
           <div>
              <h2 className="text-xl font-bold text-slate-900">Program Preview</h2>
              <p className="text-sm text-slate-500">This is exactly how students see your enrollment page.</p>
           </div>
           <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Live Preview</span>
        </div>
        <CoursePublicView
          course={course}
          isPreview={true}
        />
      </div>
    </div>
  );
};

export default CoursePreview;
