export type NavItem = {
  title: string;
  href: string;
  iconName: string;
  badge?: number | string;
  badgeColor?: string;
};

export type MetricCardData = {
  id: string;
  badgeLabel?: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  comparisonPeriod: string;
  iconColor: string;
  iconBg: string;
  sparklineColor: string;
  sparklineData: number[];
  icon: string;
};

export type UserGrowthPoint = {
  date: string;
  newUsers: number;
  activeUsers: number;
};

export type VerificationStatusData = {
  status: "Approved" | "Pending" | "Rejected";
  count: number;
  percentage: number;
  color: string;
};

export type RevenueDataPoint = {
  date: string;
  grossRevenue: number;
  netRevenue: number;
};

export type UserStatus = "Active" | "Pending" | "Inactive" | "Banned" | "Suspended";

export type RecentUser = {
  id: string;
  userId: string;
  name: string;
  phone: string;
  status: UserStatus;
  joinDate: string;
  avatar: string;
  email?: string;
  gender?: string;
  location?: string;
  matchesCount?: number;
};

export type RiskLevel = "Low" | "Medium" | "High";

export type VerificationQueueItem = {
  id: string;
  userId: string;
  userName?: string;
  documentType: "Aadhaar" | "Selfie" | "PAN" | "Passport" | "Driving License";
  riskScore: RiskLevel;
  date?: string;
  status?: "Pending" | "Approved" | "Rejected";
  submittedAt?: string;
};

export type ReportStatus = "Open" | "Under Review" | "Resolved" | "Dismissed";

export type RecentReport = {
  id: string;
  userId: string;
  reportedUser?: string;
  reason: string;
  status: ReportStatus;
  date: string;
  severity?: "Low" | "Medium" | "High";
  description?: string;
};

export type SystemHealthItem = {
  name: string;
  status: "Operational" | "Degraded" | "Outage";
  uptimePercentage: number;
  latency?: string;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export type ProfileData = {
  id: string;
  userId: string;
  name: string;
  age: number;
  avatar: string;
  bio: string;
  interests: string[];
  occupation: string;
  education: string;
  completionPercent: number;
  photoCount: number;
  profileStatus: "Complete" | "Incomplete" | "Flagged" | "Under Review";
  photoStatus: "Approved" | "Pending" | "Rejected";
  joinDate: string;
  location: string;
  gender: string;
};

export type PrivacyRequest = {
  id: string;
  userId: string;
  userName: string;
  requestType: "Account Deletion" | "Data Export" | "Deactivation" | "Reactivation" | "Privacy Inquiry";
  status: "Pending" | "Processing" | "Completed" | "Rejected";
  submittedAt: string;
  resolvedAt?: string;
  reason?: string;
};

export type PaymentTransaction = {
  id: string;
  txId: string;
  userId: string;
  userName: string;
  amount: string;
  method: "UPI" | "Credit Card" | "Debit Card" | "NetBanking";
  gateway: "Razorpay" | "PhonePe" | "Stripe";
  status: "Success" | "Pending" | "Failed" | "Refunded";
  date: string;
  plan?: string;
};

export type EngagementTrendPoint = {
  date: string;
  likes: number;
  matches: number;
  profileViews: number;
  messages: number;
};


