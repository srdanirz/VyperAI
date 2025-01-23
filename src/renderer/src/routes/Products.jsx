import { useState, useEffect } from "react";
import axios from "axios";

const Products = () => {
  const [licenseData, setLicenseData] = useState({ product: "", email: "" });
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("licenseValidationResponse");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setLicenseData(parsedData);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (licenseData.product) {
      const fetchProductData = async () => {
        try {
          const response = await axios.get(
            `https://api.whop.com/v2/products/${licenseData.product}`,
            {
              headers: {
                Authorization:
                  "Bearer p1UA4RWjHUMO-_1S5E9ksiQLxmKzTDTtZ4gj1Rgjf7s",
              },
            },
          );
          setProduct(response.data);
        } catch (error) {
          console.error("Error fetching the product data:", error);
        }
      };

      fetchProductData();
    }
  }, [licenseData.product]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-5 h-full pb-20 pt-3 p-8 font-Jakarta600">
      <h1 className="text-2xl font-bold font-Jakarta700">{product.name}</h1>

      <p>
        lo
        <strong>Name:</strong> {product.name}
      </p>
    </div>
  );
};

export default Products;
