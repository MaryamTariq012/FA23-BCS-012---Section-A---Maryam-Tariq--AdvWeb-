exports.getProducts = (req, res) => {

    const products = [
        { id: 1, name: "Laptop", price: 1000 },
        { id: 2, name: "Phone", price: 500 },
        { id: 3, name: "Headphones", price: 100 }
    ];

    res.json(products);
};