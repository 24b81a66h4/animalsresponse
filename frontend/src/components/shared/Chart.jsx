function Chart({ data = [] }) {
    const max = Math.max(...data.map(d => d.value), 1);

    return (
        <div className="space-y-2">
            {data.map((item, index) => (
                <div key={index}>
                    <div className="flex justify-between text-sm">
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-3 rounded">
                        <div
                            className="bg-blue-500 h-3 rounded"
                            style={{ width: `${(item.value / max) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Chart;