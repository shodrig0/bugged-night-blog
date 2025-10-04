import React from "react"

export const getCategoryColor = (category?: string): string => {
  switch (category) {
    case "event":
      return "bg-secondary text-white"
    case "maintenance":
      return "bg-yellow-500 text-dark"
    case "community":
      return "bg-accent text-white"
    default:
      return "bg-primary text-white"
  }
}

export const getPriorityBadge = (priority?: string): React.ReactNode => {
  if (priority === "critical") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
        Critical
      </span>
    )
  }
  if (priority === "important") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500 text-dark">
        Important
      </span>
    )
  }
  return null
}
