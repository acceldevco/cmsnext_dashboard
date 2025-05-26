import { PrismaClient } from '../generated/prisma';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding the database.');

  // Seed Users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const password = 'password123'; // In real-world, hash this!

    const user = await prisma.user.create({
      data: {
        email,
        password,
        firstName,
        lastName,
        phone: faker.phone.number(),
        avatar: faker.image.avatar(),
        verified: true,
      },
    });
    users.push(user);
  }

  // Seed Categories
  const categories = [];
  for (let i = 0; i < 5; i++) {
    const name = faker.commerce.department();
    const slug = faker.helpers.slugify(name).toLowerCase() + `-${i}`;

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: faker.commerce.productDescription(),
      },
    });
    categories.push(category);
  }

  // Seed Products
  const products = [];
  for (let i = 0; i < 20; i++) {
    const name = faker.commerce.productName();
    const slug = faker.helpers.slugify(name).toLowerCase();
    const price = parseFloat(faker.commerce.price());

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: faker.commerce.productDescription(),
        price,
        images: JSON.stringify([faker.image.url(), faker.image.url()]),
        categoryId: faker.helpers.arrayElement(categories).id,
        published: true,
        featured: faker.datatype.boolean(),
      },
    });
    products.push(product);
  }

  // Seed Reviews
  for (let i = 0; i < 30; i++) {
    await prisma.review.create({
      data: {
        userId: faker.helpers.arrayElement(users).id,
        productId: faker.helpers.arrayElement(products).id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph(),
        approved: true,
      },
    });
  }

  // Seed Coupons
  const coupons = [];
  for (let i = 0; i < 5; i++) {
    const discountType = faker.helpers.arrayElement(['PERCENTAGE', 'FIXED']);
    const discountValue = parseFloat(faker.commerce.price({ min: 5, max: 50 }));
    const startDate = faker.date.past();
    const endDate = faker.date.future();

    const coupon = await prisma.coupon.create({
      data: {
        code: faker.string.alphanumeric(8).toUpperCase(),
        discountType,
        discountValue,
        startDate,
        endDate,
        active: true,
      },
    });
    coupons.push(coupon);
  }

  // Seed Orders
  for (let i = 0; i < 10; i++) {
    const user = faker.helpers.arrayElement(users);
    const coupon = faker.helpers.arrayElement(coupons);
    const shippingAddress = JSON.stringify({
      title: faker.location.streetAddress(),
      receiver: `${user.firstName} ${user.lastName}`,
      phone: faker.phone.number(),
      city: faker.location.city(),
      province: faker.location.state(),
      address: faker.location.streetAddress(),
      postalCode: faker.location.zipCode(),
    });
    const subtotal = parseFloat(faker.commerce.price({ min: 50, max: 200 }));
    const tax = subtotal * 0.09;
    const total = subtotal + tax;

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        CouponId: coupon.id,
        orderNumber: faker.string.alphanumeric(10).toUpperCase(),
        shippingAddress,
        paymentMethod: faker.helpers.arrayElement(['CARD', 'PAYPAL', 'BANK_TRANSFER', 'COD']),
        shippingMethod: 'Express',
        shippingCost: 10,
        subtotal,
        tax,
        total,
      },
    });

    // Seed Order Items
    for (let j = 0; j < 3; j++) {
      const product = faker.helpers.arrayElement(products);
      const quantity = faker.number.int({ min: 1, max: 5 });
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          productName: product.name,
          productImage: JSON.stringify(faker.image.url()),
          price: product.price,
          quantity,
        },
      });
    }
  }

  // Seed Blog Posts
  for (let i = 0; i < 15; i++) {
    const title = faker.lorem.sentence();
    const slug = faker.helpers.slugify(title).toLowerCase() + `-${i}`;
    await prisma.blogPost.create({
      data: {
        title,
        slug,
        content: faker.lorem.paragraphs(3),
        excerpt: faker.lorem.sentence(),
        image: faker.image.urlLoremFlickr({ category: 'nature' }),
        authorId: faker.helpers.arrayElement(users).id,
        published: true,
        publishedAt: faker.date.past(),
        tags: JSON.stringify(faker.lorem.words(5).split(' ')),
      },
    });
  }

  console.log('Seeding finished.');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
