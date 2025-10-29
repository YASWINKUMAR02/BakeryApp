# Stock Management System

## Overview
Comprehensive inventory and stock management system for the Bakery Application with real-time validation, automatic stock updates, and low stock alerts.

## Features

### 1. **Stock Tracking**
- Real-time inventory tracking for all items
- Automatic stock deduction on order placement
- Stock restoration on order cancellation
- Color-coded stock status indicators

### 2. **Stock Validation**
- Prevents adding out-of-stock items to cart
- Validates stock availability when updating cart quantities
- Blocks order placement if insufficient stock
- Real-time stock checks during checkout

### 3. **Admin Stock Management**
- Update stock quantities (add, set, subtract)
- View low stock items (customizable threshold)
- View out-of-stock items
- Stock quantity displayed in items table

### 4. **Customer Experience**
- Stock status badges on product cards
- Stock availability warnings in cart dialog
- Maximum quantity limits based on available stock
- Clear error messages for stock issues

## Backend Implementation

### Item Entity
```java
@Column(nullable = false)
private Integer stock = 0;  // Available quantity

@Column(nullable = false)
private Boolean available = true;  // Product availability
```

### Stock Validation in CartService

#### Adding Items to Cart
```java
// Check availability
if (!item.getAvailable()) {
    throw new RuntimeException("Item is currently unavailable");
}

// Validate stock
if (item.getStock() < newQuantity) {
    throw new RuntimeException("Insufficient stock for item: " + item.getName() + 
                             ". Available: " + item.getStock() + 
                             ", Requested: " + newQuantity);
}
```

#### Updating Cart Items
```java
if (item.getStock() < quantity) {
    throw new RuntimeException("Insufficient stock for item: " + item.getName() + 
                             ". Available: " + item.getStock() + 
                             ", Requested: " + quantity);
}
```

### Stock Management in OrderService

#### Order Placement
```java
// Check stock availability
if (managedItem.getStock() < cartItem.getQuantity()) {
    throw new RuntimeException("Insufficient stock for item: " + managedItem.getName() + 
                             ". Available: " + managedItem.getStock() + 
                             ", Requested: " + cartItem.getQuantity());
}

// Update stock
itemService.updateStock(managedItem.getId(), cartItem.getQuantity());
```

#### Order Cancellation
```java
// Restore stock for all items
for (OrderItem orderItem : order.getOrderItems()) {
    if (orderItem.getItem() != null) {
        Item item = orderItem.getItem();
        item.setStock(item.getStock() + orderItem.getQuantity());
        if (item.getStock() > 0) {
            item.setAvailable(true);
        }
        itemService.updateItem(item.getId(), convertItemToRequest(item));
    }
}
```

### Stock Update Method in ItemService
```java
@Transactional
public void updateStock(Integer itemId, Integer quantity) {
    Item item = getItemById(itemId);
    item.setStock(item.getStock() - quantity);
    if (item.getStock() <= 0) {
        item.setStock(0);
        item.setAvailable(false);
    }
    itemRepository.save(item);
}
```

## API Endpoints

### Stock Management Endpoints

#### 1. Update Stock
```
PATCH /api/items/{id}/stock?quantity={quantity}&operation={operation}
```

**Parameters:**
- `id`: Item ID
- `quantity`: Quantity to add/subtract/set
- `operation`: `add`, `set`, or `subtract` (default: `add`)

**Example:**
```bash
# Add 50 units to stock
PATCH /api/items/1/stock?quantity=50&operation=add

# Set stock to 100
PATCH /api/items/1/stock?quantity=100&operation=set

# Subtract 10 units
PATCH /api/items/1/stock?quantity=10&operation=subtract
```

**Response:**
```json
{
  "success": true,
  "message": "Stock updated successfully",
  "data": {
    "id": 1,
    "name": "Chocolate Brownie",
    "stock": 50,
    "available": true,
    ...
  }
}
```

#### 2. Get Low Stock Items
```
GET /api/items/low-stock?threshold={threshold}
```

