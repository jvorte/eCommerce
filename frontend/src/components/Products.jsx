import { useState, useEffect } from "react";

const API_URL = 'http://localhost:3000'; // Backend URL

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);  // Κατάσταση για φόρτωση
  const [error, setError] = useState(null);  // Κατάσταση για σφάλματα

  useEffect(() => {
    fetchProducts();
  }, []); // Fetch products μόλις φορτώσει το component
  
  const fetchProducts = async () => {
    console.log("Fetching products...");
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/products`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      const data = await response.json();
      console.log('Products received:', data);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;  // Εμφάνιση κατάστασης φόρτωσης
  if (error) return <div>Error: {error}</div>;  // Εμφάνιση του σφάλματος αν υπάρχει

  return (
    <div className="products-container">
      <h2>Products ({products.length})</h2>
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <h3>{product.name}</h3>
              <p>Description:{product.description}</p>
              <p>Price: ${product.price}</p>
              {product.image && (
                <img
                  src={`http://localhost:3000/uploads/${product.image}`}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    console.error(`Error loading image for ${product.name}`);
                    e.target.src = '/placeholder.jpg';  // Placeholder αν δεν φορτώσει η εικόνα
                  }}
                />
              )}
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
};

export default Products;
