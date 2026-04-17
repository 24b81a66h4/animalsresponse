function PriorityBadge({ priority }) {
    const colors = {
        Low: 'bg-green-200 text-green-800',
        Medium: 'bg-yellow-200 text-yellow-800',
        High: 'bg-red-200 text-red-800'
    };

    return (
        <span className={`px-2 py-1 rounded text-xs ${colors[priority]}`}>
            {priority}
        </span>
    );
}

export default PriorityBadge;