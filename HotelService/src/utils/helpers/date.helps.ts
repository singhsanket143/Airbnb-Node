export const getDateStringWithoutTimeStamp = (date: Date): string => {
	const dateOnly = date.toISOString().split("T")[0];
	return dateOnly;
};
