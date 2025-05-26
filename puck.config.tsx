import { Puck, type Config } from "@measured/puck";
import { Heading} from "@/components/Heading";
import {  Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { Image  } from "@/components/Image";
import { ImageSlider } from "@/components/ImageSlider";
import { FigmaInspiredComponent } from "@/components/FigmaInspiredComponent";

// کامپوننت‌های سفارشی
import { ProductCard } from "@/components/ProductCard";
import { CategoryGrid } from "@/components/CategoryGrid";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { FeaturedProductsList } from "@/components/FeaturedProductsList"; // اضافه شده
import { CategoryShowcase } from "@/components/CategoryShowcase"; // اضافه شده
import { LatestBlogPosts } from "@/components/LatestBlogPosts"; // اضافه شده
import CategoryLandingPage from "@/components/CategoryLandingPage";
import ProductsAmazing from "@/components/ProductsAmazing"; // اضافه شده
// import { Button } from "./components/ui/button";

export const config: Config = {
  components: {
    // کامپوننت‌های پایه
    Heading: {
      fields: {
        text: { type: "text" },
        level: {
          type: "select",
          options: [
            { label: "Heading 1", value: "h1" },
            { label: "Heading 2", value: "h2" },
            { label: "Heading 3", value: "h3" },
          ],
        },
      },
      render: ({ text, level = "h2" }) => (
        <Heading as={level}>{text}</Heading>
      ),
    },
    
    Text: {
      fields: {
        text: { type: "text" },
        size: {
          type: "select",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
          ],
        },
      },
      render: ({ text, size = "md" }) => (
        <Text size={size}>{text}</Text>
      ),
    },
    
    Button: {
      fields: {
        text: { type: "text" },
        variant: {
          type: "select",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
          ],
        },
        url: { type: "text" },
      },
      render: ({ text, variant = "primary", url }) => (
        <Button variant={variant} href={url}>
          {text}
        </Button>
      ),
    },
    
    Image: {
      fields: {
        src: { type: "text" },
        alt: { type: "text" },
        width: { type: "number" },
        height: { type: "number" },
      },
      render: ({ src, alt, width, height }) => (
        <Image src={src} alt={alt} width={width} height={height} />
      ),
    },
    
    // کامپوننت‌های مخصوص فروشگاه
    HeroBanner: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "text" },
        image: { type: "text" },
        ctaText: { type: "text" },
        ctaUrl: { type: "text" },
      },
      render: ({ title, subtitle, image, ctaText, ctaUrl }) => (
        <div className="hero-banner">
          <div className="hero-content">
            <h1>{title}</h1>
            <p>{subtitle}</p>
            <Button href={ctaUrl}>{ctaText}</Button>
          </div>
          <Image src={image} alt={title} width={800} height={400} />
        </div>
      ),
    },
    
    ProductCard: {
      fields: {
        productId: { type: "text" },
        title: { type: "text" },
        price: { type: "text" },
        image: { type: "text" },
        rating: { type: "number" },
      },
      render: ({ productId, title, price, image, rating }) => (
        <ProductCard 
          id={productId}
          title={title}
          price={price}
          image={image}
          rating={rating}
        />
      ),
    },
    
    CategoryGrid: {
      fields: {
        categories: {
          type: "array",
          arrayFields: {
            name: { type: "text" },
            image: { type: "text" },
            url: { type: "text" },
          },
        },
      },
      render: ({ categories }) => (
        <CategoryGrid categories={categories} />
      ),
    },
    
    FeaturedProducts: {
      fields: {
        title: { type: "text" },
        products: {
          type: "array",
          arrayFields: {
            productId: { type: "text" },
          },
        },
      },
      render: ({ title, products = [] }) => (
        <FeaturedProducts title={title} productIds={products.map((p:any) => p.productId)} />
      ),
    },
    
    TestimonialSlider: {
      fields: {
        testimonials: {
          type: "array",
          arrayFields: {
            name: { type: "text" },
            comment: { type: "text" },
            rating: { type: "number" },
          },
        },
      },
      render: ({ testimonials }) => (
        <TestimonialSlider testimonials={testimonials} />
      ),
    },
    
    NewsletterSignup: {
      fields: {
        title: { type: "text" },
        description: { type: "text" },
      },
      render: ({ title, description }) => (
        <NewsletterSignup title={title} description={description} />
      ),
    },
    
    ProductGrid: {
      fields: {
        collectionId: { type: "text" },
        limit: { type: "number" },
        columns: {
          type: "select",
          options: [
            { label: "2 Columns", value: 2 },
            { label: "3 Columns", value: 3 },
            { label: "4 Columns", value: 4 },
          ],
        },
      },
      render: ({ collectionId, limit = 8, columns = 4 }) => (
        <div className="product-grid">
          {/* اینجا می‌توانید از کامپوننت‌های واقعی فروشگاه استفاده کنید */}
          {Array.from({ length: limit }).map((_, i) => (
            <ProductCard 
              key={i}
              id={`sample-${i}`}
              title={`Product ${i + 1}`}
              price="$19.99"
              image="/placeholder-product.jpg"
              rating={4}
            />
          ))}
        </div>
      ),
    },

    // کامپوننت‌های جدید اضافه شده
    FeaturedProductsList: {
      fields: {
        title: { type: "text", label: "عنوان بخش محصولات ویژه" },
        count: { type: "number", label: "تعداد محصولات (پیش‌فرض ۱۰)" },
        // کامپوننت React (@/components/FeaturedProductsList) اکنون داده‌های خود را
        // از اندپوینت `/api/global?modelName=Product` با متد `FIND` واکشی می‌کند.
        // بدنه درخواست (body) شامل پارامترهایی مانند `pageSize: count`، 
        // `where: { featured: true, published: true }` و `orderBy: { createdAt: "desc" }` است.
      },
      render: ({ title, count = 10 }) => (
        <FeaturedProductsList title={title} count={count} />
      ),
    },

    CategoryShowcase: {
      fields: {
        title: { type: "text", label: "عنوان بخش نمایش دسته‌بندی‌ها" },
        categoryIds: {
          type: "array",
          arrayFields: {
            id: { type: "text", label: "شناسه دسته‌بندی" },
          },
          label: "شناسه‌های دسته‌بندی برای نمایش",
          // کامپوننت React (@/components/CategoryShowcase) باید از regdbHandler
          // با modelName: "Category" و where: { id: { in: categoryIds.map(c => c.id) } } استفاده کند.
        },
        layout: {
          type: "select",
          options: [
            { label: "Grid", value: "grid" },
            { label: "Slider", value: "slider" },
          ],
          label: "نحوه نمایش (پیش‌فرض Grid)",
        },
      },
      render: ({ title, categoryIds, layout = "grid" }) => (
        <CategoryShowcase title={title} categoryIds={categoryIds.map((c: { id: string }) => c.id)} layout={layout} />
      ),
    },

    LatestBlogPosts: {
      fields: {
        title: { type: "text", label: "عنوان بخش آخرین پست‌های وبلاگ" },
        count: { type: "number", label: "تعداد پست‌ها (پیش‌فرض ۵)" },
        // کامپوننت React (@/components/LatestBlogPosts) باید از regdbHandler
        // با modelName: "BlogPost" و options: { orderBy: { publishedAt: "desc" }, where: { published: true } } استفاده کند.
      },
      render: ({ title, count = 5 }) => (
        <LatestBlogPosts title={title} count={count} />
      ),
    },

    // کامپوننت اسلایدر تصاویر
    ImageSlider: {
      fields: {
        title: { type: "text", label: "عنوان اسلایدر (اختیاری)" },
        images: {
          type: "array",
          label: "تصاویر اسلایدر",
          arrayFields: {
            src: { type: "text", label: "آدرس تصویر" },
            alt: { type: "text", label: "متن جایگزین" },
          },
        },
        autoplay: { 
          type: "select", 
          label: "پخش خودکار", 
          options: [
            { label: "True", value: "true" },
            { label: "False", value: "false" },
          ],
        },
        interval: { type: "number", label: "فاصله زمانی (میلی‌ثانیه)" },
      },
      render: ({ title, images = [], autoplay = "true", interval }) => (
        <ImageSlider 
          title={title} 
          images={images} 
          autoplay={autoplay === "true"} 
          interval={interval} 
        />
      ),
    },
    FigmaInspiredComponent: {
      fields: {
        title: { type: "text", label: "عنوان" },
        description: { type: "text", label: "توضیحات" },
        image: { type: "text", label: "آدرس تصویر" },
        ctaText: { type: "text", label: "متن دکمه (اختیاری)" },
        ctaUrl: { type: "text", label: "آدرس دکمه (اختیاری)" },
      },
      render: ({ title, description, image, ctaText, ctaUrl }) => (
        <FigmaInspiredComponent
          title={title}
          description={description}
          image={image}
          ctaText={ctaText}
          ctaUrl={ctaUrl}
        />
      ),
    },
    CategoryLandingPage: {
      fields: {
        title: { type: "text", label: "عنوان صفحه دسته بندی" },
      },
      render: ({ title = "دسته بندی" }) => (
        <CategoryLandingPage />
      ),
    },
    ProductsAmazing: {
      fields: {
        title: { type: "text", label: "عنوان بخش محصولات شگفت انگیز" },
        // فیلدهای دیگر را در صورت نیاز اضافه کنید
      },
      render: ({ title }) => (
        <ProductsAmazing />
      ),
    },
  },
  
  root: {
    fields: {
      title: { type: "text" },
      metaDescription: { type: "text" },
      favicon: { type: "text" },
    },
  },
  
  categories: {
    store: {
      title: "کامپوننت‌های فروشگاه",
      components: [
        "HeroBanner", 
        "ProductCard", 
        "ProductGrid", 
        "FeaturedProducts", 
        "CategoryGrid", 
        "FeaturedProductsList",
        "CategoryShowcase",
        "NewsletterSignup",
        "ProductsAmazing" // اضافه شده
      ],
    },
    blog: {
      title: "کامپوننت‌های وبلاگ",
      components: ["LatestBlogPosts"],
    },
    general: {
      title: "کامپوننت‌های عمومی",
      components: [
        "Heading", 
        "Text", 
        "Button", 
        "Image", 
        "TestimonialSlider",
        "ImageSlider",
        "FigmaInspiredComponent",
        "CategoryLandingPage"
      ],
    },
  },
  
  // تم‌های سفارشی برای ادیتور
  // ui: {
  //   theme: "light",
  //   // می‌توانید استایل‌های بیشتری اینجا اضافه کنید
  // },
};

// export function Editor() {
//   return (
//     <Puck>
//       <Puck.Outline />
//     </Puck>
//   );
// }
