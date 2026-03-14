exports.getUserById = (req, res) => {

    const id = req.params.id;

    res.json({
        message: "User ID is " + id
    });
};

exports.createUser = (req, res) => {

    const { name, email } = req.body;

    res.json({
        message: "User Created",
        user: { name, email }
    });
};