import { categories } from '../../utils/constants';

function CategorySelect({ value, onChange }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border p-2 rounded w-full"
        >
            {categories.map((cat) => (
                <option key={cat} value={cat}>
                    {cat}
                </option>
            ))}
        </select>
    );
}

export default CategorySelect;