# 🔄 Circular Reference Fix

## Problem
The `/api-docs` endpoint was returning a 500 error due to circular references in entity relationships when Swagger tried to serialize the entity models.

## Solution
Added `@JsonIgnore` annotations to break circular references in bidirectional relationships.

## Changes Made

### Entity Relationships Fixed

#### 1. **Category ↔ Item**
- `Category.items` → `@JsonIgnore`
- Prevents infinite loop: Category → Item → Category

#### 2. **Item ↔ Review**
- `Item.reviews` → `@JsonIgnore`
- Prevents infinite loop: Item → Review → Item

#### 3. **Customer ↔ Multiple Relations**
- `Customer.reviews` → `@JsonIgnore`
- `Customer.orders` → `@JsonIgnore`
- `Customer.cart` → `@JsonIgnore`
- Prevents infinite loops with Review, Order, and Cart

#### 4. **Cart ↔ Customer**
- `Cart.customer` → `@JsonIgnore`
- Prevents infinite loop: Cart → Customer → Cart

#### 5. **CartItem ↔ Cart**
- `CartItem.cart` → `@JsonIgnore`
- Prevents infinite loop: CartItem → Cart → CartItem

#### 6. **Order ↔ Customer**
- `Order.customer` → `@JsonIgnore`
- Prevents infinite loop: Order → Customer → Order

#### 7. **OrderItem ↔ Order**
- `OrderItem.order` → `@JsonIgnore`
- Prevents infinite loop: OrderItem → Order → OrderItem

#### 8. **Review ↔ Item & Customer**
- `Review.item` → `@JsonIgnore`
- `Review.customer` → `@JsonIgnore`
- Prevents infinite loops with both Item and Customer

## How It Works

### Before Fix
```
Category → Item → Category → Item → Category... (infinite loop)
```

### After Fix
```
Category → Item (stops here, Category.items is ignored)
```

## Impact on API Responses

### What's Visible
- Parent entities (e.g., Category in Item response)
- Direct properties of entities
- Non-circular relationships

### What's Hidden
- Collection properties marked with `@JsonIgnore`
- Prevents JSON serialization errors
- Swagger can now generate documentation

## Example API Responses

### GET /api/items/{id}
```json
{
  "id": 1,
  "name": "Chocolate Cake",
  "description": "Delicious cake",
  "price": 25.99,
  "imageUrl": "cake.jpg",
  "category": {
    "id": 1,
    "name": "Cakes"
    // items list is ignored
  }
  // reviews list is ignored
}
```

### GET /api/cart/{customerId}
```json
{
  "id": 1,
  // customer is ignored
  "items": [
    {
      "id": 1,
      // cart is ignored
      "item": {
        "id": 1,
        "name": "Chocolate Cake",
        "price": 25.99
      },
      "quantity": 2
    }
  ]
}
```

## Testing

### Verify Swagger UI Works
1. Start the application
2. Navigate to: `http://localhost:8080/swagger-ui.html`
3. Should load without errors
4. All endpoints should be visible

### Verify API Docs
1. Navigate to: `http://localhost:8080/api-docs`
2. Should return JSON without 500 error
3. All schemas should be present

## Alternative Solutions (Not Used)

### 1. @JsonManagedReference / @JsonBackReference
- More complex to maintain
- Requires pairing on both sides

### 2. DTOs (Data Transfer Objects)
- Best practice for production
- Separates entity from API response
- More code but better control

### 3. @JsonIdentityInfo
- Uses object IDs to prevent loops
- Can make responses harder to read

## Recommendation for Production

For production applications, consider creating **DTOs** instead of returning entities directly:

```java
public class ItemResponse {
    private Integer id;
    private String name;
    private Double price;
    private String categoryName; // Instead of full Category object
    private Integer reviewCount;  // Instead of full Review list
}
```

This provides:
- ✅ Better control over API responses
- ✅ No circular reference issues
- ✅ Cleaner API documentation
- ✅ Ability to customize response per endpoint
- ✅ Security (hide sensitive fields)

## Files Modified

1. `Category.java`
2. `Item.java`
3. `Customer.java`
4. `Cart.java`
5. `CartItem.java`
6. `Order.java`
7. `OrderItem.java`
8. `Review.java`

---

**The `/api-docs` endpoint should now work correctly! ✅**
