// Product data
const products = [
  {
    id: "organic-baby-blanket",
    name: "Organic Cotton Baby Blanket",
    price: 45,
    category: "baby",
    image: "/placeholder-vkrlo.png",
    description: "Ultra-soft organic cotton blanket perfect for newborns and infants.",
  },
  {
    id: "wooden-teething-ring",
    name: "Wooden Teething Ring",
    price: 18,
    category: "baby",
    image: "/placeholder-inibh.png",
    description: "Natural beechwood teething ring, safe and soothing for teething babies.",
  },
  {
    id: "nursing-pillow",
    name: "Ergonomic Nursing Pillow",
    price: 65,
    category: "parent",
    image: "/placeholder-xayrz.png",
    description: "Supportive nursing pillow designed for comfortable feeding sessions.",
  },
  {
    id: "toddler-learning-blocks",
    name: "Montessori Learning Blocks",
    price: 32,
    category: "toddler",
    image: "/placeholder-axg9v.png",
    description: "Educational wooden blocks that promote creativity and learning.",
  },
  {
    id: "baby-carrier",
    name: "Ergonomic Baby Carrier",
    price: 89,
    category: "baby",
    image: "/placeholder-q880t.png",
    description: "Comfortable and secure baby carrier for hands-free bonding.",
  },
  {
    id: "toddler-balance-bike",
    name: "Wooden Balance Bike",
    price: 125,
    category: "toddler",
    image: "/placeholder-457y8.png",
    description: "Sustainable wooden balance bike to develop coordination and confidence.",
  },
  {
    id: "postpartum-care-kit",
    name: "Postpartum Care Kit",
    price: 78,
    category: "parent",
    image: "/placeholder-0ho4o.png",
    description: "Complete care kit with essentials for postpartum recovery.",
  },
  {
    id: "baby-sleep-sack",
    name: "Organic Sleep Sack",
    price: 35,
    category: "baby",
    image: "/placeholder-w9ivq.png",
    description: "Safe and cozy sleep sack made from organic cotton.",
  },
  {
    id: "toddler-art-set",
    name: "Non-Toxic Art Set",
    price: 42,
    category: "toddler",
    image: "/placeholder-8m6af.png",
    description: "Complete art set with non-toxic materials for creative expression.",
  },
  {
    id: "nursing-tea",
    name: "Organic Nursing Tea",
    price: 24,
    category: "parent",
    image: "/placeholder-zflu2.png",
    description: "Herbal tea blend to support nursing mothers naturally.",
  },
  {
    id: "baby-mobile",
    name: "Wooden Crib Mobile",
    price: 58,
    category: "baby",
    image: "/placeholder-bwvyt.png",
    description: "Beautiful handcrafted mobile to stimulate baby's visual development.",
  },
  {
    id: "toddler-puzzle-set",
    name: "Educational Puzzle Set",
    price: 29,
    category: "toddler",
    image: "/placeholder-bj96x.png",
    description: "Set of wooden puzzles designed to develop problem-solving skills.",
  },
]

let filteredProducts = [...products]

// Segment tracking functions
function trackPageView(eventName, eventData) {
  if (typeof analytics !== "undefined" && analytics) {
    analytics.page(eventName, {
      ...eventData,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      page_title: document.title,
    })
  }
}

function trackClick(eventName, eventData) {
  if (typeof analytics !== "undefined" && analytics) {
    analytics.track(eventName, {
      ...eventData,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      page_title: document.title,
    })
  }
}

// Initialize shop page
document.addEventListener("DOMContentLoaded", () => {
  displayProducts(products)

  // Check for category filter from URL
  const urlParams = new URLSearchParams(window.location.search)
  const category = urlParams.get("category")
  if (category) {
    document.getElementById("category-filter").value = category
    filterProducts()
  }

  // Track page view
  trackPageView("Shop Page", {
    page_type: "product_listing",
    total_products: products.length,
  })
})

// Display products
function displayProducts(productsToShow) {
  const grid = document.getElementById("products-grid")
  grid.innerHTML = ""

  productsToShow.forEach((product) => {
    const productCard = document.createElement("div")
    productCard.className = "product-card"
    productCard.onclick = () => {
      trackClick("Product Click", {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        category: product.category,
      })
      viewProduct(product.id)
    }

    productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="btn btn-outline" onclick="event.stopPropagation(); addToCart('${product.id}', '${product.name}', ${product.price})">Add to Cart</button>
            </div>
        `

    grid.appendChild(productCard)
  })

  // Track products viewed
  trackClick("Products Viewed", {
    products_count: productsToShow.length,
    filter_applied: document.getElementById("category-filter").value !== "all",
  })
}

// Filter products
function filterProducts() {
  const categoryFilter = document.getElementById("category-filter").value
  const priceFilter = document.getElementById("price-filter").value

  filteredProducts = products.filter((product) => {
    // Category filter
    if (categoryFilter !== "all" && product.category !== categoryFilter) {
      return false
    }

    // Price filter
    if (priceFilter !== "all") {
      const [min, max] = priceFilter.split("-").map((p) => p.replace("+", ""))
      const minPrice = Number.parseInt(min)
      const maxPrice = max ? Number.parseInt(max) : Number.POSITIVE_INFINITY

      if (product.price < minPrice || product.price > maxPrice) {
        return false
      }
    }

    return true
  })

  sortProducts()
}

// Sort products
function sortProducts() {
  const sortBy = document.getElementById("sort-filter").value

  switch (sortBy) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price)
      break
    case "name":
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
      break
    default:
      // Keep original order for featured
      break
  }

  displayProducts(filteredProducts)
}

// View individual product (placeholder for product detail page)
function viewProduct(productId) {
  const product = products.find((p) => p.id === productId)
  if (product) {
    // In a real app, this would navigate to a product detail page
    alert(`Viewing ${product.name}\n\nPrice: $${product.price}\nDescription: ${product.description}`)
  }
}

// Add CSS for shop-specific styles
const shopStyles = document.createElement("style")
shopStyles.textContent = `
    .shop-header {
        background-color: var(--secondary-color);
        padding: 3rem 0;
        text-align: center;
    }
    
    .shop-header h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }
    
    .shop-header p {
        font-size: 1.1rem;
        color: var(--text-secondary);
    }
    
    .filters {
        background-color: white;
        border-bottom: 1px solid var(--border-color);
        padding: 1.5rem 0;
    }
    
    .filter-bar {
        display: flex;
        gap: 2rem;
        align-items: center;
        flex-wrap: wrap;
    }
    
    .filter-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .filter-group label {
        font-weight: 500;
        color: var(--text-primary);
    }
    
    .filter-group select {
        padding: 8px 12px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background-color: white;
        font-size: 0.9rem;
    }
    
    .products-section {
        padding: 3rem 0;
    }
    
    .product-description {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 1rem;
        line-height: 1.4;
    }
    
    @media (max-width: 768px) {
        .filter-bar {
            flex-direction: column;
            align-items: stretch;
        }
        
        .filter-group {
            justify-content: space-between;
        }
        
        .shop-header h1 {
            font-size: 2rem;
        }
    }
`
document.head.appendChild(shopStyles)
