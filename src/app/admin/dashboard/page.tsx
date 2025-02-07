

'use client'

import ProtectedRoute from "@/app/components/protected/page";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Order {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    zipCode: string;
    city: string;
    total: number;
    discount: number;
    subTotal: number;
    orderDate: string;
    status: string | null;
    cartItems: { name : string; image : any }[];
}

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        client.fetch(
            `*[_type == "order"]{
                _id,
                firstName,
                lastName,
                email,
                phone,
                address,
                zipCode,
                city,
                total,
                discount,
                subTotal,
                orderDate,
                status,
                cartItems[]->{name, image}
            }`
        )
        .then((data) => setOrders(data))
        .catch((error) => console.log("Error in fetching orders", error));
    }, []);

    const filteredOrders = filter === "All" ? orders : orders.filter((order) => order.status === filter);

    const toggleOrderDetails = (orderId: string) => {
        setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
    };

    const handleDelete = async (orderId: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            await client.delete(orderId);
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
            Swal.fire("Deleted!", "The order has been deleted.", "success");
        } catch (error) {
            console.error("Error deleting order:", error);
            Swal.fire("Error!", "Something went wrong while deleting.", "error");
        }
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await client.patch(orderId).set({ status: newStatus }).commit();
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );

            if (newStatus === "completed") {
                Swal.fire("Completed", "The order has been completed.", "success");
            } else if (newStatus === "delivered") {
                Swal.fire("Delivered", "The order has been delivered.", "success");
            } else if (newStatus === "cancelled") {
                Swal.fire("Cancelled", "The order has been cancelled.", "success");
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            Swal.fire("Error!", "Something went wrong while updating the status.", "error");
        }
    };

    
    const handleLogout = () => {
        
        localStorage.removeItem('user');
        
        window.location.href = "/";
    };

    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-100 p-4 md:p-6">
                <nav className="bg-gray-800 text-white p-4 shadow-lg flex flex-row justify-between items-center gap-4">
                    <h2 className="text-2xl font-bold ">Hekto - Admin Dashboard</h2>
                    <div className="hidden sm:flex flex-wrap gap-2">
                        {["All", "pending", "completed", "delivered", "cancelled"].map((status) => (
                            <button key={status}
                                className={`px-4 py-2 rounded-lg transition-all text-sm md:text-base ${
                                    filter === status
                                        ? "bg-white text-red-500 font-semibold"
                                        : "text-white bg-gray-700 hover:bg-gray-600"
                                }`}
                                onClick={() => setFilter(status)}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                    <button 
                        className="px-4 py-2 rounded-lg transition-all text-sm md:text-base text-white bg-red-500 hover:bg-red-600"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </nav>

                <div className="flex-1 p-4 overflow-auto">
                    <h2 className="text-2xl font-semibold text-center mb-4 ">Customer Order Details</h2>
                    <div className="overflow-auto bg-white rounded-lg shadow-md p-4">
                        <table className="w-full text-left text-sm md:text-base">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-2 md:p-4">ID</th>
                                    <th className="p-2 md:p-4">Customer</th>
                                    <th className="p-2 md:p-4">Address</th>
                                    <th className="p-2 md:p-4">Date</th>
                                    <th className="p-2 md:p-4">Total</th>
                                    <th className="p-2 md:p-4">Status</th>
                                    <th className="p-2 md:p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <React.Fragment key={order._id}>
                                        <tr className="cursor-pointer hover:bg-gray-100 transition-all text-xs md:text-sm"
                                            onClick={() => toggleOrderDetails(order._id)}>
                                            <td className="p-2 md:p-4">{order._id}</td>
                                            <td className="p-2 md:p-4">{order.firstName} {order.lastName}</td>
                                            <td className="p-2 md:p-4">{order.address}</td>
                                            <td className="p-2 md:p-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                                            <td className="p-2 md:p-4">${order.total}</td>
                                            <td className="p-2 md:p-4">
                                                <select value={order.status || ""} 
                                                        onChange={(e) => handleStatusChange(order._id, e.target.value)} 
                                                        className="bg-gray-100 p-1 rounded hover:bg-gray-200 transition-all">
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="p-2 md:p-4">
                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(order._id); }} 
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition-all">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                        {selectedOrderId === order._id && (
                                            <tr>
                                                <td colSpan={7} className="bg-gray-100 p-4 transition-all">
                                                    <h3 className="font-bold">Order Details</h3>
                                                    <p>Phone: <strong>{order.phone}</strong></p>
                                                    <p>Email: <strong>{order.email}</strong></p>
                                                    <p>City: <strong>{order.city}</strong></p>
                                                    <ul>
                                                        {order.cartItems.map((item, index) => (
                                                            <li className="flex items-center gap-2" key={index}>
                                                                {item.name}
                                                                {item.image && (
                                                                    <Image src={urlFor(item.image).url()} alt={item.name} width={50} height={50} className="rounded" />
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}


















