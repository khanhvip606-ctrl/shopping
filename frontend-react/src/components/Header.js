import React from "react";
import "./Header.css";

function Header({
  searchTerm = "",
  setSearchTerm = () => {},
  cartCount = 0,
  onCartClick = () => {},
}) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="brand-box">
          <div className="brand-logo">📱</div>
          <div>
            <h1>BAPhone</h1>
            <span>Shop điện thoại chính hãng</span>
          </div>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm iPhone, Samsung, Xiaomi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="cart-button" onClick={onCartClick}>
          🛒 Giỏ hàng
          <span className="cart-badge">{cartCount}</span>
        </button>
      </div>
    </header>
  );
}

export default Header;