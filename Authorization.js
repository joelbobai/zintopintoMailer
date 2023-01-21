const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    //const tokent = jwt.sign({ id: "hey" }, process.env.JWT_SECRET);
    //console.log(tokent);
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      console.log(token);
      token = token.slice(7, token.length).trimLeft();
    } else {
      return res.status(403).send("Wetin you dey look for?");
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message, message: "Wetin you dey try do?" });
  }
};

module.exports = verifyToken;
