import express from "express"
import  ProductRoute  from "./product/create-product/create-product"
import GetProductPrice from "./product/get-product/get-proiduct-price"
import GetProductHeartBeat from "./product/product-heartbeat/product-heartbeat"
import GetAllProducts from "./product/get-all-products/get-all-product"
import UpdateProduct from "./product/update-product/update-product"
import DeleteProduct  from "./product/delete-product/delete-produts"

const router = express.Router()

// product
router.use(ProductRoute)

// get
router.use(GetProductPrice)

// heart beat
router.use(GetProductHeartBeat)

// get all products
router.use(GetAllProducts)

// update Product
router.use(UpdateProduct)

// delete products
router.use(DeleteProduct)

export default router