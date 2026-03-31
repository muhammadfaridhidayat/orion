export type Devision = "PROGRAMMING" | "ELECTRONICS" | "MECHANICAL";

export type Status = "PENDING" | "VERIFIED" | "REJECTED";

export interface NewMember {
  id: number;
  created_at: string;
  updated_at: string;
  full_name: string;
  nim: string;
  phone_number: string;
  semester: string;
  devision: Devision;
  motivation: string;
  payment: string;
  status: Status;
  batch_id: number;
  batch: Batch | null;
}

export interface Batch {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  new_members: NewMember[] | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("orion_admin_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || "An error occurred");
  }
  return json.data as T;
}

// BATCH ENDPOINTS
export const getBatches = async () => {
  const res = await fetch(`${API_URL}/api/v1/batch/all`, { 
    headers: getAuthHeaders(), 
    credentials: "include" 
  });
  return handleResponse<{ batches: Batch[] }>(res);
};

export const getActiveBatch = async () => {
  const res = await fetch(`${API_URL}/api/v1/batch/active`, { 
    headers: getAuthHeaders(), 
    credentials: "include" 
  });
  return handleResponse<{ batch: Batch }>(res);
};

export const createBatch = async (data: Partial<Batch>) => {
  const res = await fetch(`${API_URL}/api/v1/batch/create`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<{ batch: Batch }>(res);
};

export const updateBatch = async (id: number, data: Partial<Batch>) => {
  const res = await fetch(`${API_URL}/api/v1/batch/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<void>(res);
};

export const setActiveBatch = async (id: number, isActive: boolean) => {
  const res = await fetch(`${API_URL}/api/v1/batch/${id}/active`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({ is_active: isActive }),
  });
  return handleResponse<{ id: number; is_active: boolean }>(res);
};

export const deleteBatch = async (id: number) => {
  const res = await fetch(`${API_URL}/api/v1/batch/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<void>(res);
};

// MEMBER ENDPOINTS
export const getMembers = async (page = 1, limit = 10, query = "") => {
  const res = await fetch(`${API_URL}/api/v1/member/all?page=${page}&limit=${limit}&query=${query}`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<{ members: NewMember[] }>(res);
};

export const updateMemberStatus = async (id: number, status: Status) => {
  const res = await fetch(`${API_URL}/api/v1/member/${id}/status`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  return handleResponse<{ id: number; status: Status }>(res);
};

export const deleteMember = async (id: number) => {
  const res = await fetch(`${API_URL}/api/v1/member/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<void>(res);
};

export interface TrendData {
  day: string;
  programming: number;
  electronic: number;
  mechanic: number;
}

export const getRegistrationTrend = async () => {
  const res = await fetch(`${API_URL}/api/v1/member/trend`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<{ trends: TrendData[] }>(res);
};
