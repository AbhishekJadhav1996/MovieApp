// Example helper function
function formatResponse(success, data, message = '') {
  return { success, data, message };
}

module.exports = { formatResponse };
