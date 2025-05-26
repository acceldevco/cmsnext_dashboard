# مستندات API عمومی (`/api/global`)

این مستندات، راهنمایی برای استفاده از اندپوینت API عمومی در مسیر `/api/global` ارائه می‌دهد. این اندپوینت به شما امکان می‌دهد تا با مدل‌های مختلف تعریف‌شده در `prisma/schema.prisma` از طریق متدهای استاندارد HTTP تعامل داشته باشید.

## پارامترها

اکثر درخواست‌ها به این اندپوینت نیاز به پارامتر کوئری `modelName` دارند که نام مدلی را که می‌خواهید با آن کار کنید، مشخص می‌کند.

## مدل‌های موجود

لیست مدل‌هایی که می‌توانید از طریق پارامتر `modelName` به آن‌ها دسترسی پیدا کنید:

-   `User`
-   `Address`
-   `Category`
-   `Product`
-   `ProductAttribute`
-   `ProductVariant`
-   `Cart`
-   `CartItem`
-   `Order`
-   `OrderItem`
-   `Review`
-   `Coupon`
-   `Wishlist`
-   `WishlistItem`
-   `RefreshToken`
-   `ResetPasswordToken`
-   `BlogPost`

## متدهای HTTP

### 1. GET

برای دریافت یک رکورد خاص با شناسه یا تمام رکوردهای یک مدل استفاده می‌شود.

-   **مسیر:** `/api/global?modelName={modelName}&id={recordId}` (برای دریافت یک رکورد خاص)
-   **مسیر:** `/api/global?modelName={modelName}` (برای دریافت تمام رکوردها)
-   **متد:** `GET`
-   **پارامترهای کوئری:**
    -   `modelName` (الزامی): نام مدل (مثلاً `Product`).
    -   `id` (اختیاری): شناسه رکورد مورد نظر.

-   **مثال درخواست (دریافت یک محصول):**
    ```
    GET /api/global?modelName=Product&id=some-product-id
    ```
-   **مثال درخواست (دریافت تمام محصولات):**
    ```
    GET /api/global?modelName=Product
    ```
-   **پاسخ موفقیت‌آمیز (نمونه):**
    ```json
    {
      "id": "some-product-id",
      "name": "محصول نمونه",
      "price": 10000
      // ... سایر فیلدها
    }
    // یا آرایه‌ای از رکوردها در صورت عدم ارائه id
    ```
-   **پاسخ خطا (نمونه):**
    ```json
    {
      "error": "پیام خطا"
    }
    ```

### 2. POST

برای ایجاد یک رکورد جدید برای یک مدل مشخص استفاده می‌شود.

-   **مسیر:** `/api/global?modelName={modelName}`
-   **متد:** `POST`
-   **پارامترهای کوئری:**
    -   `modelName` (الزامی): نام مدل (مثلاً `User`).
-   **بدنه درخواست (Request Body):**
    -   یک آبجکت JSON حاوی داده‌های رکورد جدید.

-   **مثال درخواست (ایجاد کاربر جدید):**
    ```
    POST /api/global?modelName=User
    Content-Type: application/json

    {
      "email": "test@example.com",
      "password": "securepassword",
      "firstName": "نام",
      "lastName": "نام خانوادگی"
      // ... سایر فیلدهای مورد نیاز برای مدل User
    }
    ```
-   **پاسخ موفقیت‌آمیز (نمونه):**
    ```json
    {
      "id": "new-user-id",
      "email": "test@example.com",
      "firstName": "نام"
      // ... سایر فیلدها
    }
    ```
-   **پاسخ خطا (نمونه):**
    ```json
    {
      "error": "پیام خطا"
    }
    ```

### 3. PUT

برای به‌روزرسانی یک رکورد موجود برای یک مدل مشخص استفاده می‌شود. معمولاً شناسه رکورد باید در بدنه درخواست ارسال شود.

-   **مسیر:** `/api/global?modelName={modelName}`
-   **متد:** `PUT`
-   **پارامترهای کوئری:**
    -   `modelName` (الزامی): نام مدل (مثلاً `Product`).
