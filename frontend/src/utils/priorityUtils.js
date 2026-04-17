export const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "bg-red-500 text-white";
    case "Medium":
      return "bg-yellow-500 text-white";
    case "Low":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-500 text-white";
    case "Assigned":
      return "bg-purple-500 text-white";
    case "In Progress":
      return "bg-blue-500 text-white";
    case "Resolved":
      return "bg-green-500 text-white";
    case "Rejected":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};