import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "Active"
  | "Pending"
  | "Inactive"
  | "Banned"
  | "Suspended"
  | "Approved"
  | "Rejected"
  | "High"
  | "Medium"
  | "Low"
  | "Open"
  | "Under Review"
  | "In Review"
  | "Resolved"
  | "Dismissed"
  | "Operational"
  | "Degraded"
  | "Maintenance"
  | "Completed"
  | "Success"
  | "Failed"
  | "Refunded";

interface StatusBadgeProps {
  status: BadgeVariant | string;
  size?: "sm" | "md";
  className?: string;
  dot?: boolean;
}

export function StatusBadge({
  status,
  size = "sm",
  className,
  dot = false,
}: StatusBadgeProps) {
  const getBadgeCategory = (val: string): "success" | "warning" | "danger" | "neutral" => {
    switch (val?.toLowerCase()?.trim()) {
      case "active":
      case "approved":
      case "resolved":
      case "low":
      case "operational":
      case "completed":
      case "success":
      case "verified":
        return "success";
      case "pending":
      case "inactive":
      case "medium":
      case "under review":
      case "in review":
      case "degraded":
        return "warning";
      case "banned":
      case "rejected":
      case "high":
      case "open":
      case "critical":
      case "suspended":
      case "failed":
        return "danger";
      case "dismissed":
      case "maintenance":
      case "refunded":
      case "inactive":
      default:
        return "neutral";
    }
  };

  const category = getBadgeCategory(status);

  const categoryClass = `status-badge-${category}`;
  const dotClass = `status-badge-dot-${category}`;

  return (
    <span
      className={cn(
        "status-badge inline-flex items-center gap-1.5 rounded-md tracking-tight transition-all duration-150 font-medium",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        categoryClass,
        className
      )}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotClass)}
        />
      )}
      <span>{status}</span>
    </span>
  );
}
