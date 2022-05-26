const express = require("express");
const res = require("express/lib/response");
const { json } = require("express/lib/response");
const app = express();
const fs = require("fs");
const mongoose = require("mongoose");

app.use(express.json());

try {
  const productSchema = new mongoose.Schema({
    // id: mongoose.ObjectId,
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    rating: new mongoose.Schema({ rate: Number, count: Number }),
  });

  const Product = mongoose.model("Product", productSchema);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/products", (req, res) => {
    const {
      title,
      price,
      minPrice,
      maxPrice,
      description,
      category,
      image,
      rating,
    } = req.query;
    let query = {};

    if (title) {
      query.title = { $regex: new RegExp(title, "i") };
    }
    if (price && !(minPrice && maxPrice)) {
      query.price = price;
    }
    if (minPrice && maxPrice && !price) {
      query.price = { $gt: minPrice, $lt: maxPrice };
    }
    if (minPrice && maxPrice && price) {
      query.$and = [
        { price: +price },
        { price: { $gt: +minPrice, $lt: +maxPrice } },
      ];
    }
    if (description) {
      query.description = { $regex: new RegExp(description, "i") };
    }
    if (category) {
      query.category = { $regex: new RegExp(category, "i") };
    }
    if (image) {
      query.image = image;
    }

    // if (rating) {
    // }

    if (rating) {
      let jsonRating;
      jsonRating = JSON.parse(rating);
      Product.find(
        {
          query,
          "rating.rate": jsonRating.rate,
          "rating.count": jsonRating.count,
        },
        (err, products) => {
          console.log("err", err);
          console.log("query", query);
          //   console.log("products", products);
          // console.log("str1", str1);
          // if (title) {
          //   products = products.filter((product) =>
          //     product.title.toLowerCase().includes(title.toLowerCase())
          //   );
          // }
          // if (price) {
          //   products = products.filter((product) => product.price === +price);
          // }
          // if (minPrice) {
          //   products = products.filter((product) => product.price >= +minPrice);
          // }
          // if (maxPrice) {
          //   products = products.filter((product) => product.price <= +maxPrice);
          // }
          // if (description) {
          //   products = products.filter((product) =>
          //     product.description
          //       .toLowerCase()
          //       .includes(description.toLowerCase())
          //   );
          // }
          // if (category) {
          //   products = products.filter(
          //     (product) => product.category === category
          //   );
          // }
          // if (image) {
          //   products = products.filter((product) => product.image === image);
          // }
          // if (rating) {
          //   const jsonRating = JSON.parse(rating);
          //   //console.log(jsonRating.count);
          //   products = products.filter((product) => {
          //     return (
          //       product.rating.rate === +jsonRating.rate &&
          //       product.rating.count === +jsonRating.count
          //     );
          //   });
          // }
          res.send(products);
        }
      );
    } else {
      Product.find({ query }, (err, products) => {
        console.log("err", err);
        console.log("query", query);
        // console.log("products", products);
        res.send(products);
      });
    }
    // fs.readFile("./products.json", "utf8", (err, data) => {
    //   if (err) throw err;
    //   let products = JSON.parse(data);
    //   if (title) {
    //     products = products.filter((product) =>
    //       product.title.toLowerCase().includes(title.toLowerCase())
    //     );
    //   }
    //   if (price) {
    //     products = products.filter((product) => product.price === +price);
    //   }
    //   if (minPrice) {
    //     products = products.filter((product) => product.price >= +minPrice);
    //   }
    //   if (maxPrice) {
    //     products = products.filter((product) => product.price <= +maxPrice);
    //   }
    //   if (description) {
    //     products = products.filter((product) =>
    //       product.description.toLowerCase().includes(description.toLowerCase())
    //     );
    //   }
    //   if (category) {
    //     products = products.filter((product) => product.category === category);
    //   }
    //   if (image) {
    //     products = products.filter((product) => product.image === image);
    //   }
    //   if (rating) {
    //     const jsonRating = JSON.parse(rating);
    //     //console.log(jsonRating.count);
    //     products = products.filter((product) => {
    //       return (
    //         product.rating.rate === +jsonRating.rate &&
    //         product.rating.count === +jsonRating.count
    //       );
    //     });
    //   }
    //   res.send(products);
    // });
  });

  app.get("/products/:id", (req, res) => {
    const { id } = req.params;
    Product.findById(id, (err, product) => {
      res.send(product);
    });
    //  console.log(id);
    // fs.readFile("./products.json", "utf8", (err, data) => {
    //   if (err) throw err;
    //   const products = JSON.parse(data);
    //   const myProduct = products.find((product) => product.id === +id);
    //   console.log(myProduct);

    // });
  });

  // fs.writeFile("./myFile2.json", JSON.stringify(students), (err) => {

  app.post("/products", (req, res) => {
    const { title, price, description, category, image, rating } = req.body;
    const product = new Product({
      title,
      price,
      description,
      category,
      image,
      rating,
    });
    // product.id = new mongoose.Types.ObjectId();
    product.save((err, product) => {
      // console.log("err", err, "product", product);
      res.send(product);
    });
    // fs.readFile("./products.json", "utf8", (err, data) => {
    //   if (err) throw err;
    //   const products = JSON.parse(data);
    //   const newProduct = {
    //     id: products.length + 1,
    //     title,
    //     price,
    //     description,
    //     category,
    //     image,
    //     rating,
    //   };
    //   products.push(newProduct);
    //   fs.writeFile("./products.json", JSON.stringify(products), (err) => {
    //     res.send(newProduct);
    //   });
    // });
  });

  app.put("/products/:id", (req, res) => {
    const { id } = req.params;
    const { title, price, description, category, image, rating } = req.body;
    Product.findByIdAndUpdate(
      id,
      { title, price, description, category, image, rating },
      { new: true },
      (err, product) => {
        res.send(product);
      }
    );
    // fs.readFile("./products.json", "utf8", (err, data) => {
    //   if (err) throw err;
    //   const products = JSON.parse(data);
    //   const myProductIndex = products.findIndex(
    //     (product) => product.id === +id
    //   );

    //   products[myProductIndex].title = title;
    //   products[myProductIndex].price = price;
    //   products[myProductIndex].description = description;
    //   products[myProductIndex].category = category;
    //   products[myProductIndex].image = image;
    //   products[myProductIndex].rating = rating;

    //   fs.writeFile("./products.json", JSON.stringify(products), (err) => {
    //     res.send(products[myProductIndex]);
    //   });
    // });
  });

  app.delete("/products/:id", (req, res) => {
    const { id } = req.params;
    Product.findByIdAndDelete(id, (err, product) => {
      console.log("err", err);
      res.send(product);
    });
    // fs.readFile("./products.json", "utf8", (err, data) => {
    //   if (err) throw err;
    //   const products = JSON.parse(data);
    //   const myProductIndex = products.findIndex(
    //     (product) => product.id === +id
    //   );
    //   products.splice(myProductIndex, 1);
    //   fs.writeFile("./products.json", JSON.stringify(products), (err) => {
    //     res.send(products);
    //   });
    // });
  });

  const InitProducts = () => {
    Product.findOne((err, product) => {
      if (!product) {
        fs.readFile("./products.json", "utf8", (err, data) => {
          if (err) throw err;
          const products = JSON.parse(data);
          Product.insertMany(products, (err, productRes) => {
            // res.send(productRes);
            console.log("productRes", productRes);
          });
        });
      }
    });
  };
  const mongo_url =
    process.env.MONGO_URL || "mongodb://localhost:27017/masbiha_lekol_hay";
  const port = process.env.PORT || 8000;
  // https://cloud.mongodb.com/v2/628ba89f2cd268468957fd82#metrics/replicaSet/628ca3df8ca7860ca2d72b89/explorer/test/products/find
  mongoose.connect(
    mongo_url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      app.listen(port, () => {
        InitProducts();
        console.log("app listening on port 8000..");
      });
    }
  );
} catch (error) {
  console.log("ERROR! ");
  console.log(error);
}

console.log("process.env", process.env);
