import React from "react";
import "./ProductCard.css";

function ProductCard({ product, onAddToCart }) {
  const getImageUrl = (image) => {
    if (!image) {
      return "https://via.placeholder.com/400x300?text=No+Image";
    }

    // nếu đã là link đầy đủ thì dùng luôn
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    // 👉 domain backend deploy của bạn
    const baseUrl = "https://shopping-byuv.onrender.com";

    if (image.startsWith("/uploads")) {
      return `${baseUrl}${image}`;
    }

    return `${baseUrl}/uploads/${image}`;
  };

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
          }}
        />
      </div>

      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>

        <div className="product-price">
          {Number(product.price || 0).toLocaleString("vi-VN")}đ
        </div>

        <p className="product-desc">
          {product.description || "Chưa có mô tả"}
        </p>

        <button className="add-cart-btn" onClick={() => onAddToCart(product)}>
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}

export default ProductCard;