import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    console.log("Deleting product with ID:", productToDelete);  // Ελέγξτε το ID στο frontend
    try {
      const response = await fetch(`${API_URL}/api/products/${productToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error("Failed to delete product");
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete));
    } catch (error) {
      setError(error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setShowConfirm(false);
      setProductToDelete(null);
    }
  };
  console.log("Deleting product with ID:", productToDelete); // Ελέγξτε το ID στο frontend

  const handleUpdateClick = (productId) => {
    console.log("Selected product ID:", productId);
    navigate(`/update/${productId}`);
  };

  if (isLoading) return <div className="loader">Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="products-container">
      <h2>Products ({products.length})</h2>
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="product-card relative">
              <h3>{product.name}</h3>
              <div className="relative">
                <img
                  src={product.image ? `${API_URL}/uploads/${product.image}` : "/placeholder.png"}
                  alt={product.name}
                  className="product-image"
                />
                <p>Description: {product.description}</p>
                <p>Price: ${product.price}</p>
                <div className="absolute inset-0 flex items-center justify-center space-x-2 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleUpdateClick(product._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products available. Please add some products to display here.</p>
        )}
      </div>

      {showConfirm && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this product?</p>
            <button onClick={confirmDelete} className="confirm-button">
              Yes
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="cancel-button"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
