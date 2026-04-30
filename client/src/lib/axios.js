import axios from "axios";

const instance = axios.create({
  // Use Render URL in production, localhost in development
  baseURL: import.meta.env.PROD 
    ? "https://unique-chess-acadamy.onrender.com" 
    : "http://localhost:5000",
});

export default instance;