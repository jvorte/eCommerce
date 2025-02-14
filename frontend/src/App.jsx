import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Signup from "./components/Signup";
import Login from "./components/Login";
import "./App.css";
import AddProduct from "./components/AddProduct";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Ελέγχουμε αν ο χρήστης είναι αποθηκευμένος στο localStorage
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Διαγραφή του χρήστη από το localStorage και αλλαγή της κατάστασης του login
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Navigation isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<h1>Product component</h1>} />
        <Route path="/addProduct" element={<AddProduct/>} />
        <Route path="/update" element={<h1>Update component</h1>} />
        <Route path="/profile" element={<h1>Profile component</h1>} />
        <Route
          path="/signup"
          element={<Signup setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
    
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
