
export type StudySpace = {
  id: string;
  name: string;
  building: string;
  floor: string;
  type: "Quiet" | "Group";
  seats: number;
  occupied: number;
  amenities: string[];
  description: string;
  slots: string[];
  bookedSlots: string[];
};

export type User = {
  fullName: string;
  section: string;
};

export type Booking = {
  id: string;
  spaceId: string;
  date: string;
  slot: string;
  groupSize: number;
  purpose: string;
};

export type FilterType = "All" | "Quiet" | "Group" | "Open now";

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  SpaceDetails: { spaceId: string };
  Booking: { spaceId: string };
};

export type TabParamList = {
  Explore: undefined;
  Bookings: undefined;
  Profile: undefined;
};
