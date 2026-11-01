import React from "react";

export const ROLE_LABELS = {
  admin: "Administrator",
  teacher: "Teacher",
  content_manager: "Content Manager",
  cash_manager: "Cash Manager",
  student: "Student",
};

export function roleBadge(role) {
  const cls = `badge role-${role}`;
  return <span className={cls}>{ROLE_LABELS[role] || role}</span>;
}

export function statusBadge(status) {
  const map = {
    active: "badge-green",
    pending: "badge-amber",
    published: "badge-green",
    draft: "badge-gray",
    archived: "badge-gray",
    verified: "badge-green",
    rejected: "badge-red",
    refunded: "badge-gray",
    suspended: "badge-red",
    deleted: "badge-red",
    in_progress: "badge-blue",
  };
  return <span className={`badge ${map[status] || "badge-gray"}`}>{status?.replace(/_/g, " ")}</span>;
}
