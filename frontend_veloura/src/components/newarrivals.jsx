// NewArrivals.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Productcards from '../components/cards';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:3001/jewelry/tag/New Arrival");
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B88E2F]"></div>
      </div>
    );
  }

  return (
    <div>
      <Productcards 
        products={products} 
        headline="New Arrival" 
        subheading="Visit Veloura to see amazing creations from our designers."
        tag="New Arrival"
      />
    </div>
  );
};

export default NewArrivals;