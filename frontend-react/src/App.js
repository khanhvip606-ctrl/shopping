import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import heroImage from "./assets/ip17.jpg";

const BACKEND_URL = "http://localhost:5000";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderMessage, setOrderMessage] = useState("");

  const [checkoutForm, setCheckoutForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${BACKEND_URL}/api/products`);
        if (!res.ok) {
          throw new Error("Không lấy được danh sách sản phẩm");
        }

        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      (product.name || "")
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
    );
  }, [products, searchTerm]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + Number(item.price || 0) * item.quantity,
      0
    );
  }, [cart]);

  const handleAddToCart = (product) => {
    setOrderMessage("");

    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const handleCheckoutChange = (e) => {
    const { name, value } = e.target;
    setCheckoutForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setOrderMessage("Giỏ hàng đang trống.");
      return;
    }

    if (
      !checkoutForm.fullName.trim() ||
      !checkoutForm.phone.trim() ||
      !checkoutForm.address.trim()
    ) {
      setOrderMessage("Vui lòng nhập đầy đủ thông tin thanh toán.");
      return;
    }

    const orderData = {
      customer: checkoutForm,
      items: cart,
      total: cartTotal,
      createdAt: new Date().toISOString(),
    };

    console.log("Đơn hàng frontend demo:", orderData);

    setOrderMessage("Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại BAPhone.");
    setCart([]);
    setCheckoutForm({
      fullName: "",
      phone: "",
      address: "",
      paymentMethod: "cod",
    });
  };

  const scrollToProducts = () => {
    const section = document.getElementById("products-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToCart = () => {
    const section = document.getElementById("cart-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartCount={cartCount}
        onCartClick={scrollToCart}
      />

      <main className="container">
        <section className="hero">
          <div className="hero-content">
            <span className="hero-badge">BAPhone Store</span>
            <h1>Chính hãng từng máy, hài lòng từng đơn</h1>

            <div className="hero-actions">
              <button className="primary-btn" onClick={scrollToProducts}>
                Xem sản phẩm
              </button>
              <button className="secondary-btn" onClick={scrollToCart}>
                Xem giỏ hàng
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="phone-glow"></div>
            <img src={heroImage} alt="iPhone banner" className="hero-image" />
          </div>
        </section>

        <section className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Chính hãng</h3>
            <p>Sản phẩm rõ nguồn gốc, bảo hành minh bạch.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Giao nhanh</h3>
            <p>Hỗ trợ giao hàng toàn quốc, đóng gói an toàn.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Thanh toán linh hoạt</h3>
            <p>Hỗ trợ nhiều hình thức thanh toán tiện lợi.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛠️</div>
            <h3>Hỗ trợ sau bán</h3>
            <p>Tư vấn kỹ thuật và hỗ trợ khách hàng nhanh chóng.</p>
          </div>
        </section>

        <section className="section-head" id="products-section">
          <div>
            <p className="section-label">Danh mục nổi bật</p>
            <h2>Danh sách điện thoại</h2>
            <span>Tìm kiếm, xem thông tin và thêm sản phẩm vào giỏ hàng.</span>
          </div>

          <div className="product-count">{filteredProducts.length} sản phẩm</div>
        </section>

        {loading && <div className="status-box">Đang tải dữ liệu sản phẩm...</div>}

        {!loading && error && <div className="status-box error">{error}</div>}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="status-box">Không tìm thấy sản phẩm phù hợp.</div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <section className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </section>
        )}

        <section className="cart-wrapper" id="cart-section">
          <div className="cart-header">
            <div>
              <p className="section-label">Giỏ hàng của bạn</p>
              <h2>Đơn hàng tạm tính</h2>
            </div>

            <div className="cart-total-box">
              <span>Tổng tiền</span>
              <strong>{cartTotal.toLocaleString("vi-VN")}đ</strong>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h3>Giỏ hàng đang trống</h3>
              <p>Hãy chọn một vài mẫu điện thoại để bắt đầu mua sắm.</p>
            </div>
          ) : (
            <>
              <div className="cart-list">
                {cart.map((item) => (
                  <div className="cart-item" key={item._id}>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">
                        {Number(item.price || 0).toLocaleString("vi-VN")}đ
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <div className="qty-box">
                        <button onClick={() => decreaseQuantity(item._id)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQuantity(item._id)}>
                          +
                        </button>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item._id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="checkout-box">
                <h3 className="checkout-title">Thông tin thanh toán</h3>

                <form className="checkout-form" onSubmit={handlePlaceOrder}>
                  <div className="checkout-grid">
                    <div className="checkout-field">
                      <label>Họ và tên</label>
                      <input
                        type="text"
                        name="fullName"
                        value={checkoutForm.fullName}
                        onChange={handleCheckoutChange}
                        placeholder="Nhập họ và tên"
                      />
                    </div>

                    <div className="checkout-field">
                      <label>Số điện thoại</label>
                      <input
                        type="text"
                        name="phone"
                        value={checkoutForm.phone}
                        onChange={handleCheckoutChange}
                        placeholder="Nhập số điện thoại"
                      />
                    </div>

                    <div className="checkout-field checkout-full">
                      <label>Địa chỉ nhận hàng</label>
                      <input
                        type="text"
                        name="address"
                        value={checkoutForm.address}
                        onChange={handleCheckoutChange}
                        placeholder="Nhập địa chỉ giao hàng"
                      />
                    </div>

                    <div className="checkout-field checkout-full">
                      <label>Phương thức thanh toán</label>
                      <select
                        name="paymentMethod"
                        value={checkoutForm.paymentMethod}
                        onChange={handleCheckoutChange}
                      >
                        <option value="cod">Thanh toán khi nhận hàng</option>
                        <option value="banking">Chuyển khoản ngân hàng</option>
                        <option value="momo">Ví MoMo (demo)</option>
                      </select>
                    </div>
                  </div>

                  <div className="checkout-summary">
                    <div>
                      <span>Tổng thanh toán:</span>
                      <strong>{cartTotal.toLocaleString("vi-VN")}đ</strong>
                    </div>

                    <button type="submit" className="checkout-btn">
                      Đặt hàng
                    </button>
                  </div>

                  {orderMessage && (
                    <div className="checkout-message">{orderMessage}</div>
                  )}
                </form>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;