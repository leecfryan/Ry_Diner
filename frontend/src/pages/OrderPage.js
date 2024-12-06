import React, { useState } from "react";
import { createOrder } from "../api/api";

const OrderPage = () => {
  const [items, setItems] = useState([{ itemName: "", quantity: 1, price: 0 }]);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleOrderSubmit = async () => {
    try {
      const res = await createOrder({ items, totalPrice });
      alert("Order placed successfully!");
    } catch (error) {
      alert(error.response.data.message || "Order placement failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Place Your Order</h2>
      <div className="row">
        {items.map((item, index) => (
          <div key={index} className="col-md-4 mb-3">
            <div className="card p-3">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Item Name"
                value={item.itemName}
                onChange={(e) =>
                  setItems(
                    items.map((it, idx) =>
                      idx === index ? { ...it, itemName: e.target.value } : it
                    )
                  )
                }
              />
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) =>
                  setItems(
                    items.map((it, idx) =>
                      idx === index
                        ? { ...it, quantity: parseInt(e.target.value) }
                        : it
                    )
                  )
                }
              />
              <input
                type="number"
                className="form-control"
                placeholder="Price"
                value={item.price}
                onChange={(e) =>
                  setItems(
                    items.map((it, idx) =>
                      idx === index
                        ? { ...it, price: parseFloat(e.target.value) }
                        : it
                    )
                  )
                }
              />
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <button
          className="btn btn-success me-2"
          onClick={() =>
            setItems([...items, { itemName: "", quantity: 1, price: 0 }])
          }
        >
          Add Item
        </button>
        <button className="btn btn-primary" onClick={handleOrderSubmit}>
          Submit Order
        </button>
      </div>
    </div>
  );
};

export default OrderPage;
