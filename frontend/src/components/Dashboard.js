import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import ViewOrders from './ViewOrders';
import SignUpForm from './SignUpForm';

const Dashboard = ({ onNavigate, setCurrentView, loggedInEmail, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    productImage: null
  });

  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [goToLogin, setGoToLogin] = useState(false);
  const [goToSignup, setGoToSignup] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    setSearchStatus('');
  };

  const handleSearch = async () => {
    if (searchInput.trim()) {
      setSearchStatus('Searching');
      try {
        const response = await axios.get(`http://localhost:3000/products?name=${encodeURIComponent(searchInput)}`);
        const searchedProduct = response.data.products.find(product => product.name.toLowerCase() === searchInput.toLowerCase());
        setSearchResults(searchedProduct ? [searchedProduct] : []);
        setSearchStatus(searchedProduct ? 'Searched' : 'No products found matching your search.');
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
        setSearchStatus('Error');
      }
    } else {
      setSearchResults([]);
      setSearchStatus('');
    }
  };
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      productImage: e.target.files[0]
    });
  };

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, user must be logged in');
        return;
      }

      await axios.delete(`http://localhost:3000/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchProducts();
      console.log('Product deleted successfully.');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('productImage', formData.productImage);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, user must be logged in');
        return;
      }

      await axios.post('http://localhost:3000/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      fetchProducts();
      setFormData({ name: '', price: '', productImage: null });
      setShowModal(false);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };
  const handleGoToOrders = () => {
    setGoToLogin(true);
  };

  if (goToLogin) {
    return <ViewOrders />;
  }
  const handleAddProduct = () => {
    setShowModal(true);
  };

  const handleAddToOrderClick = (product) => {
    setSelectedProduct(product);
    setShowConfirmation(true);
  };

  const handleConfirmAddToOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, user must be logged in');
        return;
      }

      const response = await axios.post('/orders', {
        productId: selectedProduct._id,
        quantity: 1,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Order response:', response.data);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error adding to order:', error);
      setShowConfirmation(false);
    }
  };

  const handleLogout= () => {
    setGoToSignup(true);
  };
  if (goToSignup) {
    return <SignUpForm />;
  }

  return (
    <div className="parentCont">
      <div className="wholeCont">
        <div className="addNsearch">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Product name, price"
              aria-label="Search input"
              aria-describedby="button-addon2"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
            <button
              className="btn searchBtnPrdct"
              type="button"
              id="button-addon2"
              onClick={handleSearch}
            >
              <i className="bi bi-search me-2"></i>Search
            </button>
            {searchStatus && <div>{searchStatus}: {searchInput}</div>}
          </div>
          <div>
            <button className="btn addprdctbtn" type="button" onClick={handleAddProduct}>
              <i className="bi bi-plus-square"></i> Add
            </button>
          </div>
          <div>
            {/* Button to toggle orders visibility */}
            <button className="btn ordersprdctbtn" type="button" onClick={handleGoToOrders}>
              <i className="bi bi-basket2"></i>Orders
            </button>
          </div>
          <div>
            {/* Button to toggle orders visibility */}
            <button className="btn ordersprdctbtn" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        <div className="prdctsJumbotron">
          <div className="jumbotroninner">
            <h3>Transform Your Space:</h3>
            <h2>Where Style Meets Comfort!</h2>
          </div>
        </div>
        {searchStatus === 'Searched' && (
  <div className="searchedItems">
          <h2>Searched Items:</h2>
    <div className="searchedItemsContainer">
      {searchResults.length === 0 ? (
        <p>No products found matching your search.</p>
      ) : (
        searchResults.map(product => (
          <div className="prdctDiv" key={product._id}>
            <div className="productImgDiv">
              <img src={product.productImage} className="productImg" alt={product.name} />
            </div>
            <div className="prdctDtls">
              <p className="prdctName">{product.name}</p>
              <p className="prdctPrice">{product.price}</p>
            </div>
            <button className="btn btn-primary" onClick={() => handleDelete(product._id)}>Delete</button>
            <button className="btn2 btn-primary" onClick={() => handleAddToOrderClick(product)}>Add to Order</button>
          </div>
        ))
      )}
    </div>
  </div>
)}

        <div className="prdctList">
          {products.map(product => (
            <div className="prdctDiv" key={product._id}>
              <div className="productImgDiv">
                <img src={product.productImage} className="productImg" alt={product.name} />
              </div>
              <div className="prdctDtls">
                <p className="prdctName">{product.name}</p>
                <p className="prdctPrice">{product.price}</p>
              </div>
              <button className="btn btn-primary" onClick={() => handleDelete(product._id)}>Delete</button>
              <button className="btn2 btn-primary" onClick={() => handleAddToOrderClick(product)}>Add to Order</button>
            </div>
          ))}
        </div>
        {/* Modal for adding products */}
        <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Product</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="Product name" required />
                  </div>
                  <div className="form-group">
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-control" placeholder="Product price" required />
                  </div>
                  <div className="form-group">
                    <input type="file" name="productImage" onChange={handleImageChange} className="form-control" required />
                  </div>
                  <button type="submit" className="btn btn-primary">Add Product</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* Confirmation overlay for adding product to order */}
        {showConfirmation && (
          <div className="confirmation-overlay">
            <div className="confirmation-modal">
              <h2>Confirm Add to Order</h2>
              <p>Are you sure you want to add this product to your order?</p>
              <div>
                <button className="btn1 btn-confirm" onClick={handleConfirmAddToOrder}>Confirm</button>
                <button className="btn1 btn-cancel" onClick={() => setShowConfirmation(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};  
export default Dashboard;
