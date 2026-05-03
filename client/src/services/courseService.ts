import api from "@/lib/api";
import { Course, CourseEnrollment } from "@/types";

export const courseService = {
  // ... (keep your existing getAll, create, update, delete, and uploadImage functions)

  /**
   * ENROLL SERVICE - UPDATED
   * This function now converts the plain JS object into FormData 
   * to support file uploads for ageProof and paymentProof.
   */
  enroll: async (courseId: string | number, data: any): Promise<CourseEnrollment> => {
    const formData = new FormData();

    // 1. Append text fields 
    // We iterate through the data object to append values like studentName, email, etc.
    Object.keys(data).forEach((key) => {
      // We handle the file objects separately below to ensure they are appended correctly
      if (key !== "ageProof" && key !== "paymentProof" && data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    // 2. Append File objects (Critical for Multer on the backend)
    // These keys ('ageProof', 'paymentProof') must match your course.routes.js configuration
    if (data.ageProof instanceof File) {
      formData.append("ageProof", data.ageProof);
    }
    
    if (data.paymentProof instanceof File) {
      formData.append("paymentProof", data.paymentProof);
    }

    // 3. Send the POST request
    // Axios automatically sets the boundary for 'multipart/form-data' when it sees FormData
    const res = await api.post(`/courses/${courseId}/enroll`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Return the data nested within the success response
    return res.data.data;
  }
};
