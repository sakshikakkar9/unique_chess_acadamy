import api from "@/lib/api";
import { Course, CourseEnrollment } from "@/types";

export const courseService = {
  getAll: async (): Promise<Course[]> => {
    const res = await api.get("/courses");
    return res.data;
  },

  /**
   * CREATE COURSE - UPDATED
   * Converts JSON to FormData to support the banner image upload.
   */
  create: async (data: any): Promise<Course> => {
    let payload;
    if (data instanceof FormData) {
      payload = data;
    } else {
      payload = new FormData();
      Object.keys(data).forEach((key) => {
        if (key !== "image" && key !== "banner" && key !== "scanner" && key !== "scannerUrl" && data[key] !== undefined) {
          if (Array.isArray(data[key])) {
            payload.append(key, JSON.stringify(data[key]));
          } else {
            payload.append(key, data[key]);
          }
        }
      });

      const imageFile = data.image || data.banner || data.custom_banner_url;
      if (imageFile instanceof File) {
        payload.append("image", imageFile);
      }

      const brochureFile = data.brochure || data.brochureUrl;
      if (brochureFile instanceof File) {
        payload.append("brochure", brochureFile);
      }

      const scannerFile = data.scanner || data.scannerUrl;
      if (scannerFile instanceof File) {
        payload.append("scanner", scannerFile);
      }
    }

    const res = await api.post("/courses", payload);
    return res.data;
  },

  /**
   * UPDATE COURSE - UPDATED
   * Uses FormData to allow updating the course details and banner image.
   */
  update: async (id: number | string, data: any): Promise<Course> => {
    let payload;
    if (data instanceof FormData) {
      payload = data;
    } else {
      payload = new FormData();
      Object.keys(data).forEach((key) => {
        if (key !== "image" && key !== "banner" && key !== "scanner" && key !== "scannerUrl" && data[key] !== undefined) {
          if (Array.isArray(data[key])) {
            payload.append(key, JSON.stringify(data[key]));
          } else {
            payload.append(key, data[key]);
          }
        }
      });

      const imageFile = data.image || data.banner || data.custom_banner_url;
      if (imageFile instanceof File) {
        payload.append("image", imageFile);
      }

      const brochureFile = data.brochure || data.brochureUrl;
      if (brochureFile instanceof File) {
        payload.append("brochure", brochureFile);
      }

      const scannerFile = data.scanner || data.scannerUrl;
      if (scannerFile instanceof File) {
        payload.append("scanner", scannerFile);
      }
    }

    const res = await api.put(`/courses/${id}`, payload);
    return res.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },

  uploadImage: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("image", file);
    const res = await api.post("/courses/upload-image", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.imageUrl; 
  },

  /**
   * ENROLL SERVICE
   * Handles user enrollment with age and payment proof documents.
   */
  enroll: async (courseId: string | number, data: any): Promise<CourseEnrollment> => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key !== "ageProof" && key !== "paymentProof" && data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    if (data.ageProof instanceof File) {
      formData.append("ageProof", data.ageProof);
    }
    
    if (data.paymentProof instanceof File) {
      formData.append("paymentProof", data.paymentProof);
    }

    const res = await api.post(`/courses/${courseId}/enroll`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data;
  }
};
