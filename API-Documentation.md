
# 📘 Portfolio Manager API Documentation

Semua endpoint dilindungi dengan JWT Auth.

## 🔐 Authentication

Tambahkan header berikut untuk akses endpoint transaksi:

```
Authorization: Bearer <your-token>
```

---

## 🧑‍💼 User Routes

### 📥 Register
**POST** `/api/users/register`

**Body:**
```json
{
  "name": "Riyan",
  "email": "ryan@mail.com",
  "password": "123456"
}
```

---

### 🔑 Login
**POST** `/api/users/login`

**Body:**
```json
{
  "email": "ryan@mail.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "token": "<JWT-token>",
  "user": {
    "id": "userid",
    "name": "Ryan",
    "email": "ryan@mail.com"
  }
}
```

---

## 📊 Transaction Routes

### ➕ Create Transaction
**POST** `/api/transactions`

**Body:**
```json
{
  "ticker": "BBCA",
  "type": "buy",
  "lot": 100,
  "price": 8500,
  "date": "2025-07-12"
}
```

---

### 📄 Get All Transactions
**GET** `/api/transactions`

---

### ✏️ Update Transaction
**PUT** `/api/transactions/:id`

---

### ❌ Delete Transaction
**DELETE** `/api/transactions/:id`

---

### 📈 Portfolio Summary
**GET** `/api/transactions/portfolio-summary`

**Response:**
```json
[
  {
    "ticker": "BBCA",
    "totalLot": 200,
    "totalCost": 17000000,
    "averageBuy": 8500
  }
]
```

---

### 📊 Transaction Stats
**GET** `/api/transactions/transaction-stats`

**Response:**
```json
{
  "totalInvestment": 17000000,
  "buyCount": 3,
  "sellCount": 1,
  "top5StocksByLot": [
    {
      "ticker": "BBCA",
      "totalLot": 200,
      "averageBuy": 8500
    }
  ],
  "highestAverageBuy": 8500,
  "lowestAverageBuy": 8500
}
```