**Parameters:**
- `threshold`: Stock level threshold (default: 10)

**Example:**
```bash
GET /api/items/low-stock?threshold=15
```

**Response:**
```json
{
  "success": true,
  "message": "Low stock items retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Chocolate Brownie",
      "stock": 5,
      ...
    }
  ]
}
```

#### 3. Get Out of Stock Items
```
GET /api/items/out-of-stock
```

**Response:**
```json
{
  "success": true,
  "message": "Out of stock items retrieved successfully",
  "data": [
    {
      "id": 2,
      "name": "Vanilla Cake",
      "stock": 0,
      "available": false,
      ...
    }
  ]
}
```

## Frontend Implementation

### Stock Display in Shop

#### Stock Status Badges
```javascript
{item.stock === 0 ? (
  <Chip 
    label="Out of Stock" 
    size="small" 
    style={{ background: '#f44336', color: '#fff' }}
  />
) : item.stock <= 10 ? (
  <Chip 
    label={`Only ${item.stock} left`} 
    size="small" 
    style={{ background: '#ff9800', color: '#fff' }}
  />
) : (
  <Chip 
    label="In Stock" 
    size="small" 
    style={{ background: '#4caf50', color: '#fff' }}
  />
)}
```

#### Disabled Add to Cart Button
```javascript
<Button
  disabled={item.stock === 0 || !item.available}
  style={{ 
    background: item.stock === 0 || !item.available ? '#ccc' : '#ff6b35'
  }}
>
  {item.stock === 0 || !item.available ? 'Out of Stock' : 'Add to Cart'}
</Button>
```

### Stock Validation in Cart Dialog

#### Stock Alert
```javascript
<Alert severity={selectedItem.stock <= 10 ? "warning" : "info"}>
  {selectedItem.stock <= 10 
    ? `Only ${selectedItem.stock} items available in stock` 
    : `${selectedItem.stock} items available`}
</Alert>
```

#### Quantity Limit
```javascript
<TextField
  type="number"
  value={quantity}
  onChange={(e) => setQuantity(
    Math.max(1, Math.min(selectedItem?.stock || 1, parseInt(e.target.value) || 1))
  )}
  InputProps={{ inputProps: { min: 1, max: selectedItem?.stock || 1 } }}
  helperText={`Maximum: ${selectedItem?.stock || 0}`}
/>
```

### Admin Items Table

#### Stock Column with Color Coding
```javascript
<Chip 
  label={item.stock || 0} 
  size="small" 
  color={item.stock === 0 ? 'error' : item.stock <= 10 ? 'warning' : 'success'}
/>
```

#### Stock Field in Form
```javascript
<TextField
  label="Stock Quantity"
  type="number"
  value={currentItem.stock || 0}
  onChange={(e) => setCurrentItem({ 
    ...currentItem, 
    stock: parseInt(e.target.value) || 0 
  })}
  helperText="Available quantity in stock"
  InputProps={{ inputProps: { min: 0 } }}
/>
```

## Frontend API Service

```javascript
export const itemAPI = {
  // ... existing methods
  updateStock: (id, quantity, operation = 'add') => 
    api.patch(`/items/${id}/stock?quantity=${quantity}&operation=${operation}`),
  getLowStock: (threshold = 10) => 
    api.get(`/items/low-stock?threshold=${threshold}`),
  getOutOfStock: () => 
    api.get('/items/out-of-stock'),
};
```

## Stock Status Indicators

### Color Coding
- **Red (Error)**: Out of stock (0 items)
- **Orange (Warning)**: Low stock (≤10 items)
- **Green (Success)**: In stock (>10 items)

### Status Messages
- **Out of Stock**: Item unavailable, cannot add to cart
- **Only X left**: Low stock warning, limited quantity available
- **In Stock**: Sufficient stock available

## Error Messages

### Cart Operations
```
"Item 'Chocolate Brownie' is currently unavailable"
"Insufficient stock for item: Chocolate Brownie. Available: 0, Requested: 1"
```

