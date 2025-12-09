import apiClient, { PaginationParams, PaginatedResponse } from './apiClient';

// Types - Updated to match backend model
// Types - Updated to handle Production Data (Old Schema) and Requested Form (New Schema)
export interface Event {
  _id: string;
  // Production Fields (Priority)
  title?: string;
  venue?: string; // or address?
  date?: string; // ISO string
  description: string;
  registeredUsers?: any[]; // Array of objects
  createdBy?: any;
  status?: string;

  // Potential New Schema Fields (Fallback)
  name?: string;
  location?: string;
  from?: { date: string; time: string };
  to?: { date: string; time: string };
  eventType?: string;
  registrationLink?: string;
  lastDateToRegister?: string;
  image?: string;
  createdAt: string;
}

// Payload sent to Backend (Mapped from Form)
export interface CreateEventPayload {
  title: string;
  description: string;
  date: string;
  venue: string;
  event_type?: string; // Mapped from eventType
  registration_link?: string;
  // Extras
  [key: string]: any; 
}

export interface CreateEventData {
  // Form State Structure (New Model)
  name: string;
  description: string;
  from: {
    date: string;
    time: string;
  };
  to: {
    date: string;
    time: string;
  };
  location: string;
  eventType: string;
  registrationLink: string;
  lastDateToRegister: string;
  image?: string;
}

export interface EventSearchParams extends PaginationParams {
  query?: string;
  eventType?: Event['eventType'];
  startDate?: string;
  endDate?: string;
}

// Backend response: Events controller returns direct objects (no { success, data } wrapper!)

// API Functions
export const getAllEvents = async (params?: EventSearchParams): Promise<Event[]> => {
  const response = await apiClient.get<any>('/events', { params });
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.data.data)) return response.data.data;
  return [];
};

export const getEvent = async (id: string): Promise<Event> => {
  // Backend returns event directly
  const response = await apiClient.get<Event>(`/events/${id}`);
  return response.data;
};

export const createEvent = async (data: CreateEventData): Promise<Event> => {
  // Transform Form Data to Backend Payload
  const payload: CreateEventPayload = {
      title: data.name,
      description: data.description,
      venue: data.location,
      date: new Date(`${data.from.date}T${data.from.time}`).toISOString(),
      event_type: data.eventType,
      registration_link: data.registrationLink,
      // Pass through new fields as well for future compatibility
      name: data.name,
      from: data.from,
      to: data.to,
      location: data.location,
      eventType: data.eventType,
      lastDateToRegister: data.lastDateToRegister,
      image: data.image
  };

  const response = await apiClient.post<Event>('/events', payload);
  return response.data;
};

export const updateEvent = async (id: string, data: Partial<CreateEventData>): Promise<Event> => {
  const response = await apiClient.put<Event>(`/events/${id}`, data);
  return response.data;
};

export const deleteEvent = async (id: string): Promise<void> => {
  await apiClient.delete(`/events/${id}`);
};

export const registerForEvent = async (id: string, userId: string): Promise<Event> => {
  // Backend expects POST /events/:id/register with userId in body
  const response = await apiClient.post<Event>(`/events/${id}/register`, { userId });
  return response.data;
};

export const cancelRegistration = async (id: string, userId: string): Promise<Event> => {
  // Backend uses POST /events/:id/unregister (not DELETE)
  const response = await apiClient.post<Event>(`/events/${id}/unregister`, { userId });
  return response.data;
};

export const getEventAttendees = async (id: string): Promise<{ id: string; name: string; avatarUrl?: string }[]> => {
  // Backend route is /events/:id/users (not /attendees)
  const response = await apiClient.get<{ id: string; name: string; avatarUrl?: string }[]>(
    `/events/${id}/users`
  );
  return response.data || [];
};

// TODO: Following endpoint is NOT implemented in backend yet
export const getMyEvents = async (): Promise<Event[]> => {
  const response = await apiClient.get<{ success: boolean; data: Event[] }>('/events/my-events');
  return response.data.data || [];
};

