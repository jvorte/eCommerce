import React from "react";
import { Link } from "react-router-dom";

function Navigation({ isLoggedIn, handleLogout }) {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">My Dashboard</div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-gray-300 hover:text-white">
              Product
            </Link>
          </li>
          <li>
            <Link to="/addProduct" className="text-gray-300 hover:text-white">
              Add Product
            </Link>
          </li>
          <li>
            <Link to="/update" className="text-gray-300 hover:text-white">
              Update Product
            </Link>
          </li>

          {isLoggedIn ? (
            <>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-white">
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-300 hover:text-white">
                  Signup
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
