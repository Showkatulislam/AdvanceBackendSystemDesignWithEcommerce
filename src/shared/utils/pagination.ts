export const getPagination = (page = 1, limit = 20) => {
  const currentPage = Math.max(1, page);
  const pageSize = Math.min(Math.max(1, limit), 100);
  return {
    page: currentPage,
    limit: pageSize,
    skip: (currentPage - 1) * pageSize,
  };
};
