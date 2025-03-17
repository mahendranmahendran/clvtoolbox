// Home.js (Landing Page)
import { Link } from "react-router-dom";

console.log("Home.js loaded");

export default function Home() {
  return (
    <div>
      <h1>Welcome to MoEngage Clone</h1>
      <Link to="/login">Login</Link>
    </div>
  );
}