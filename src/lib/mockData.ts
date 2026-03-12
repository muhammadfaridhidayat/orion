export type Applicant = {
  id: string;
  fullName: string;
  nim: string;
  semester: string;
  division: "Programming" | "Electronic" | "Mechanic";
  status: "Pending" | "Verified" | "Rejected";
  date: string;
};

export const MOCK_APPLICANTS: Applicant[] = [
  { id: "APP-001", fullName: "Alice Chen", nim: "H071231001", semester: "3", division: "Programming", status: "Verified", date: "2026-03-10" },
  { id: "APP-002", fullName: "Bob Smith", nim: "H071231014", semester: "3", division: "Mechanic", status: "Pending", date: "2026-03-11" },
  { id: "APP-003", fullName: "Charlie Davis", nim: "H071231022", semester: "5", division: "Electronic", status: "Pending", date: "2026-03-11" },
  { id: "APP-004", fullName: "Diana Prince", nim: "H071231089", semester: "1", division: "Programming", status: "Rejected", date: "2026-03-11" },
  { id: "APP-005", fullName: "Evan Wright", nim: "H071231045", semester: "3", division: "Electronic", status: "Verified", date: "2026-03-12" },
];

export const MOCK_STATS = {
  totalProgramming: 45,
  totalElectronic: 32,
  totalMechanic: 38,
  pendingReview: 15,
  accepted: 8,
};

export const CHART_DATA = [
  { day: "Mon", programming: 4, electronic: 2, mechanic: 3 },
  { day: "Tue", programming: 7, electronic: 5, mechanic: 4 },
  { day: "Wed", programming: 12, electronic: 8, mechanic: 10 },
  { day: "Thu", programming: 15, electronic: 12, mechanic: 11 },
  { day: "Fri", programming: 22, electronic: 15, mechanic: 14 },
  { day: "Sat", programming: 30, electronic: 22, mechanic: 25 },
  { day: "Sun", programming: 45, electronic: 32, mechanic: 38 },
];
