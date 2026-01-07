export interface TimelineEntry {
  status: string;
  remark: string;
  _id: string;
  updatedAt: string;
}

export interface Enquiry {
  _id: string;
  trackingId: string;
  name: string;
  mobile: string;
  email: string;
  caseType: string;
  description: string;
  currentStatus: string;
  timeline: TimelineEntry[];
  createdAt: string;
  __v: number;
}

export interface EnquiryListResponse {
  success: boolean;
  total: number;
  data: Enquiry[];
}

export interface UpdateStatusRequest {
  trackingId: string;
  status: string;
  remark: string;
}

export interface UpdateStatusResponse {
  success: boolean;
  message: string;
}
