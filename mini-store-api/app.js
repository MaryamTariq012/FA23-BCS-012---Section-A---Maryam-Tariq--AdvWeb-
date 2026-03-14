const express = require("express");

const app = express();

const logger = require("./middleware/logger");
const auth = require("./middleware/auth");

const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");

app.use(express.json());

app.use(logger);

app.use("/products", productRoutes);

app.use("/users", auth, userRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route Not Found"
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});