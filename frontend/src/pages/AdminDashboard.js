import React, { useState, useEffect, useContext } from "react";
import { fetchOrders, updateOrder } from "../api/api";
import {
  Card,
  Form,
  Button,
  Spinner,
  Badge,
  Toast,
  ToastContainer,
  Pagination,
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const AdminDashboard = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const { logout } = useContext(AuthContext);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchAllOrders(currentPage, historyPage);
  }, [currentPage, historyPage]);

  const fetchAllOrders = async (page, historyPage) => {
    try {
      setLoading(true);
      const res = await fetchOrders(page, historyPage);
      setActiveOrders(res.data.activeOrders);
      setOrderHistory(res.data.orderHistory);
      setTotalPages(res.data.activeOrderTotalPages);
      setHistoryTotalPages(res.data.historyTotalPages);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      const updatedOrder = await updateOrder(orderId, { status });

      if (status === "Completed") {
        // Move the order to "Completed" history
        setOrderHistory((prevOrders) => [...prevOrders, updatedOrder.data]);

        // Remove the order from active orders
        const updatedActiveOrders = activeOrders.filter(
          (order) => order._id !== orderId
        );

        if (updatedActiveOrders.length === 0 && currentPage > 1) {
          // If the current page is empty, go back to the previous page
          setCurrentPage((prevPage) => prevPage - 1);
        } else {
          setActiveOrders(updatedActiveOrders);
          // Refetch the next page to maintain 3 orders per page
          fetchAllOrders(currentPage, historyPage);
        }
      } else {
        // Update the status of the order in active orders
        setActiveOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: status } : order
          )
        );
      }

      setShowToast(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  const handlePageChange = (pageType, page) => {
    if (pageType === "active") {
      setCurrentPage(page);
    } else {
      setHistoryPage(page);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-danger text-center mt-5">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <ToastContainer className="p-3" position="top-end">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Order Status Updated</strong>
          </Toast.Header>
          <Toast.Body>Order status has been successfully updated!</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Active Orders Section */}
      <div>
        <h3>
          <Badge bg="primary">Active Orders</Badge>
        </h3>
        <div className="row">
          {activeOrders.length === 0 ? (
            <div className="text-center text-muted mt-3">
              No active orders available.
            </div>
          ) : (
            activeOrders.map((order) => (
              <div key={order._id} className="col-md-4 mb-4">
                <Card className="shadow-sm">
                  <Card.Header>
                    <strong>Order ID:</strong> {order._id}
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>
                      <strong>Customer:</strong> {order.customerName}
                    </Card.Title>
                    <Card.Text>
                      <strong>Items:</strong>
                      <ul>
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.itemName} (x{item.quantity}) - ${item.price}
                          </li>
                        ))}
                      </ul>
                      <strong>Total Price:</strong> $
                      {order.totalPrice.toFixed(2)}
                    </Card.Text>
                    <Form.Select
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      value={order.orderStatus}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </Form.Select>
                  </Card.Body>
                  <Card.Footer>
                    <Badge bg="info">Status: {order.orderStatus}</Badge>
                  </Card.Footer>
                </Card>
              </div>
            ))
          )}
        </div>
        {/* Pagination for Active Orders */}
        <Pagination className="justify-content-center mt-4">
          {[...Array(totalPages).keys()].map((page) => (
            <Pagination.Item
              key={page + 1}
              active={page + 1 === currentPage}
              onClick={() => handlePageChange("active", page + 1)}
            >
              {page + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>

      {/* Order History Section */}
      <div className="mt-5">
        <h3>
          <Badge bg="secondary">Order History</Badge>
        </h3>
        <div className="row">
          {orderHistory.length === 0 ? (
            <div className="text-center text-muted mt-3">
              No completed orders available.
            </div>
          ) : (
            orderHistory.map((order) => (
              <div key={order._id} className="col-md-4 mb-4">
                <Card className="shadow-sm">
                  <Card.Header>
                    <strong>Order ID:</strong> {order._id}
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>
                      <strong>Customer:</strong> {order.customerName}
                    </Card.Title>
                    <Card.Text>
                      <strong>Items:</strong>
                      <ul>
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.itemName} (x{item.quantity}) - ${item.price}
                          </li>
                        ))}
                      </ul>
                      <strong>Total Price:</strong> $
                      {order.totalPrice.toFixed(2)}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Badge bg="success">Status: {order.orderStatus}</Badge>
                  </Card.Footer>
                </Card>
              </div>
            ))
          )}
        </div>
        {/* Pagination for Order History */}
        <Pagination className="justify-content-center mt-4">
          {[...Array(historyTotalPages).keys()].map((page) => (
            <Pagination.Item
              key={page + 1}
              active={page + 1 === historyPage}
              onClick={() => handlePageChange("history", page + 1)}
            >
              {page + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </div>
  );
};

export default AdminDashboard;
