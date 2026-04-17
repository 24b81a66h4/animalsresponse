function StatusBadge({ status }) {
    const colors = {
        Pending: 'bg-gray-200 text-gray-800',
        Assigned: 'bg-blue-200 text-blue-800',
        'In Progress': 'bg-yellow-200 text-yellow-800',
        Resolved: 'bg-green-200 text-green-800',
        Rejected: 'bg-red-200 text-red-800'
    };

    return (
        <span className={`px-2 py-1 rounded text-xs ${colors[status]}`}>
            {status}
        </span>
    );
}

export default StatusBadge;