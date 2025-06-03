import React, { useEffect, useState } from "react";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    points: 0,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await fetch("http://localhost:5000/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", email: "", phone: "", points: 0 });
    const res = await fetch("http://localhost:5000/api/customers");
    setCustomers(await res.json());
  };

  return (
    <div>
      <h2>Quản lý khách hàng</h2>
      <div>
        <input
          name="name"
          placeholder="Tên"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          name="points"
          type="number"
          placeholder="Điểm tích lũy"
          value={form.points}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Thêm khách hàng</button>
      </div>
      <table border="1">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Điểm tích lũy</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((cus) => (
            <tr key={cus.id}>
              <td>{cus.name}</td>
              <td>{cus.email}</td>
              <td>{cus.phone}</td>
              <td>{cus.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customer;
