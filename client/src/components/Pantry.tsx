import React, { useState, useEffect } from 'react';

interface DSLDProduct {
  id: number;
  fullName: string;
  brandName: string;
  upcSku: string;
  servingSize: string;
  productType: string;
}

interface PantryItem {
  id: number;
  productId: number;
  productName: string;
  brandName: string;
  upcSku: string;
  servingSize: string;
  quantity: number;
  addedAt: string;
  source?: 'pantry' | 'custom';
}

interface CustomSupplement {
  productName: string;
  brandName: string;
  upcSku: string;
  servingSize: string;
  productType: string;
  description: string;
}

const Pantry: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DSLDProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [isLoadingPantry, setIsLoadingPantry] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<DSLDProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customSupplement, setCustomSupplement] = useState<CustomSupplement>({
    productName: '',
    brandName: '',
    upcSku: '',
    servingSize: '',
    productType: '',
    description: ''
  });
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Load user's pantry on component mount
  useEffect(() => {
    loadPantry();
  }, []);

  const loadPantry = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/pantry', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPantry(data.pantry);
      }
    } catch (error) {
      console.error('Error loading pantry:', error);
    } finally {
      setIsLoadingPantry(false);
    }
  };

  const searchProducts = async () => {
    if (searchQuery.trim().length < 2) return;

    setIsSearching(true);
    try {
      const response = await fetch(`http://localhost:3001/api/dsld/search?query=${encodeURIComponent(searchQuery)}`);
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const addToPantry = async () => {
    if (!selectedProduct) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/pantry/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          productName: selectedProduct.fullName,
          brandName: selectedProduct.brandName,
          upcSku: selectedProduct.upcSku,
          servingSize: selectedProduct.servingSize,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        // Refresh pantry and reset form
        await loadPantry();
        setSelectedProduct(null);
        setQuantity(1);
        setSearchQuery('');
        setSearchResults([]);
        window.alert('Product added to pantry!');
      } else {
        const errorData = await response.json();
        window.alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding to pantry:', error);
      window.alert('Error adding product to pantry');
    }
  };

  const removeFromPantry = async (productId: number, source: 'pantry' | 'custom' = 'pantry') => {
    if (!window.confirm('Are you sure you want to remove this product from your pantry?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const url = source === 'custom' 
        ? `http://localhost:3001/api/pantry/${productId}?source=custom`
        : `http://localhost:3001/api/pantry/${productId}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await loadPantry();
        window.alert('Product removed from pantry');
      } else {
        const errorData = await response.json();
        window.alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error removing from pantry:', error);
      window.alert('Error removing product from pantry');
    }
  };

  const addCustomSupplement = async () => {
    if (!customSupplement.productName.trim()) return;

    setIsAddingCustom(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/custom-supplements/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customSupplement),
      });

      if (response.ok) {
        // Reset form and refresh pantry
        setCustomSupplement({
          productName: '',
          brandName: '',
          upcSku: '',
          servingSize: '',
          productType: '',
          description: ''
        });
        setShowCustomForm(false);
        await loadPantry();
        window.alert('Custom supplement added to pantry!');
      } else {
        const errorData = await response.json();
        window.alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding custom supplement:', error);
      window.alert('Error adding custom supplement');
    } finally {
      setIsAddingCustom(false);
    }
  };

  const handleCustomInputChange = (field: keyof CustomSupplement, value: string) => {
    setCustomSupplement(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
          </div>
          
          {/* Title and View Toggle */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-2">
                My Supplement Pantry
              </h1>
              <p className="text-gray-400">
                Search and manage the supplements you're currently taking
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center justify-center md:justify-end space-x-2">
              <span className="text-sm text-gray-400 mr-2">View:</span>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16M8 6v12M16 6v12" />
                </svg>
                Grid
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Search Section */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Search Supplements</h2>
            
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product name, brand, or UPC..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  minLength={2}
                />
                <button
                  type="submit"
                  disabled={isSearching || searchQuery.trim().length < 2}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-100">Search Results</h3>
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedProduct?.id === product.id
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                    }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="font-medium text-gray-100">{product.fullName}</div>
                    <div className="text-sm text-gray-400">
                      {product.brandName} • {product.productType}
                    </div>
                    {product.upcSku && (
                      <div className="text-xs text-gray-500">UPC: {product.upcSku}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add to Pantry Form */}
            {selectedProduct && (
              <div className="mt-6 p-4 border border-gray-600 rounded-lg bg-gray-700">
                <h4 className="font-medium text-gray-100 mb-3">Add to Pantry</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Product
                    </label>
                    <div className="text-sm text-gray-100">
                      {selectedProduct.fullName} by {selectedProduct.brandName}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-20"
                    />
                  </div>

                  <button
                    onClick={addToPantry}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Add to Pantry
                  </button>
                </div>
              </div>
            )}

            {/* Custom Supplement Form */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-100">Can't find your supplement?</h4>
                <button
                  onClick={() => setShowCustomForm(!showCustomForm)}
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                >
                  {showCustomForm ? 'Cancel' : 'Add Custom Supplement'}
                </button>
              </div>

              {showCustomForm && (
                <div className="p-4 border border-gray-600 rounded-lg bg-gray-700">
                  <h5 className="font-medium text-gray-100 mb-3">Add Custom Supplement</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={customSupplement.productName}
                        onChange={(e) => handleCustomInputChange('productName', e.target.value)}
                        placeholder="e.g., Vitamin D3 5000 IU"
                        className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        value={customSupplement.brandName}
                        onChange={(e) => handleCustomInputChange('brandName', e.target.value)}
                        placeholder="e.g., Nature Made"
                        className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          UPC/SKU
                        </label>
                        <input
                          type="text"
                          value={customSupplement.upcSku}
                          onChange={(e) => handleCustomInputChange('upcSku', e.target.value)}
                          placeholder="Optional"
                          className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Serving Size
                        </label>
                        <input
                          type="text"
                          value={customSupplement.servingSize}
                          onChange={(e) => handleCustomInputChange('servingSize', e.target.value)}
                          placeholder="e.g., 1 capsule"
                          className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Product Type
                      </label>
                      <input
                        type="text"
                        value={customSupplement.productType}
                        onChange={(e) => handleCustomInputChange('productType', e.target.value)}
                        placeholder="e.g., Vitamin, Mineral, Protein"
                        className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={customSupplement.description}
                        onChange={(e) => handleCustomInputChange('description', e.target.value)}
                        placeholder="Additional details about the supplement..."
                        className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                    </div>

                    <button
                      onClick={addCustomSupplement}
                      disabled={isAddingCustom || !customSupplement.productName.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAddingCustom ? 'Adding...' : 'Add Custom Supplement'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pantry Section */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Current Pantry</h2>
            
            {isLoadingPantry ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-400">Loading pantry...</p>
              </div>
            ) : pantry.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-gray-400">Your pantry is empty</p>
                <p className="text-sm text-gray-500">Search for supplements to add them here</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                {pantry.map((item) => (
                  <div key={item.id} className={`p-3 border rounded-lg ${
                    item.source === 'custom' ? 'border-blue-400 bg-blue-900/20' : 'border-gray-600 bg-gray-700'
                  } ${viewMode === 'grid' ? 'h-full' : ''}`}>
                    <div className={viewMode === 'grid' ? 'h-full flex flex-col' : 'flex justify-between items-start'}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="font-medium text-gray-100">{item.productName}</div>
                          {item.source === 'custom' && (
                            <span className="px-2 py-1 text-xs bg-blue-600 text-blue-100 rounded-full">
                              Custom
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400 mb-1">
                          {item.brandName} • Qty: {item.quantity}
                        </div>
                        {item.servingSize && (
                          <div className="text-xs text-gray-500 mb-1">Serving: {item.servingSize}</div>
                        )}
                        <div className="text-xs text-gray-500">
                          Added: {new Date(item.addedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={viewMode === 'grid' ? 'mt-auto pt-3' : ''}>
                        <button
                          onClick={() => removeFromPantry(item.productId, item.source)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Remove from pantry"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pantry;
