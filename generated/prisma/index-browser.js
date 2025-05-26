
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  firstName: 'firstName',
  lastName: 'lastName',
  phone: 'phone',
  avatar: 'avatar',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  verified: 'verified',
  verificationToken: 'verificationToken'
};

exports.Prisma.AddressScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  receiver: 'receiver',
  phone: 'phone',
  city: 'city',
  province: 'province',
  address: 'address',
  postalCode: 'postalCode',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  image: 'image',
  parentId: 'parentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  price: 'price',
  discountPrice: 'discountPrice',
  sku: 'sku',
  stock: 'stock',
  images: 'images',
  categoryId: 'categoryId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  published: 'published',
  featured: 'featured'
};

exports.Prisma.ProductAttributeScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  name: 'name',
  value: 'value',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductVariantScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  name: 'name',
  options: 'options',
  price: 'price',
  stock: 'stock',
  sku: 'sku',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CartScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CartItemScalarFieldEnum = {
  id: 'id',
  cartId: 'cartId',
  productId: 'productId',
  quantity: 'quantity',
  variantId: 'variantId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  CouponId: 'CouponId',
  orderNumber: 'orderNumber',
  shippingAddress: 'shippingAddress',
  billingAddress: 'billingAddress',
  paymentMethod: 'paymentMethod',
  paymentStatus: 'paymentStatus',
  paymentId: 'paymentId',
  shippingMethod: 'shippingMethod',
  shippingCost: 'shippingCost',
  subtotal: 'subtotal',
  tax: 'tax',
  total: 'total',
  status: 'status',
  trackingNumber: 'trackingNumber',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  productName: 'productName',
  productImage: 'productImage',
  price: 'price',
  quantity: 'quantity',
  variantId: 'variantId',
  variantInfo: 'variantInfo',
  createdAt: 'createdAt'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  productId: 'productId',
  rating: 'rating',
  title: 'title',
  comment: 'comment',
  approved: 'approved',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CouponScalarFieldEnum = {
  id: 'id',
  code: 'code',
  description: 'description',
  discountType: 'discountType',
  discountValue: 'discountValue',
  minOrder: 'minOrder',
  maxDiscount: 'maxDiscount',
  startDate: 'startDate',
  endDate: 'endDate',
  usageLimit: 'usageLimit',
  usedCount: 'usedCount',
  active: 'active',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WishlistScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WishlistItemScalarFieldEnum = {
  id: 'id',
  wishlistId: 'wishlistId',
  productId: 'productId',
  createdAt: 'createdAt'
};

exports.Prisma.RefreshTokenScalarFieldEnum = {
  id: 'id',
  token: 'token',
  userId: 'userId',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.ResetPasswordTokenScalarFieldEnum = {
  id: 'id',
  token: 'token',
  userId: 'userId',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.BlogPostScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  content: 'content',
  excerpt: 'excerpt',
  image: 'image',
  authorId: 'authorId',
  published: 'published',
  publishedAt: 'publishedAt',
  tags: 'tags',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.UserOrderByRelevanceFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  firstName: 'firstName',
  lastName: 'lastName',
  phone: 'phone',
  avatar: 'avatar',
  verificationToken: 'verificationToken'
};

exports.Prisma.AddressOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  receiver: 'receiver',
  phone: 'phone',
  city: 'city',
  province: 'province',
  address: 'address',
  postalCode: 'postalCode'
};

exports.Prisma.CategoryOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  image: 'image',
  parentId: 'parentId'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.ProductOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  sku: 'sku',
  categoryId: 'categoryId'
};

exports.Prisma.ProductAttributeOrderByRelevanceFieldEnum = {
  id: 'id',
  productId: 'productId',
  name: 'name',
  value: 'value'
};

exports.Prisma.ProductVariantOrderByRelevanceFieldEnum = {
  id: 'id',
  productId: 'productId',
  name: 'name',
  sku: 'sku'
};

exports.Prisma.CartOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId'
};

exports.Prisma.CartItemOrderByRelevanceFieldEnum = {
  id: 'id',
  cartId: 'cartId',
  productId: 'productId',
  variantId: 'variantId'
};

exports.Prisma.OrderOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  CouponId: 'CouponId',
  orderNumber: 'orderNumber',
  paymentId: 'paymentId',
  shippingMethod: 'shippingMethod',
  trackingNumber: 'trackingNumber',
  notes: 'notes'
};

exports.Prisma.OrderItemOrderByRelevanceFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  productName: 'productName',
  productImage: 'productImage',
  variantId: 'variantId',
  variantInfo: 'variantInfo'
};

exports.Prisma.ReviewOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  productId: 'productId',
  title: 'title',
  comment: 'comment'
};

exports.Prisma.CouponOrderByRelevanceFieldEnum = {
  id: 'id',
  code: 'code',
  description: 'description'
};

exports.Prisma.WishlistOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId'
};

exports.Prisma.WishlistItemOrderByRelevanceFieldEnum = {
  id: 'id',
  wishlistId: 'wishlistId',
  productId: 'productId'
};

exports.Prisma.RefreshTokenOrderByRelevanceFieldEnum = {
  id: 'id',
  token: 'token',
  userId: 'userId'
};

exports.Prisma.ResetPasswordTokenOrderByRelevanceFieldEnum = {
  id: 'id',
  token: 'token',
  userId: 'userId'
};

exports.Prisma.BlogPostOrderByRelevanceFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  content: 'content',
  excerpt: 'excerpt',
  image: 'image',
  authorId: 'authorId'
};
exports.Role = exports.$Enums.Role = {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  CUSTOMER: 'CUSTOMER'
};

exports.PaymentMethod = exports.$Enums.PaymentMethod = {
  CARD: 'CARD',
  PAYPAL: 'PAYPAL',
  BANK_TRANSFER: 'BANK_TRANSFER',
  COD: 'COD'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED'
};

exports.OrderStatus = exports.$Enums.OrderStatus = {
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED'
};

exports.DiscountType = exports.$Enums.DiscountType = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED: 'FIXED'
};

exports.Prisma.ModelName = {
  User: 'User',
  Address: 'Address',
  Category: 'Category',
  Product: 'Product',
  ProductAttribute: 'ProductAttribute',
  ProductVariant: 'ProductVariant',
  Cart: 'Cart',
  CartItem: 'CartItem',
  Order: 'Order',
  OrderItem: 'OrderItem',
  Review: 'Review',
  Coupon: 'Coupon',
  Wishlist: 'Wishlist',
  WishlistItem: 'WishlistItem',
  RefreshToken: 'RefreshToken',
  ResetPasswordToken: 'ResetPasswordToken',
  BlogPost: 'BlogPost'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
