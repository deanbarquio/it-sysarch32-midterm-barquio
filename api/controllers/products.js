const mongoose = require("mongoose");
const Product = require("../models/product");

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_create_product = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path // Assuming you're using multer for file uploads
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


// exports.products_create_product = (req, res, next) => {
//   const product = new Product({
//     _id: new mongoose.Types.ObjectId(),
//     name: req.body.name,
//     price: req.body.price,
//     productImage: req.file.path
//   });
//   product
//     .save()
//     .then(result => {
//       console.log(result);
//       res.status(201).json({
//         message: "Created product successfully",
//         createdProduct: {
//           name: result.name,
//           price: result.price,
//           _id: result._id,
//           request: {
//             type: "GET",
//             url: "http://localhost:3000/products/" + result._id
//           }
//         }
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// };

exports.products_get_product = (req, res, next) => {
  // Check if the request includes a search query
  if (req.query.name) {
    // Perform a case-insensitive search for products by name
    const searchQuery = new RegExp(req.query.name, 'i');

    // Find products that match the search query
    Product.find({ name: searchQuery })
      .select('name price _id productImage')
      .exec()
      .then(products => {
        console.log('Products matching search query:', products);
        if (products.length > 0) {
          res.status(200).json({
            products: products,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products'
            }
          });
        } else {
          res.status(404).json({ message: 'No products found matching the search query' });
        }
      })
      .catch(err => {
        console.error('Error searching for products:', err);
        res.status(500).json({ error: err });
      });
  } else {
    // If no search query is provided, continue with retrieving a single product by ID
    const id = req.params.productId;
    Product.findById(id)
      .select('name price _id productImage')
      .exec()
      .then(doc => {
        console.log('From database', doc);
        if (doc) {
          res.status(200).json({
            product: doc,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products'
            }
          });
        } else {
          res.status(404).json({ message: 'No valid entry found for provided ID' });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: err });
      });
  }
};

exports.products_update_product = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_delete = (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then(result => {
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "No valid entry found for provided ID" });
      }
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products",
          body: { name: "String", price: "Number" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
