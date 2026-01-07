import { EnquiryListResponse, Enquiry, UpdateStatusRequest, UpdateStatusResponse } from "@/types/enquiry";

// Change this to your production URL when deploying
const API_BASE_URL = "https://legal-backend-4lvd.onrender.com/api";
const TRACK_API_URL = "https://legal-backend-4lvd.onrender.com/api";

export const enquiryApi = {
  // Get all enquiries
  getAllEnquiries: async (): Promise<EnquiryListResponse> => {
    const response = await fetch(`${API_BASE_URL}/admin/enquiry/getAlldata`);
    if (!response.ok) {
      throw new Error("Failed to fetch enquiries");
    }
    return response.json();
  },

  // Get single enquiry by tracking ID
  getEnquiryByTrackingId: async (trackingId: string): Promise<Enquiry> => {
    const response = await fetch(`${TRACK_API_URL}/enquiry/track/${trackingId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch enquiry details");
    }
    return response.json();
  },

  // Update enquiry status
  updateEnquiryStatus: async (data: UpdateStatusRequest): Promise<UpdateStatusResponse> => {
    const response = await fetch(`${API_BASE_URL}/admin/enquiry/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update status");
    }
    return response.json();
  },
};
