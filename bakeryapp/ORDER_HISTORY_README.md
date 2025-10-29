# Order History System

## Overview
This system automatically moves delivered orders to a separate `order_history` table, solving the TransientObjectException and improving data management.

## How It Works

### Automatic Migration
When an order status is updated to "Delivered", the system automatically:
1. Creates a copy of the order in the `order_history` table
2. Creates copies of all order items in `order_history_items` table
3. Deletes the original order from the `orders` table
4. Stores only the item ID and name (no foreign key to items table)

### Benefits
- **No Foreign Key Issues**: Order history items store item ID as a regular integer, not a foreign key
- **Clean Deletion**: Items can be deleted without worrying about order history
- **Better Performance**: Active orders table stays small
- **Data Preservation**: Complete order history is maintained forever

## Database Setup

### 1. Run Migration Script
```bash
mysql -u your_username -p your_database < order_history_migration.sql
```

Or manually run the SQL commands in `order_history_migration.sql`

### 2. Restart Application
The application will automatically create the tables if using JPA auto-ddl.

## API Endpoints

### Get Customer Order History
```
GET /api/order-history/customer/{customerId}
```

### Get All Order History (Admin)
```
GET /api/order-history/all
```

### Migrate Existing Delivered Orders
```
POST /api/order-history/migrate-delivered
```
Use this endpoint once to migrate any existing delivered orders to the history table.

## Code Changes

### New Entities
- `OrderHistory` - Stores delivered order information
- `OrderHistoryItem` - Stores order item details (no FK to items)

### Modified Services
- `OrderService.updateOrderStatus()` - Automatically moves delivered orders to history
- `ItemService.deleteItem()` - Now checks order history instead of delivered orders
- `OrderHistoryService` - New service to manage order history

### Key Features
1. **Automatic**: No manual intervention needed
2. **Transactional**: All operations are atomic
3. **Safe**: Items can be deleted after orders are delivered
4. **Complete**: Full order history preserved

## Testing

### Test Order Flow
1. Create an order (status: Pending)
2. Update status to Confirmed
3. Update status to Delivered → Order moves to history automatically
4. Check `/api/order-history/customer/{id}` to see the order

### Test Item Deletion
1. Create an item and add to order
2. Deliver the order (moves to history)
3. Delete the item → Should succeed
4. Check order history → Item name still preserved

## Migration for Existing Data

If you have existing delivered orders, call this endpoint once:
```bash
curl -X POST http://localhost:8080/api/order-history/migrate-delivered
```

This will move all existing delivered orders to the history table.

## Notes
- Order history is permanent and cannot be deleted through the API
- Item names are preserved even if items are deleted
- Customer information is denormalized for historical accuracy
- The system maintains referential integrity without foreign keys