-   **بدنه درخواست (Request Body):**
    -   یک آبجکت JSON حاوی `id` رکورد مورد نظر برای به‌روزرسانی و فیلدهایی که باید به‌روز شوند.

-   **مثال درخواست (به‌روزرسانی محصول):**
    ```
    PUT /api/global?modelName=Product
    Content-Type: application/json

    {
      "id": "existing-product-id",
      "price": 12000,
      "stock": 50
      // ... سایر فیلدهایی که می‌خواهید به‌روز کنید
    }
    ```
-   **پاسخ موفقیت‌آمیز (نمونه):**
    ```json
    {
      "id": "existing-product-id",
      "name": "نام محصول آپدیت شده",
      "price": 12000,
      "stock": 50
      // ... سایر فیلدها
    }
    ```
-   **پاسخ خطا (نمونه):**
    ```json
    {
      "error": "پیام خطا"
    }
    ```

### 4. DELETE

برای حذف یک رکورد خاص با شناسه از یک مدل مشخص استفاده می‌شود.

-   **مسیر:** `/api/global?modelName={modelName}&id={recordId}`
-   **متد:** `DELETE`
-   **پارامترهای کوئری:**
    -   `modelName` (الزامی): نام مدل (مثلاً `Category`).
    -   `id` (الزامی): شناسه رکورد مورد نظر برای حذف.

-   **مثال درخواست (حذف دسته‌بندی):**
    ```
    DELETE /api/global?modelName=Category&id=category-to-delete-id
    ```
-   **پاسخ موفقیت‌آمیز (نمونه):**
    ```json
    {
      "id": "category-to-delete-id",
      "name": "نام دسته‌بندی حذف شده"
      // ... سایر فیلدهای رکورد حذف شده
    }
    ```
-   **پاسخ خطا (نمونه):**
    ```json
    {
      "error": "پیام خطا"
    }
    ```

### 5. FIND

برای جستجوی رکوردها بر اساس شرایط خاص در یک مدل مشخص استفاده می‌شود. شرایط جستجو در بدنه درخواست ارسال می‌شوند.

-   **مسیر:** `/api/global?modelName={modelName}`
-   **متد:** `FIND` (توجه: `FIND` یک متد HTTP استاندارد نیست، این یک متد سفارشی است که در این API پیاده‌سازی شده است. در عمل، معمولاً از `POST` یا `GET` با پارامترهای پیچیده‌تر برای جستجو استفاده می‌شود.)
-   **پارامترهای کوئری:**
    -   `modelName` (الزامی): نام مدل (مثلاً `Order`).
-   **بدنه درخواست (Request Body):**
    -   یک آبجکت JSON حاوی شرایط جستجو (مثلاً فیلترها، مرتب‌سازی، صفحه‌بندی).

-   **مثال درخواست (جستجوی سفارش‌ها):**
    ```
    FIND /api/global?modelName=Order
    Content-Type: application/json

    {
      "where": {
        "status": "PROCESSING"
      },
      "orderBy": {
        "createdAt": "desc"
      }
    }
    ```
-   **پاسخ موفقیت‌آمیز (نمونه):**
    ```json
    [
      {
        "id": "order-id-1",
        "status": "PROCESSING",
        "total": 50000
        // ... سایر فیلدها
      },
      {
        "id": "order-id-2",
        "status": "PROCESSING",
        "total": 75000
        // ... سایر فیلدها
      }
    ]
    ```
-   **پاسخ خطا (نمونه):**
    ```json
    {
      "error": "پیام خطا"
    }
    ```

## نکات مهم

-   همیشه از `Content-Type: application/json` برای درخواست‌هایی که بدنه JSON دارند (POST, PUT, FIND) استفاده کنید.
-   پاسخ‌های خطا معمولاً شامل یک آبجکت با کلید `error` و پیام خطا هستند و کد وضعیت HTTP مناسب (مثلاً 500 یا 400) خواهند داشت.
-   برای جزئیات دقیق فیلدهای هر مدل، به فایل `prisma/schema.prisma` مراجعه کنید.