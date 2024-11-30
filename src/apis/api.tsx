import axios from "axios";

// This would generally be something like this...
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const API_BASE_URL = "http://localhost:5000"; // Default json-server port

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
