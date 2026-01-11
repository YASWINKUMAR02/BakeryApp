# 🔐 How to Add Admin Users

**Admin registration has been disabled from the web interface for security.**

Admins can **ONLY** be added directly via MySQL database.

---

## 📋 Quick Steps

### **1. Generate BCrypt Hash**
Go to: **https://bcrypt-generator.com/**
- Enter your password
- Rounds: **12**
- Click "Generate"
- Copy the hash

### **2. Insert into MySQL**
```sql
USE bakery_db;

INSERT INTO admins (name, email, password) 
VALUES ('Your Name', 'your.email@example.com', 'PASTE_HASH_HERE');
```

### **3. Verify**
```sql
SELECT id, name, email FROM admins;
```

### **4. Login**
- Go to: `http://localhost:3000/admin/login`
- Use your email and password
- Done! ✅

---

## 📝 Full Example

### **Step 1: Generate Hash**
```
Password: mySecurePass123
Hash: $2a$12$.JxyFnbZ7epvw0rD0PPGuOhlaRVBTG1nbmdA6fw6h4ZqOaa/I.na6
```

### **Step 2: Run SQL Command**
```sql
USE bakery_db;

INSERT INTO admins (name, email, password) 
VALUES ('Yaswin Kumar', 'yaswin02@gmail.com', '$2a$12$.JxyFnbZ7epvw0rD0PPGuOhlaRVBTG1nbmdA6fw6h4ZqOaa/I.na6');
```

### **Step 3: Check**
```sql
SELECT * FROM admins;
```

Output:
```
+----+--------------+---------------------+--------------------------------------------------------------+
| id | name         | email               | password                                                     |
+----+--------------+---------------------+--------------------------------------------------------------+
|  1 | Yaswin Kumar | yaswin02@gmail.com  | $2a$12$.JxyFnbZ7epvw0rD0PPGuOhlaRVBTG1nbmdA6fw6h4ZqOaa/I.na6 |
+----+--------------+---------------------+--------------------------------------------------------------+
```

---

## 🔒 Common BCrypt Hashes (For Testing Only!)

| Password | BCrypt Hash (Rounds: 12) |
|----------|--------------------------|
| `admin123` | `$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIVEmgRWTi` |
| `password` | `$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy` |

**⚠️ CHANGE THESE IMMEDIATELY IN PRODUCTION!**

---

## 🛠️ Using MySQL Workbench

1. Open **MySQL Workbench**
2. Connect to your database
3. Click on `bakery_db` schema
4. Right-click `admins` table → **Select Rows - Limit 1000**
5. Click the **grid icon** (Edit mode)
6. Click **Add Row** at bottom
7. Fill in:
   - `name`: Your name
   - `email`: Your email
   - `password`: BCrypt hash from generator
8. Click **Apply** → **Apply** again
9. Done! ✅

---

## 🆘 Troubleshooting

### **"Duplicate entry for key 'email'"**
Email already exists. Use different email or delete old admin:
```sql
DELETE FROM admins WHERE email = 'old@email.com';
```

### **"Invalid email or password" when logging in**
- Verify hash is correct (starts with `$2a$`)
- Check email is exactly the same
- Make sure you're using the correct password
- Clear browser cache and try again

### **Can't access MySQL**
```bash
# Windows
mysql -u root -p

# Enter password when prompted
```

---

## 🔐 Security Best Practices

1. ✅ **Use strong passwords** - At least 12 characters
2. ✅ **Unique email** for each admin
3. ✅ **Limit admin accounts** - Only create when necessary
4. ✅ **Don't share credentials**
5. ✅ **Change default passwords** immediately
6. ✅ **Use BCrypt rounds 12** for production

---

## 📊 Why This is Secure

- ❌ **No public registration** - Can't create admin from website
- ✅ **Database access required** - Must have MySQL access
- ✅ **BCrypt hashing** - Passwords never stored in plain text
- ✅ **One-way encryption** - Cannot reverse hash to password
- ✅ **Salt included** - Same password = different hashes

---

## 🎯 Quick Reference

**Generate Hash:** https://bcrypt-generator.com/

**Insert Command:**
```sql
INSERT INTO admins (name, email, password) 
VALUES ('Name', 'email@example.com', '$2a$12$HASH');
```

**Verify:**
```sql
SELECT id, name, email FROM admins;
```

**Login URL:**
- Development: `http://localhost:3000/admin/login`
- Production: `https://yourdomain.com/admin/login`

---

**That's it! Admin registration is now secure and controlled!** 🔒
