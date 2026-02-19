/**
 * Admin Panel - Skipline Go
 * Complete Product Management & Mode Configuration
 * 
 * Features:
 * - Customer Mode Management
 * - Staff Mode Management  
 * - Product CRUD Operations
 * - Bulk Upload with AI Product Detection
 * - Real-time Sync with Firebase
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft, Package, Users, ShieldCheck, Plus, Edit2, Trash2,
  Upload, Download, Save, X, Search, Filter, Image, FileText,
  Loader2, CheckCircle, AlertCircle, Sparkles, RefreshCw,
  BarChart3, Eye, Camera, List, Grid, Settings, Database,
  Copy, ChevronDown, ChevronRight
} from 'lucide-react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import {
  getAllProducts,
  saveProductToFirebase,
  deleteProductFromFirebase,
  bulkUploadProducts,
  getProductStats
} from '../services/firebaseService';
import { identifyProductsFromImage, identifyProductsFromText } from '../services/geminiService';

interface AdminViewProps {
  onExit: () => void;
}

type AdminTab = 'products' | 'customer-mode' | 'staff-mode' | 'analytics';
type ViewMode = 'grid' | 'list';

interface ProductFormData {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  discount?: number;
  category: string;
  image: string;
  icon?: string;
  aisle?: string;
  weight?: number;
  tags?: string[];
  description?: string;
  rating?: number;
  reviews?: number;
}

const CATEGORIES = [
  'Dairy', 'Snacks', 'Beverages', 'Personal Care', 'Staples',
  'Spices', 'Electronics', 'Fresh Produce', 'Instant Food', 'Home Care'
];

const AISLES = [
  'Aisle 1', 'Aisle 2', 'Aisle 3', 'Aisle 4', 'Aisle 5',
  'Aisle 6', 'Aisle 7', 'Aisle 8', 'Aisle 9', 'Aisle 10',
  'Aisle 11', 'Aisle 12', 'Aisle 13', 'Aisle 14', 'Aisle 15'
];

const PRODUCT_ICONS = [
  '🥛', '🧈', '🥣', '🧀', '🍜', '🍵', '☕', '🧃', '🥤',
  '🍪', '🥔', '🍿', '🧼', '🦷', '🧴', '🍚', '🫒', '🫘',
  '🌾', '🧂', '🌶️', '🟡', '🎧', '🔋', '💡', '🔊',
  '🍅', '🧅', '🥔', '🍌', '🍎', '🍞', '🥚', '🍗'
];

export const AdminView: React.FC<AdminViewProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Product Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    id: '',
    name: '',
    price: 0,
    category: 'Snacks',
    image: '',
    description: ''
  });
  
  // Bulk Upload State
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkUploadText, setBulkUploadText] = useState('');
  const [bulkUploadImage, setBulkUploadImage] = useState<string | null>(null);
  const [processingBulk, setProcessingBulk] = useState(false);
  const [identifiedProducts, setIdentifiedProducts] = useState<Partial<Product>[]>([]);
  
  // Notifications
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products when search or category changes
  useEffect(() => {
    let filtered = products;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const allProducts = await getAllProducts();
      setProducts(allProducts.length > 0 ? allProducts : MOCK_PRODUCTS);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(MOCK_PRODUCTS);
    }
    setLoading(false);
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Generate unique product ID
  const generateProductId = (category: string) => {
    const prefix = category.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    return `${prefix}${randomNum}`;
  };

  // Handle form input changes
  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Open product editor
  const openEditor = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        id: product.id,
        name: product.name,
        price: product.price,
        mrp: product.mrp,
        discount: product.discount,
        category: product.category,
        image: product.image,
        icon: product.icon,
        aisle: product.aisle,
        weight: product.weight,
        tags: product.tags,
        description: product.description,
        rating: product.rating,
        reviews: product.reviews
      });
    } else {
      setEditingProduct(null);
      setFormData({
        id: generateProductId('NEW'),
        name: '',
        price: 0,
        category: 'Snacks',
        image: '',
        description: ''
      });
    }
    setIsEditing(true);
  };

  // Save product
  const saveProduct = async () => {
    if (!formData.name || formData.name.trim() === '') {
      showNotification('error', 'Please enter a product name');
      return;
    }
    
    if (formData.price === undefined || formData.price === null || isNaN(formData.price)) {
      showNotification('error', 'Please enter a valid price');
      return;
    }

    setLoading(true);
    try {
      const productData: Product = {
        id: formData.id || `PROD${Date.now()}`,
        name: formData.name.trim(),
        price: Number(formData.price) || 0,
        mrp: formData.mrp ? Number(formData.mrp) : undefined,
        discount: formData.discount ? Number(formData.discount) : undefined,
        category: formData.category || 'General',
        image: formData.image || `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(formData.name)}`,
        icon: formData.icon,
        aisle: formData.aisle,
        weight: formData.weight ? Number(formData.weight) : undefined,
        tags: formData.tags,
        description: formData.description,
        rating: formData.rating ? Number(formData.rating) : 4.0,
        reviews: formData.reviews ? Number(formData.reviews) : 0
      };

      console.log('Saving product:', productData);
      await saveProductToFirebase(productData);
      
      // Update local state
      if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === productData.id ? productData : p));
      } else {
        setProducts(prev => [...prev, productData]);
      }
      
      setIsEditing(false);
      showNotification('success', editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
    } catch (error: any) {
      console.error('Error saving product:', error);
      showNotification('error', error?.message || 'Failed to save product');
    }
    setLoading(false);
  };

  // Delete product
  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setLoading(true);
    try {
      await deleteProductFromFirebase(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      showNotification('success', 'Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification('error', 'Failed to delete product');
    }
    setLoading(false);
  };

  // Handle bulk text upload
  const handleBulkTextUpload = async () => {
    if (!bulkUploadText.trim()) {
      showNotification('error', 'Please enter product list');
      return;
    }

    setProcessingBulk(true);
    try {
      const identified = await identifyProductsFromText(bulkUploadText);
      setIdentifiedProducts(identified);
      showNotification('success', `AI identified ${identified.length} products!`);
    } catch (error) {
      console.error('Error processing text:', error);
      showNotification('error', 'Failed to process product list');
    }
    setProcessingBulk(false);
  };

  // Handle bulk image upload
  const handleBulkImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProcessingBulk(true);
    try {
      // Convert image to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setBulkUploadImage(base64);
      
      // Use AI to identify products from image
      const identified = await identifyProductsFromImage(base64);
      setIdentifiedProducts(identified);
      showNotification('success', `AI identified ${identified.length} products from image!`);
    } catch (error) {
      console.error('Error processing image:', error);
      showNotification('error', 'Failed to process image');
    }
    setProcessingBulk(false);
  };

  // Handle CSV file upload
  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProcessingBulk(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const products: Partial<Product>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const product: any = {};
        
        headers.forEach((header, index) => {
          if (values[index]) {
            if (header === 'price' || header === 'mrp' || header === 'discount' || header === 'weight' || header === 'rating' || header === 'reviews') {
              product[header] = parseFloat(values[index]) || 0;
            } else if (header === 'tags') {
              product[header] = values[index].split(';').map(t => t.trim());
            } else {
              product[header] = values[index];
            }
          }
        });
        
        if (product.name) {
          product.id = product.id || generateProductId(product.category || 'NEW');
          products.push(product as Partial<Product>);
        }
      }
      
      setIdentifiedProducts(products);
      showNotification('success', `Parsed ${products.length} products from CSV!`);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      showNotification('error', 'Failed to parse CSV file');
    }
    setProcessingBulk(false);
  };

  // Save all identified products
  const saveIdentifiedProducts = async () => {
    if (identifiedProducts.length === 0) {
      showNotification('error', 'No products to save');
      return;
    }

    setProcessingBulk(true);
    try {
      const productsToSave = identifiedProducts.map(p => ({
        id: p.id || generateProductId(p.category || 'NEW'),
        name: p.name || 'Unknown Product',
        price: p.price || 0,
        mrp: p.mrp,
        discount: p.discount,
        category: p.category || 'General',
        image: p.image || `https://api.dicebear.com/7.x/icons/svg?seed=${p.name}`,
        icon: p.icon,
        aisle: p.aisle,
        weight: p.weight,
        tags: p.tags,
        description: p.description,
        rating: p.rating || 4.0,
        reviews: p.reviews || 0
      })) as Product[];

      await bulkUploadProducts(productsToSave);
      
      // Update local state
      setProducts(prev => [...prev, ...productsToSave]);
      setIdentifiedProducts([]);
      setBulkUploadText('');
      setBulkUploadImage(null);
      setShowBulkUpload(false);
      
      showNotification('success', `Successfully added ${productsToSave.length} products!`);
    } catch (error) {
      console.error('Error saving products:', error);
      showNotification('error', 'Failed to save products');
    }
    setProcessingBulk(false);
  };

  // Update identified product
  const updateIdentifiedProduct = (index: number, field: string, value: any) => {
    setIdentifiedProducts(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Remove identified product
  const removeIdentifiedProduct = (index: number) => {
    setIdentifiedProducts(prev => prev.filter((_, i) => i !== index));
  };

  // Export products as CSV
  const exportProductsCSV = () => {
    const headers = ['id', 'name', 'price', 'mrp', 'discount', 'category', 'image', 'icon', 'aisle', 'weight', 'tags', 'description', 'rating', 'reviews'];
    const csvContent = [
      headers.join(','),
      ...products.map(p => [
        p.id,
        `"${p.name}"`,
        p.price,
        p.mrp || '',
        p.discount || '',
        p.category,
        p.image,
        p.icon || '',
        p.aisle || '',
        p.weight || '',
        (p.tags || []).join(';'),
        `"${p.description || ''}"`,
        p.rating || '',
        p.reviews || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skipline-products-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Duplicate product
  const duplicateProduct = (product: Product) => {
    const newProduct = {
      ...product,
      id: generateProductId(product.category),
      name: `${product.name} (Copy)`
    };
    openEditor(newProduct as Product);
  };

  // Tab content renderers
  const renderProductsTab = () => (
    <div className="space-y-4">
      {/* Mobile-friendly Header Actions */}
      <div className="space-y-3">
        {/* Search Row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>
          
          {/* View Toggle */}
          <div className="flex bg-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg ${viewMode === 'grid' ? 'bg-amber-500 text-white' : 'text-slate-400'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'text-slate-400'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Actions Row - Scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 flex-shrink-0"
          >
            <option value="all">All</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          {/* Add New - Primary Action */}
          <button
            onClick={() => openEditor()}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors whitespace-nowrap text-sm font-medium flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
          
          {/* Bulk Upload */}
          <button
            onClick={() => setShowBulkUpload(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors whitespace-nowrap text-sm flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI</span>
          </button>
          
          {/* Export */}
          <button
            onClick={exportProductsCSV}
            className="p-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors flex-shrink-0"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
          
          {/* Refresh */}
          <button
            onClick={loadProducts}
            className="p-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors flex-shrink-0"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Bar - Mobile Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-slate-800 rounded-xl p-3 sm:p-4">
          <p className="text-slate-400 text-xs sm:text-sm">Total</p>
          <p className="text-xl sm:text-2xl font-bold text-white">{products.length}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-3 sm:p-4">
          <p className="text-slate-400 text-xs sm:text-sm">Categories</p>
          <p className="text-xl sm:text-2xl font-bold text-white">{new Set(products.map(p => p.category)).size}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-3 sm:p-4">
          <p className="text-slate-400 text-xs sm:text-sm">Avg Price</p>
          <p className="text-xl sm:text-2xl font-bold text-white">₹{Math.round(products.reduce((a, b) => a + b.price, 0) / products.length || 0)}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-3 sm:p-4">
          <p className="text-slate-400 text-xs sm:text-sm">Showing</p>
          <p className="text-xl sm:text-2xl font-bold text-white">{filteredProducts.length}</p>
        </div>
      </div>

      {/* Products Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-amber-500 transition-all group"
            >
              <div className="aspect-square relative bg-slate-700">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/icons/svg?seed=${product.name}`;
                  }}
                />
                {/* Action buttons - Always visible on mobile */}
                <div className="absolute top-1 right-1 flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEditor(product); }}
                    className="p-1.5 sm:p-2 bg-amber-500 rounded-lg text-white shadow-lg"
                  >
                    <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                    className="p-1.5 sm:p-2 bg-red-500 rounded-lg text-white shadow-lg"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
                {product.icon && (
                  <span className="absolute top-1 left-1 text-lg sm:text-2xl bg-black/30 rounded-lg px-1">{product.icon}</span>
                )}
              </div>
              <div className="p-2 sm:p-3">
                <h3 className="font-semibold text-white text-xs sm:text-sm truncate">{product.name}</h3>
                <p className="text-amber-500 font-bold text-sm sm:text-base">₹{product.price}</p>
                <p className="text-slate-500 text-xs truncate">{product.category}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-700 hover:border-amber-500 transition-all flex items-center gap-3"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/icons/svg?seed=${product.name}`;
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm truncate">{product.icon} {product.name}</h3>
                <p className="text-slate-400 text-xs sm:text-sm">{product.category}</p>
                <p className="text-amber-500 font-bold sm:hidden">₹{product.price}</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-amber-500 font-bold text-lg">₹{product.price}</p>
                {product.mrp && (
                  <p className="text-slate-500 text-sm line-through">₹{product.mrp}</p>
                )}
              </div>
              <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                <button
                  onClick={() => openEditor(product)}
                  className="p-1.5 sm:p-2 bg-amber-500 rounded-lg text-white hover:bg-amber-600"
                >
                  <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="p-1.5 sm:p-2 bg-red-500 rounded-lg text-white hover:bg-red-600"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg">No Products Found</h3>
          <p className="text-slate-400 text-sm mt-2">
            {searchQuery ? 'Try a different search term' : 'Add your first product to get started'}
          </p>
          <button
            onClick={() => openEditor()}
            className="mt-4 px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Product
          </button>
        </div>
      )}
    </div>
  );

  const renderCustomerModeTab = () => (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
          Customer Mode Settings
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm block mb-2">Default View</label>
              <select className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500">
                <option value="categories">Categories View</option>
                <option value="all">All Products</option>
                <option value="deals">Deals First</option>
              </select>
            </div>
            
            <div>
              <label className="text-slate-400 text-sm block mb-2">Enable AI Assistant</label>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
                <span className="text-slate-300">Sahayak AI Chat</span>
              </div>
            </div>
            
            <div>
              <label className="text-slate-400 text-sm block mb-2">Enable Preorder Mode</label>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
                <span className="text-slate-300">Allow Online Preorders</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm block mb-2">Cart Limit</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  defaultValue={99}
                  className="w-24 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
                <span className="text-slate-400">items max</span>
              </div>
            </div>
            
            <div>
              <label className="text-slate-400 text-sm block mb-2">Theme</label>
              <select className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500">
                <option value="amber">Amber (Default)</option>
                <option value="emerald">Emerald</option>
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-700">
          <h4 className="text-white font-semibold mb-3 sm:mb-4">Feature Toggles</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {['Barcode Scanner', 'Budget Tracker', 'Navigation', 'Offline Mode', 'Guest Checkout', 'Order History'].map(feature => (
              <div key={feature} className="flex items-center gap-2 sm:gap-3 bg-slate-700 p-2.5 sm:p-3 rounded-xl">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
                <span className="text-slate-300 text-xs sm:text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStaffModeTab = () => (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
          Staff Mode Settings
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm block mb-2">Verification Mode</label>
              <select className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500">
                <option value="auto">Auto (AI-Based)</option>
                <option value="manual">Manual Verification</option>
                <option value="random">Random Spot Check</option>
              </select>
            </div>
            
            <div>
              <label className="text-slate-400 text-sm block mb-2">Enable Theft Detection AI</label>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
                <span className="text-slate-300 text-sm">AI Theft Score Analysis</span>
              </div>
            </div>
            
            <div>
              <label className="text-slate-400 text-sm block mb-2">Theft Score Threshold</label>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <input
                  type="number"
                  defaultValue={65}
                  className="w-20 sm:w-24 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                />
                <span className="text-slate-400 text-sm">% (Flag above this)</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm block mb-2">QR Expiry Time</label>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <input
                  type="number"
                  defaultValue={30}
                  className="w-20 sm:w-24 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                />
                <span className="text-slate-400 text-sm">minutes</span>
              </div>
            </div>
            
            <div>
              <label className="text-slate-400 text-sm block mb-2">Staff Access Level</label>
              <select className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500">
                <option value="full">Full Access</option>
                <option value="verify">Verification Only</option>
                <option value="view">View Only</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-700">
          <h4 className="text-white font-semibold mb-3 sm:mb-4">Verification Actions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {['Quick Verify', 'Full Audit', 'Item Lookup', 'Flag Transaction', 'Print Receipt', 'Call Manager'].map(action => (
              <div key={action} className="flex items-center gap-2 sm:gap-3 bg-slate-700 p-2.5 sm:p-3 rounded-xl">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
                <span className="text-slate-300 text-xs sm:text-sm">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 sm:p-6">
          <p className="text-amber-100 text-xs sm:text-sm">Total Products</p>
          <p className="text-xl sm:text-3xl font-bold text-white">{products.length}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 sm:p-6">
          <p className="text-emerald-100 text-xs sm:text-sm">Categories</p>
          <p className="text-xl sm:text-3xl font-bold text-white">{new Set(products.map(p => p.category)).size}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 sm:p-6">
          <p className="text-blue-100 text-xs sm:text-sm">Avg Rating</p>
          <p className="text-xl sm:text-3xl font-bold text-white">
            {(products.reduce((a, b) => a + (b.rating || 4), 0) / products.length || 0).toFixed(1)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 sm:p-6">
          <p className="text-purple-100 text-xs sm:text-sm">Total Value</p>
          <p className="text-xl sm:text-3xl font-bold text-white">₹{products.reduce((a, b) => a + b.price, 0).toLocaleString()}</p>
        </div>
      </div>
      
      <div className="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Products by Category</h3>
        <div className="space-y-3">
          {CATEGORIES.map(cat => {
            const count = products.filter(p => p.category === cat).length;
            const percentage = (count / products.length * 100) || 0;
            return (
              <div key={cat} className="flex items-center gap-2 sm:gap-4">
                <span className="text-slate-400 text-xs sm:text-sm w-20 sm:w-32 truncate">{cat}</span>
                <div className="flex-1 h-2 sm:h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-white w-8 sm:w-16 text-right text-xs sm:text-sm">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Product Editor Modal
  const renderProductEditor = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 p-4 sm:p-6 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={() => setIsEditing(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-slate-400 text-sm block mb-2">Product ID *</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                placeholder="e.g., DAIRY001"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm block mb-2">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                placeholder="e.g., Amul Butter 500g"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div>
              <label className="text-slate-400 text-xs sm:text-sm block mb-2">Price (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                className="w-full px-2 sm:px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs sm:text-sm block mb-2">MRP (₹)</label>
              <input
                type="number"
                value={formData.mrp || ''}
                onChange={(e) => handleInputChange('mrp', parseFloat(e.target.value) || undefined)}
                className="w-full px-2 sm:px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs sm:text-sm block mb-2">Discount (%)</label>
              <input
                type="number"
                value={formData.discount || ''}
                onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || undefined)}
                className="w-full px-2 sm:px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Category & Aisle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-slate-400 text-sm block mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-sm block mb-2">Aisle</label>
              <select
                value={formData.aisle || ''}
                onChange={(e) => handleInputChange('aisle', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="">No Aisle</option>
                {AISLES.map(aisle => (
                  <option key={aisle} value={aisle}>{aisle}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image & Icon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-slate-400 text-sm block mb-2">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm block mb-2">Icon (Emoji)</label>
              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                {PRODUCT_ICONS.slice(0, 12).map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleInputChange('icon', icon)}
                    className={`text-lg sm:text-2xl p-1.5 sm:p-2 rounded-lg ${formData.icon === icon ? 'bg-amber-500' : 'bg-slate-700 hover:bg-slate-600'}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-slate-400 text-sm block mb-2">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 h-20 sm:h-24"
              placeholder="Product description..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-slate-400 text-sm block mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={(formData.tags || []).join(', ')}
              onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
              placeholder="dairy, milk, amul"
            />
          </div>

          {/* Rating & Reviews */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-slate-400 text-sm block mb-2">Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating || ''}
                onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                placeholder="4.5"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm block mb-2">Reviews Count</label>
              <input
                type="number"
                value={formData.reviews || ''}
                onChange={(e) => handleInputChange('reviews', parseInt(e.target.value) || undefined)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                placeholder="1000"
              />
            </div>
          </div>

          {/* Live Product Preview Card */}
          <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
            <label className="text-slate-400 text-sm block mb-3">Live Product Preview</label>
            <div className="flex gap-4 items-start">
              {/* Image Preview */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-600 overflow-hidden">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center text-3xl ${formData.image ? 'hidden' : ''}`}>
                    {formData.icon || '📦'}
                  </div>
                </div>
              </div>
              
              {/* Product Info Preview */}
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-sm sm:text-base truncate">
                  {formData.name || 'Product Name'}
                </h4>
                <p className="text-slate-400 text-xs mt-1 truncate">
                  {formData.category || 'Category'} {formData.aisle ? `• ${formData.aisle}` : ''}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-amber-500 font-bold text-sm sm:text-base">
                    ₹{formData.price || 0}
                  </span>
                  {formData.mrp && formData.mrp > (formData.price || 0) && (
                    <>
                      <span className="text-slate-500 text-xs line-through">₹{formData.mrp}</span>
                      <span className="text-emerald-400 text-xs font-medium">
                        {Math.round(((formData.mrp - (formData.price || 0)) / formData.mrp) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                {formData.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-slate-300 text-xs">{formData.rating}</span>
                    {formData.reviews && (
                      <span className="text-slate-500 text-xs">({formData.reviews})</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Tags Preview */}
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {formData.tags.slice(0, 5).map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-600 text-slate-300 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-800 p-4 sm:p-6 border-t border-slate-700 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={() => setIsEditing(false)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={saveProduct}
            disabled={loading}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
          >
            {loading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Save className="w-4 h-4 sm:w-5 sm:h-5" />}
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );

  // Bulk Upload Modal
  const renderBulkUploadModal = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 p-4 sm:p-6 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
            <span className="hidden sm:inline">AI-Powered </span>Bulk Upload
          </h2>
          <button
            onClick={() => {
              setShowBulkUpload(false);
              setIdentifiedProducts([]);
              setBulkUploadText('');
              setBulkUploadImage(null);
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Upload Options */}
          {identifiedProducts.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Text Input */}
              <div className="bg-slate-700 rounded-xl p-3 sm:p-4 border-2 border-slate-600 hover:border-purple-500 transition-colors">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mb-2 sm:mb-3" />
                <h3 className="text-white font-semibold text-sm sm:text-base mb-1 sm:mb-2">Paste Product List</h3>
                <p className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4">Enter product names, prices, etc. AI will identify and parse them.</p>
                <textarea
                  value={bulkUploadText}
                  onChange={(e) => setBulkUploadText(e.target.value)}
                  placeholder="Example:
1. Amul Butter 500g - ₹275
2. Parle-G Biscuits - ₹35
3. Tata Salt 1kg - ₹28"
                  className="w-full h-32 sm:h-40 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleBulkTextUpload}
                  disabled={processingBulk || !bulkUploadText.trim()}
                  className="w-full mt-2 sm:mt-3 px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {processingBulk ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Process with AI
                </button>
              </div>

              {/* Image Upload */}
              <div className="bg-slate-700 rounded-xl p-3 sm:p-4 border-2 border-slate-600 hover:border-purple-500 transition-colors">
                <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mb-2 sm:mb-3" />
                <h3 className="text-white font-semibold text-sm sm:text-base mb-1 sm:mb-2">Upload Image</h3>
                <p className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4">Upload a product list image or receipt. AI will identify products.</p>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBulkImageUpload}
                  className="hidden"
                />
                {bulkUploadImage ? (
                  <div className="relative">
                    <img
                      src={bulkUploadImage}
                      alt="Uploaded"
                      className="w-full h-32 sm:h-40 rounded-lg object-cover"
                    />
                    <button
                      onClick={() => setBulkUploadImage(null)}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    disabled={processingBulk}
                    className="w-full h-32 sm:h-40 border-2 border-dashed border-slate-500 rounded-lg text-slate-400 hover:text-white hover:border-purple-500 transition-colors flex flex-col items-center justify-center gap-2 text-sm"
                  >
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8" />
                    Click to upload image
                  </button>
                )}
              </div>

              {/* CSV Upload */}
              <div className="bg-slate-700 rounded-xl p-3 sm:p-4 border-2 border-slate-600 hover:border-purple-500 transition-colors">
                <Database className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mb-2 sm:mb-3" />
                <h3 className="text-white font-semibold text-sm sm:text-base mb-1 sm:mb-2">Import CSV</h3>
                <p className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4">Upload a CSV file with product data. Columns: name, price, category, etc.</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={processingBulk}
                  className="w-full h-32 sm:h-40 border-2 border-dashed border-slate-500 rounded-lg text-slate-400 hover:text-white hover:border-purple-500 transition-colors flex flex-col items-center justify-center gap-2 text-sm"
                >
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8" />
                  Click to upload CSV
                </button>
                <p className="text-slate-500 text-xs mt-2 text-center">Required columns: name, price</p>
              </div>
            </div>
          )}

          {/* Processing Indicator */}
          {processingBulk && (
            <div className="flex flex-col items-center justify-center py-8 sm:py-10">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500 animate-spin mb-3 sm:mb-4" />
              <p className="text-white font-semibold text-sm sm:text-base">AI is analyzing your products...</p>
              <p className="text-slate-400 text-xs sm:text-sm">This may take a few seconds</p>
            </div>
          )}

          {/* Identified Products Preview */}
          {identifiedProducts.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  Identified Products ({identifiedProducts.length})
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIdentifiedProducts([])}
                    className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={saveIdentifiedProducts}
                    disabled={processingBulk}
                    className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Save All
                  </button>
                </div>
              </div>

              <div className="max-h-72 sm:max-h-96 overflow-y-auto space-y-2 sm:space-y-3">
                {identifiedProducts.map((product, index) => (
                  <div
                    key={index}
                    className="bg-slate-700 rounded-xl p-3 sm:p-4 border border-slate-600"
                  >
                    {/* Mobile: stacked layout */}
                    <div className="flex sm:hidden flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium text-sm truncate flex-1 mr-2">{product.name || 'New Product'}</span>
                        <button
                          onClick={() => removeIdentifiedProduct(index)}
                          className="p-1.5 bg-red-500/20 text-red-400 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={product.name || ''}
                          onChange={(e) => updateIdentifiedProduct(index, 'name', e.target.value)}
                          placeholder="Name"
                          className="px-2 py-1.5 bg-slate-800 border border-slate-600 rounded text-white text-xs focus:outline-none focus:border-amber-500"
                        />
                        <input
                          type="number"
                          value={product.price || ''}
                          onChange={(e) => updateIdentifiedProduct(index, 'price', parseFloat(e.target.value) || 0)}
                          placeholder="Price"
                          className="px-2 py-1.5 bg-slate-800 border border-slate-600 rounded text-white text-xs focus:outline-none focus:border-amber-500"
                        />
                        <select
                          value={product.category || 'Snacks'}
                          onChange={(e) => updateIdentifiedProduct(index, 'category', e.target.value)}
                          className="px-2 py-1.5 bg-slate-800 border border-slate-600 rounded text-white text-xs focus:outline-none focus:border-amber-500"
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <select
                          value={product.aisle || ''}
                          onChange={(e) => updateIdentifiedProduct(index, 'aisle', e.target.value)}
                          className="px-2 py-1.5 bg-slate-800 border border-slate-600 rounded text-white text-xs focus:outline-none focus:border-amber-500"
                        >
                          <option value="">No Aisle</option>
                          {AISLES.map(aisle => (
                            <option key={aisle} value={aisle}>{aisle}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* Desktop: grid layout */}
                    <div className="hidden sm:grid grid-cols-5 gap-4 items-center">
                      <div>
                        <label className="text-slate-500 text-xs">Name</label>
                        <input
                          type="text"
                          value={product.name || ''}
                          onChange={(e) => updateIdentifiedProduct(index, 'name', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 text-xs">Price (₹)</label>
                        <input
                          type="number"
                          value={product.price || ''}
                          onChange={(e) => updateIdentifiedProduct(index, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 text-xs">Category</label>
                        <select
                          value={product.category || 'Snacks'}
                          onChange={(e) => updateIdentifiedProduct(index, 'category', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-amber-500"
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-500 text-xs">Aisle</label>
                        <select
                          value={product.aisle || ''}
                          onChange={(e) => updateIdentifiedProduct(index, 'aisle', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-amber-500"
                        >
                          <option value="">No Aisle</option>
                          {AISLES.map(aisle => (
                            <option key={aisle} value={aisle}>{aisle}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeIdentifiedProduct(index)}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onExit}
                className="p-1.5 bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Settings className="w-5 h-5 text-amber-500" />
                <h1 className="text-base sm:text-xl font-bold text-white">Admin</h1>
              </div>
            </div>
            
            <button
              onClick={loadProducts}
              className="p-1.5 bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex bg-slate-800/50 p-1 rounded-lg overflow-x-auto scrollbar-hide gap-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap text-xs sm:text-sm flex-shrink-0 ${
              activeTab === 'products' 
                ? 'bg-amber-500 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('customer-mode')}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap text-xs sm:text-sm flex-shrink-0 ${
              activeTab === 'customer-mode' 
                ? 'bg-amber-500 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Customer
          </button>
          <button
            onClick={() => setActiveTab('staff-mode')}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap text-xs sm:text-sm flex-shrink-0 ${
              activeTab === 'staff-mode' 
                ? 'bg-emerald-500 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Staff
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap text-xs sm:text-sm flex-shrink-0 ${
              activeTab === 'analytics' 
                ? 'bg-blue-500 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Stats
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-6 sm:pb-8">
        {activeTab === 'products' && renderProductsTab()}
        {activeTab === 'customer-mode' && renderCustomerModeTab()}
        {activeTab === 'staff-mode' && renderStaffModeTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </div>

      {/* Modals */}
      {isEditing && renderProductEditor()}
      {showBulkUpload && renderBulkUploadModal()}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl flex items-center justify-center sm:justify-start gap-2 sm:gap-3 z-50 ${
          notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          ) : (
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          )}
          <span className="text-white font-medium text-sm sm:text-base">{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default AdminView;