### Order Placement
```
"Insufficient stock for item: Chocolate Brownie. Available: 5, Requested: 10"
```

### Stock Updates
```
"Stock cannot be negative"
"Invalid operation. Use 'add', 'set', or 'subtract'"
```

## Workflow Examples

### 1. Customer Adding Item to Cart
1. Customer views item with stock status badge
2. Clicks "Add to Cart" (disabled if out of stock)
3. Dialog shows available stock quantity
4. Quantity input limited to available stock
5. System validates stock before adding to cart
6. Error message if insufficient stock

### 2. Order Placement
1. Customer proceeds to checkout
2. System validates stock for all cart items
3. If sufficient stock:
   - Order created
   - Stock automatically deducted
   - Item marked unavailable if stock reaches 0
4. If insufficient stock:
   - Order blocked
   - Clear error message displayed
   - Customer can adjust cart

### 3. Order Cancellation
1. Customer cancels pending order
2. System restores stock for all items
3. Items marked available if stock > 0
4. Order removed from system

### 4. Admin Stock Management
1. Admin views items table with stock levels
2. Color-coded chips show stock status
3. Admin can:
   - Edit item to update stock
   - Use stock management endpoints
   - View low stock/out of stock reports

## Best Practices

### For Admins
1. **Regular Stock Checks**: Monitor low stock items regularly
2. **Restock Alerts**: Set up alerts for items below threshold
3. **Accurate Updates**: Always update stock when receiving inventory
4. **Bulk Operations**: Use API endpoints for bulk stock updates

### For Developers
1. **Always Validate**: Check stock before any cart/order operation
2. **Atomic Operations**: Use transactions for stock updates
3. **Clear Messages**: Provide specific error messages with stock info
4. **Real-time Updates**: Refresh stock data after operations

## Testing Stock Management

### Test Scenarios

#### 1. Add to Cart with Insufficient Stock
```javascript
// Item has 5 in stock, try to add 10
const result = await cartAPI.addItem(customerId, {
  itemId: 1,
  quantity: 10
});
// Expected: Error with stock availability message
```

#### 2. Order with Out of Stock Item
```javascript
// Add item to cart, then set stock to 0, try to place order
const result = await orderAPI.placeOrder(customerId, orderData);
// Expected: Error preventing order placement
```

#### 3. Stock Restoration on Cancel
```javascript
// Place order (stock deducted)
// Cancel order
// Verify stock restored
```

#### 4. Low Stock Alert
```javascript
// Get items with stock <= 10
const result = await itemAPI.getLowStock(10);
// Expected: List of low stock items
```

## Database Schema

### Item Table
```sql
CREATE TABLE items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    grams INT NOT NULL,
    image_url VARCHAR(500),
    stock INT NOT NULL DEFAULT 0,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

## Future Enhancements

1. **Stock History**: Track stock changes over time
2. **Automatic Reordering**: Alert when stock below threshold
3. **Reserved Stock**: Hold stock during checkout process
4. **Batch Updates**: Import/export stock data
5. **Stock Notifications**: Email alerts for low stock
6. **Analytics**: Stock turnover reports
7. **Expiry Tracking**: For perishable items
8. **Multi-location**: Track stock across locations

## Troubleshooting

### Issue: "Insufficient stock" error when stock shows available
**Solution**: Refresh the page to get latest stock data

### Issue: Stock not updating after order
**Solution**: Check transaction logs, ensure updateStock is called

### Issue: Negative stock values
**Solution**: Stock validation prevents this, check for race conditions

### Issue: Stock not restored on cancel
**Solution**: Verify order status is "Pending" before cancellation

## Summary

The stock management system provides:
- ✅ Real-time stock tracking
- ✅ Automatic stock updates on orders
- ✅ Stock validation at cart and checkout
- ✅ Admin stock management tools
- ✅ Customer-friendly stock indicators
- ✅ Low stock alerts and reporting
- ✅ Stock restoration on cancellation
- ✅ Clear error messaging

All stock operations are validated and transactional to ensure data integrity! 📦✨
