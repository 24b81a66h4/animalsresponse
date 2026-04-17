function StatsCard({ title, value, icon }) {
    return (
        <div className="bg-white p-4 rounded shadow flex items-center gap-4">

            <div className="text-2xl">
                {icon || '📊'}
            </div>

            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h3 className="text-xl font-semibold">{value}</h3>
            </div>

        </div>
    );
}

export default StatsCard;