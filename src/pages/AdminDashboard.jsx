import React, { useState, useEffect } from 'react';
import { useMenu } from '../context/MenuContext';
import { Plus, Edit, Trash2, X, Save, ShoppingBag, Check, Truck, ChefHat, Clock, Phone, MapPin, User } from 'lucide-react';

const AdminDashboard = () => {
    const { menuItems, menuCategories, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [restaurantAddress, setRestaurantAddress] = useState(() => {
        const saved = localStorage.getItem('restaurantAddress');
        if (!saved || saved === "Amma's Kitchen, Mumbai") {
            localStorage.setItem('restaurantAddress', "Amma's Kitchen, Bidar, Karnataka");
            return "Amma's Kitchen, Bidar, Karnataka";
        }
        return saved;
    });

    const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('orders') || '[]'));

    useEffect(() => {
        const handleStorage = () => {
            setOrders(JSON.parse(localStorage.getItem('orders') || '[]'));
        };
        window.addEventListener('storage', handleStorage);
        const interval = setInterval(handleStorage, 2000); // Poll as backup
        return () => {
            window.removeEventListener('storage', handleStorage);
            clearInterval(interval);
        };
    }, []);

    const handleUpdateOrderStatus = (orderId, newStatus) => {
        const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        setOrders(updatedOrders);
    };

    // Initial state for new item
    const initialItemState = {
        name: '',
        category: 'Starters',
        price: '',
        description: '',
        image: '',
        popular: false,
    };

    const handleEditClick = (item) => {
        setCurrentItem(item);
        setIsEditing(true);
        setIsAdding(false);
    };

    const handleAddClick = () => {
        setCurrentItem(initialItemState);
        setIsAdding(true);
        setIsEditing(false);
    };

    const handleDeleteClick = (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            deleteMenuItem(id);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        // Convert price to number
        const itemToSave = {
            ...currentItem,
            price: Number(currentItem.price)
        };

        if (isEditing) {
            updateMenuItem(currentItem.id, itemToSave);
            setIsEditing(false);
        } else if (isAdding) {
            addMenuItem(itemToSave);
            setIsAdding(false);
        }
        setCurrentItem(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentItem(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveAddress = () => {
        localStorage.setItem('restaurantAddress', restaurantAddress);
        alert('Restaurant address saved successfully!');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Menu Administration</h1>
                    <button 
                        onClick={handleAddClick}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <Plus size={20} /> Add New Item
                    </button>
                </div>

                {/* Restaurant Settings */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Restaurant Settings</h2>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Address</label>
                            <input 
                                type="text" 
                                value={restaurantAddress} 
                                onChange={(e) => setRestaurantAddress(e.target.value)} 
                                className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white" 
                                placeholder="Enter the exact restaurant address"
                            />
                        </div>
                        <button 
                            onClick={handleSaveAddress}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Save size={20} /> Save Address
                        </button>
                    </div>
                </div>

                {/* Customer Orders */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <ShoppingBag className="text-primary" /> Customer Orders
                    </h2>
                    
                    {orders.length === 0 ? (
                        <p className="text-gray-500 text-center py-6">No orders placed yet.</p>
                    ) : (
                        <div className="space-y-6">
                            {orders.slice().reverse().map((order) => (
                                <div key={order.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-gray-50">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-lg text-gray-900">Order {order.id}</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                                                    order.status === 'waiting' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                                    order.status === 'preparing' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                                    order.status === 'delivering' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                                    order.status === 'delivered' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {order.status === 'waiting' ? 'Waiting for Admin' : order.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(order.date).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2">
                                            {order.status === 'waiting' && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                                                        className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                                                    >
                                                        <ChefHat size={16} /> Accept & Cook
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                                        className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                                                    >
                                                        <X size={16} /> Reject
                                                    </button>
                                                </>
                                            )}
                                            {order.status === 'preparing' && (
                                                <button
                                                    onClick={() => handleUpdateOrderStatus(order.id, 'delivering')}
                                                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                                                >
                                                    <Truck size={16} /> Ship for Delivery
                                                </button>
                                            )}
                                            {order.status === 'delivering' && (
                                                <button
                                                    onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                                                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                                                >
                                                    <Check size={16} /> Mark Delivered
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Customer Info */}
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-gray-400" />
                                                <span className="font-semibold">{order.customerName}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone size={16} className="text-gray-400" />
                                                <span>{order.customerPhone}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                <span>{order.deliveryAddress}</span>
                                            </div>
                                        </div>
                                        
                                        {/* Order Items */}
                                        <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                                            <h4 className="font-semibold text-gray-800 text-sm mb-2">Items Ordered:</h4>
                                            <div className="space-y-1.5 mb-3">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="flex justify-between text-sm text-gray-600">
                                                        <span>{item.name} x {item.quantity}</span>
                                                        <span>₹{item.price * item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                                                <span>Total:</span>
                                                <span className="text-primary">₹{order.total}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Form Modal (simplified as in-page for now) */}
                {(isEditing || isAdding) && (
                    <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Item' : 'Add New Item'}</h2>
                            <button onClick={() => { setIsEditing(false); setIsAdding(false); }} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                <input required type="text" name="name" value={currentItem.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select name="category" value={currentItem.category} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white">
                                    {menuCategories.filter(c => c !== 'All').map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                <input required type="number" name="price" value={currentItem.price} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input required type="url" name="image" value={currentItem.image} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea required name="description" value={currentItem.description} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white" rows="3"></textarea>
                            </div>
                            <div className="md:col-span-2 flex items-center">
                                <input type="checkbox" name="popular" id="popular" checked={currentItem.popular || false} onChange={handleChange} className="mr-2 h-4 w-4 text-primary rounded border-gray-300" />
                                <label htmlFor="popular" className="text-sm font-medium text-gray-700">Mark as Popular</label>
                            </div>
                            <div className="md:col-span-2 mt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => { setIsEditing(false); setIsAdding(false); }} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                                    <Save size={20} /> Save Item
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Items Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {menuItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img className="h-10 w-10 rounded-full object-cover" src={item.image} alt={item.name} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                    {item.popular && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Popular</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                            ₹{item.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEditClick(item)} className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center gap-1">
                                                <Edit size={16} /> Edit
                                            </button>
                                            <button onClick={() => handleDeleteClick(item.id)} className="text-red-600 hover:text-red-900 inline-flex items-center gap-1">
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
