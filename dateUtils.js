export function formatDateRange(startDate, endDate = null) {
    const options = { month: 'short', day: 'numeric' };
    const start = startDate.toLocaleDateString(undefined, options);
    if (endDate) {
        const end = endDate.toLocaleDateString(undefined, options);
        return `${start} - ${end}`;
    }
    return `${start}`;
}
