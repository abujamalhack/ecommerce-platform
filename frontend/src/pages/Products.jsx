import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories] = useState([
    { value: 'games', label: '🎮 ألعاب' },
    { value: 'apps', label: '📱 تطبيقات' },
    { value: 'gift_cards', label: '🎁 بطاقات هدايا' }
  ])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, searchTerm])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {}
      if (selectedCategory) params.category = selectedCategory
      if (searchTerm) params.search = searchTerm

      const response = await axios.get('http://localhost:5000/api/products', { params })
      
      if (response.data.success) {
        setProducts(response.data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const ProductCard = ({ product }) => (
    <div className="card p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{product.game_name}</p>
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <span className="text-2xl">
            {product.category === 'games' ? '🎮' : 
             product.category === 'apps' ? '📱' : '🎁'}
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {product.description}
      </p>

      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-2xl font-bold text-blue-600">{product.price}</span>
          <span className="text-gray-500 text-sm mr-1">ريال</span>
        </div>
        <div className="text-sm text-gray-500">
          {product.auto_delivery ? '⚡ شحن فوري' : '⏱ يدوي'}
        </div>
      </div>

      <Link 
        to={`/product/${product._id}`}
        className="btn-primary w-full text-center block"
      >
        شراء الآن
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">منتجاتنا</h1>
          <p className="text-gray-600">أفضل العروض لشحن العملات والاشتراكات</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="🔍 ابحث عن منتج أو لعبة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-primary"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-primary"
              >
                <option value="">جميع الفئات</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-600">لم نتمكن من العثور على منتجات تطابق بحثك</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
