export const convertDate = (_date, type = 1) => {
    const date = new Date(_date);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const year = date.getUTCFullYear();

    const dmyFormat = `${day}-${month}-${year}`;
    return type === 1 ? dmyFormat : `${year}-${month}-${day}`
}