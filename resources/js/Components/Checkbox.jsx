export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-600 text-indigo-200 shadow-sm focus:ring-indigo-500 ' +
                className
            }
        />
    );
}
