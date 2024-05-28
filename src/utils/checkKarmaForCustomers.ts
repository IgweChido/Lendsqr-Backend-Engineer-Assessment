import axios from "axios";
export const checkKarmaForCustomer = async (endpointUrl, authToken) => {
  try {
    console.log("endpoint", endpointUrl);
    const response = await axios.get(endpointUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
