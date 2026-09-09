from rest_framework.test import APITestCase
from rest_framework import status
from catalog.models import Category, Product

class ProductAPITests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Electrónica")
        self.valid_payload = {
            "name": "Teclado Mecánico",
            "description": "Teclado switch blue retroiluminado",
            "price": "59.99",
            "stock": 15,
            "category": self.category.id
        }

    def test_create_product_success(self):
        response = self.client.post("/api/products/", self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "Teclado Mecánico")
        self.assertEqual(float(response.data["price"]), 59.99)
        self.assertEqual(response.data["stock"], 15)
        self.assertEqual(response.data["category"], self.category.id)
        self.assertEqual(Product.objects.count(), 1)

    def test_create_product_negative_price(self):
        payload = self.valid_payload.copy()
        payload["price"] = "-10.00"
        response = self.client.post("/api/products/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("price", response.data)

    def test_create_product_negative_stock(self):
        payload = self.valid_payload.copy()
        payload["stock"] = -5
        response = self.client.post("/api/products/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("stock", response.data)

    def test_create_product_missing_required_fields(self):
        response = self.client.post("/api/products/", {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        for field in ["name", "price", "stock", "category"]:
            self.assertIn(field, response.data)

    def test_create_product_nonexistent_category(self):
        payload = self.valid_payload.copy()
        payload["category"] = 9999
        response = self.client.post("/api/products/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("category", response.data)

    def test_filter_and_search_products(self):
        cat2 = Category.objects.create(name="Hogar")
        Product.objects.create(name="Mouse Gamer", price=25.0, stock=10, category=self.category)
        Product.objects.create(name="Lámpara LED", price=15.0, stock=5, category=cat2)

        response = self.client.get("/api/products/?search=Gamer")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data if isinstance(response.data, list) else response.data.get("results", [])
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["name"], "Mouse Gamer")

        response = self.client.get(f"/api/products/?category={cat2.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data if isinstance(response.data, list) else response.data.get("results", [])
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["name"], "Lámpara LED")

class CategoryAPITests(APITestCase):
    def test_category_unique_name(self):
        Category.objects.create(name="Tecnología")
        response = self.client.post("/api/categories/", {"name": "Tecnología"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)