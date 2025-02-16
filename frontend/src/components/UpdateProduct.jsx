import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

const UpdateProduct = () => {
  const { id } = useParams(); // Παίρνουμε το ID από το URL
  const [product, setProduct] = useState(null); // Αρχικά το προϊόν είναι null
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        console.error("Product ID is missing!");
        setError("Product ID is missing!");
        return;
      }
      
      try {
        const response = await fetch(`${API_URL}/api/products/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }
        const data = await response.json();
        setProduct(data);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setImage(data.image); 
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    };
  
    fetchProduct();
  }, [id]);
  

  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Loading product...</div>; // Εμφάνιση φόρτωσης αν το προϊόν δεν έχει φορτωθεί ακόμα

  return (
    <div>
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default UpdateProduct;
