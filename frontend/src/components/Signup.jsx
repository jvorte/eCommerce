import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("heur");  // Προκαθορισμένη τιμή
  const [email, setEmail] = useState("jvortelinas@gmail.com");  // Προκαθορισμένη τιμή
  const [password, setPassword] = useState("");  // Άδεια τιμή
  const navigate = useNavigate();



const collectData = async () => {
  if (!name || !email || !password) {
    alert("All fields are required!");
    return;
  }

  console.log("Data collected:", { name, email, password });
  try {
    let result = await fetch("http://localhost:3000/users", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!result.ok) {
      const errorData = await result.json(); // Παίρνουμε τα δεδομένα από το response
      throw new Error(`Signup failed: ${errorData.message}`);
    }
    result = await result.json();
    console.log(result);

    localStorage.setItem("user", JSON.stringify(result));
    navigate('/'); // Μετά την επιτυχή εγγραφή, κάνε redirect

  } catch (error) {
    console.error("Error:", error);
  }
};

  

  return (
    <div className="flex justify-center items-center">
      <form className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"  // Επιλογή για αυτόματη συμπλήρωση
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"  // Επιλογή για αυτόματη συμπλήρωση
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"  // Επιλογή για αυτόματη συμπλήρωση
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={collectData}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
