// Centralized Admin Authentication & RBAC Store

export type AdminRole =
  | "Super Admin"
  | "Safety Moderator"
  | "Billing Lead"
  | "Support Specialist";

export type PermissionKey =
  | "Users Read / Write"
  | "Verification Actions"
  | "Moderation & Bans"
  | "Billing & Refunds"
  | "CMS Publishing"
  | "System Settings";

export type RolePermissionsMap = Record<AdminRole, Record<PermissionKey, boolean>>;

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: AdminRole;
  lastLogin: string;
  status: "Active" | "Pending" | "Inactive";
  avatar: string;
  recentActivity: string[];
}

export const PERMISSION_LIST: PermissionKey[] = [
  "Users Read / Write",
  "Verification Actions",
  "Moderation & Bans",
  "Billing & Refunds",
  "CMS Publishing",
  "System Settings",
];

export const DEFAULT_ROLE_PERMISSIONS: RolePermissionsMap = {
  "Super Admin": {
    "Users Read / Write": true,
    "Verification Actions": true,
    "Moderation & Bans": true,
    "Billing & Refunds": true,
    "CMS Publishing": true,
    "System Settings": true,
  },
  "Safety Moderator": {
    "Users Read / Write": true,
    "Verification Actions": true,
    "Moderation & Bans": true,
    "Billing & Refunds": false,
    "CMS Publishing": false,
    "System Settings": false,
  },
  "Billing Lead": {
    "Users Read / Write": false,
    "Verification Actions": false,
    "Moderation & Bans": false,
    "Billing & Refunds": true,
    "CMS Publishing": false,
    "System Settings": false,
  },
  "Support Specialist": {
    "Users Read / Write": false,
    "Verification Actions": false,
    "Moderation & Bans": false,
    "Billing & Refunds": false,
    "CMS Publishing": false,
    "System Settings": false,
  },
};

export const DEFAULT_ADMIN_USERS: AdminAccount[] = [
  {
    id: "adm1",
    name: "Admin User",
    email: "admin@datingapp.internal",
    password: "password123",
    role: "Super Admin",
    lastLogin: "Just now",
    status: "Active",
    avatar: "A",
    recentActivity: [
      "Configured RBAC permissions for Safety Moderator on Oct 28",
      "Exported quarterly revenue financial reports",
      "Approved system microservices health check",
    ],
  },
  {
    id: "adm2",
    name: "Priya Menon",
    email: "priya.m@datingapp.internal",
    password: "password123",
    role: "Safety Moderator",
    lastLogin: "2 hours ago",
    status: "Active",
    avatar: "P",
    recentActivity: [
      "Resolved harassment report #r2 on Oct 28",
      "Approved 18 government ID documents in verification queue",
      "Issued warning notice to account #10478",
    ],
  },
  {
    id: "adm3",
    name: "Dev Sharma",
    email: "dev.s@datingapp.internal",
    password: "password123",
    role: "Billing Lead",
    lastLogin: "Yesterday 18:20",
    status: "Active",
    avatar: "D",
    recentActivity: [
      "Reviewed UPI payment webhook anomalies",
      "Updated VIP Diamond annual discount promo banner",
      "Processed refund for transaction TXN_982140",
    ],
  },
  {
    id: "adm4",
    name: "Kavita Roy",
    email: "kavita.r@datingapp.internal",
    password: "password123",
    role: "Support Specialist",
    lastLogin: "3 days ago",
    status: "Active",
    avatar: "K",
    recentActivity: [
      "Answered 24 support tickets in customer queue",
      "Escalated account reactivation request #pr_4",
    ],
  },
];

const ADMINS_STORAGE_KEY = "dating_admin_accounts";
const SESSION_STORAGE_KEY = "dating_admin_session";
const ROLES_STORAGE_KEY = "dating_admin_role_permissions";

// Fetch all registered admins from localStorage (or defaults)
export function getRegisteredAdmins(): AdminAccount[] {
  if (typeof window === "undefined") return DEFAULT_ADMIN_USERS;
  try {
    const raw = localStorage.getItem(ADMINS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_USERS));
      return DEFAULT_ADMIN_USERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse admins from storage:", err);
    return DEFAULT_ADMIN_USERS;
  }
}

// Save admins to localStorage
export function saveRegisteredAdmins(admins: AdminAccount[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(admins));
    queueMicrotask(() => {
      window.dispatchEvent(new Event("admin_accounts_updated"));
    });
  } catch (err) {
    console.error("Failed to save admins:", err);
  }
}

// Fetch role permissions matrix from localStorage (or defaults)
export function getRolePermissions(): RolePermissionsMap {
  if (typeof window === "undefined") return DEFAULT_ROLE_PERMISSIONS;
  try {
    const raw = localStorage.getItem(ROLES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(DEFAULT_ROLE_PERMISSIONS));
      return DEFAULT_ROLE_PERMISSIONS;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_ROLE_PERMISSIONS,
      ...parsed,
    };
  } catch (err) {
    console.error("Failed to parse role permissions:", err);
    return DEFAULT_ROLE_PERMISSIONS;
  }
}

