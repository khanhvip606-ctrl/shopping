const dns = require("dns");
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// tạo folder uploads
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// load ảnh
app.use("/uploads", express.static(uploadPath));

// connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// model
const Product = require("./models/Product");

// upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// 👉 FIX ROOT (QUAN TRỌNG)
app.get("/", (req, res) => {
  res.redirect("/admin");
});

// mở trang admin
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// GET products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find()
      .select("-__v")
      .sort({ _id: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST product
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ error: "Thiếu tên hoặc giá sản phẩm" });
    }

    let priceInput = (req.body.price + "")
      .replace(/,/g, "")
      .trim()
      .toLowerCase();

    if (priceInput.includes("triệu")) {
      priceInput = parseFloat(priceInput) * 1000000;
    } else if (priceInput.includes("k")) {
      priceInput = parseFloat(priceInput) * 1000;
    } else {
      priceInput = Number(priceInput);
    }

    if (isNaN(priceInput)) {
      return res.status(400).json({ error: "Giá sản phẩm không hợp lệ" });
    }

    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : "https://via.placeholder.com/300";

    const product = new Product({
      name: req.body.name,
      price: priceInput,
      image: imageUrl,
      description: req.body.description || "",
    });

    await product.save();
    res.json(product);
  } catch (err) {
    console.log("POST error:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
app.delete("/api/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// chạy server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
