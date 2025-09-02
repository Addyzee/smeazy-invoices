export const formatDate = (dateTimeString: string) => {
  const dateString = dateTimeString.split("T")[0];
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