// Save role permissions matrix to localStorage
export function saveRolePermissions(permissions: RolePermissionsMap): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(permissions));
    if (typeof document !== "undefined") {
      document.cookie = `dating_admin_perms=${encodeURIComponent(JSON.stringify(permissions))}; path=/; max-age=86400; SameSite=Lax`;
    }
    queueMicrotask(() => {
      window.dispatchEvent(new Event("admin_roles_updated"));
    });
  } catch (err) {
    console.error("Failed to save role permissions:", err);
  }
}

// Check if a role has a specific permission
export function hasPermission(
  role: string,
  permission: PermissionKey,
  permissionsMap?: RolePermissionsMap
): boolean {
  if (role === "Super Admin") return true;
  const map = permissionsMap || getRolePermissions();
  const rolePerms = map[role as AdminRole];
  if (!rolePerms) return false;
  return Boolean(rolePerms[permission]);
}

// Sync session cookies for backend/middleware enforcement
function syncAuthCookies(admin: AdminAccount | null) {
  if (typeof document === "undefined") return;
  if (!admin) {
    document.cookie = "dating_admin_role=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "dating_admin_email=; path=/; max-age=0; SameSite=Lax";
  } else {
    document.cookie = `dating_admin_role=${encodeURIComponent(admin.role)}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `dating_admin_email=${encodeURIComponent(admin.email)}; path=/; max-age=86400; SameSite=Lax`;
    const perms = getRolePermissions();
    document.cookie = `dating_admin_perms=${encodeURIComponent(JSON.stringify(perms))}; path=/; max-age=86400; SameSite=Lax`;
  }
}

// Get currently active logged-in admin
export function getCurrentAdmin(): AdminAccount | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      const defaultAdmin = DEFAULT_ADMIN_USERS[0];
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(defaultAdmin));
      syncAuthCookies(defaultAdmin);
      return defaultAdmin;
    }
    const parsed = JSON.parse(raw) as AdminAccount;
    syncAuthCookies(parsed);
    return parsed;
  } catch {
    return DEFAULT_ADMIN_USERS[0];
  }
}

// Set current logged-in admin session
export function setCurrentAdmin(admin: AdminAccount | null): void {
  if (typeof window === "undefined") return;
  if (!admin) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    syncAuthCookies(null);
  } else {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(admin));
    syncAuthCookies(admin);
  }
  window.dispatchEvent(new Event("admin_session_changed"));
}

// Check if a path is permitted for a role & its assigned permissions
export function isRouteAllowedForRole(
  role: string,
  pathname: string,
  permissionsMap?: RolePermissionsMap
): boolean {
  if (role === "Super Admin") return true;

  // Every sub-admin gets their own role/privilege-based dashboard
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return true;
  }

  // Strictly Super Admin only routes
  if (
    pathname === "/admin-users" ||
    pathname.startsWith("/admin-users/") ||
    pathname === "/audit-logs" ||
    pathname.startsWith("/audit-logs/") ||
    pathname === "/analytics" ||
    pathname.startsWith("/analytics/")
  ) {
    return false;
  }

  // Privilege-based routes
  if (pathname === "/users" || pathname.startsWith("/users/")) {
    return hasPermission(role, "Users Read / Write", permissionsMap);
  }

  if (pathname === "/verification" || pathname.startsWith("/verification/")) {
    return hasPermission(role, "Verification Actions", permissionsMap);
  }

  if (pathname === "/moderation" || pathname.startsWith("/moderation/")) {
    return hasPermission(role, "Moderation & Bans", permissionsMap);
  }

  if (pathname === "/payments" || pathname.startsWith("/payments/")) {
    return hasPermission(role, "Billing & Refunds", permissionsMap);
  }

  if (pathname === "/subscriptions" || pathname.startsWith("/subscriptions/")) {
    // Only Super Admin by default, or Billing Lead only if explicitly needed?
    // Keep Billing Lead focused on Payments & Transactions per RBAC spec.
    return false;
  }

  if (pathname === "/cms" || pathname.startsWith("/cms/")) {
    return hasPermission(role, "CMS Publishing", permissionsMap);
  }

  if (
    pathname === "/settings" ||
    pathname.startsWith("/settings/") ||
    pathname === "/system-health" ||
    pathname.startsWith("/system-health/")
  ) {
    return hasPermission(role, "System Settings", permissionsMap);
  }

  if (pathname === "/support" || pathname.startsWith("/support/")) {
    return role === "Support Specialist";
  }

  if (pathname === "/notifications" || pathname.startsWith("/notifications/")) {
    return role === "Safety Moderator" || role === "Support Specialist";
  }

  return false;
}

// Helper to filter navigation sections for a given role & permissions
export function filterNavSectionsForRole<T extends { items: { href: string }[] }>(
  sections: T[],
  role: string,
  permissionsMap?: RolePermissionsMap
): T[] {
  if (role === "Super Admin") return sections;

  return sections
    .map((sec) => {
      const allowedItems = sec.items.filter((item) =>
        isRouteAllowedForRole(role, item.href, permissionsMap)
      );
      return {
        ...sec,
        items: allowedItems,
      };
    })
    .filter((sec) => sec.items.length > 0);
}
