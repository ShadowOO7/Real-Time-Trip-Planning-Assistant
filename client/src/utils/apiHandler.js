export const handleApiResponse = async (apiCall) => {
  try {
    const response = await apiCall();
    return {
      success: true,
      data: response.data,
      message: response.data?.message || 'Operation successful'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Operation failed',
      status: error.response?.status
    };
  }
};