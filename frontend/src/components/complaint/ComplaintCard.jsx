import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

function ComplaintCard({ complaint }) {
    return (
        <div className="border p-4 rounded shadow-md bg-white">

            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{complaint.title}</h3>
                <StatusBadge status={complaint.status} />
            </div>

            <p className="text-sm text-gray-600 mb-2">
                {complaint.description}
            </p>

            <div className="flex justify-between items-center">
                <PriorityBadge priority={complaint.priority} />
                <span className="text-xs text-gray-400">
                    {complaint.category}
                </span>
            </div>

        </div>
    );
}

export default ComplaintCard;