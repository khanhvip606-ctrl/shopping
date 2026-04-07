import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🔥 Sản phẩm nổi bật</h2>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 20
      }}>
        {products.map(p => (
          <ProductCard key={p._id} p={p} />
        ))}
      </div>
    </div>
  );
}

export default Home;