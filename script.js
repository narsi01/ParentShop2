// Shopping cart functionality
const cart = []

// Reference to analytics object (provided by Segment snippet)
const analytics = window.analytics

// Segment tracking functions
function trackClick(eventName, properties = {}) {
  if (typeof analytics !== "undefined" && analytics) {
    analytics.track(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      page_title: document.title,
    })
  }
}

function trackFormSubmit(formName, properties = {}) {
  if (typeof analytics !== "undefined" && analytics) {
    analytics.track("Form Submitted", {
      form_name: formName,
      ...properties,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
    })
  }
}

function trackPageView(pageName, properties = {}) {
  if (typeof analytics !== "undefined" && analytics) {
    analytics.page(pageName, {
      ...properties,
      timestamp: new Date().toISOString(),
    })
  }
}

// Cart functions
function addToCart(productId, productName, price) {
  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: price,
      quantity: 1,
    })
  }

  updateCartUI()

  // Track add to cart event
  trackClick("Product Added to Cart", {
    product_id: productId,
    product_name: productName,
    price: price,
    cart_total: getCartTotal(),
    cart_size: getCartSize(),
  })

  // Show success message
  showNotification(`${productName} added to cart!`)
}

function removeFromCart(productId) {
  const itemIndex = cart.findIndex((item) => item.id === productId)
  if (itemIndex > -1) {
    const item = cart[itemIndex]
    cart.splice(itemIndex, 1)

    trackClick("Product Removed from Cart", {
      product_id: productId,
      product_name: item.name,
      price: item.price,
      cart_total: getCartTotal(),
      cart_size: getCartSize(),
    })
  }
  updateCartUI()
}

function updateCartUI() {
  const cartCount = document.querySelector(".cart-count")
  const cartItems = document.getElementById("cart-items")
  const cartTotal = document.getElementById("cart-total")

  if (cartCount) {
    cartCount.textContent = getCartSize()
  }

  if (cartItems) {
    cartItems.innerHTML = ""
    cart.forEach((item) => {
      const cartItem = document.createElement("div")
      cartItem.className = "cart-item"
      cartItem.innerHTML = `
                <div>
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <div>
                    <p>$${(item.price * item.quantity).toFixed(2)}</p>
                    <button onclick="removeFromCart('${item.id}')" class="btn btn-outline" style="margin-left: 10px; padding: 5px 10px;">Remove</button>
                </div>
            `
      cartItems.appendChild(cartItem)
    })

    if (cart.length === 0) {
      cartItems.innerHTML = "<p>Your cart is empty</p>"
    }
  }

  if (cartTotal) {
    cartTotal.textContent = getCartTotal().toFixed(2)
  }
}

function getCartSize() {
  return cart.reduce((total, item) => total + item.quantity, 0)
}

function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}

function openCart() {
  const modal = document.getElementById("cart-modal")
  if (modal) {
    modal.style.display = "block"
    updateCartUI()

    trackClick("Cart Opened", {
      cart_total: getCartTotal(),
      cart_size: getCartSize(),
    })
  }
}

function closeCart() {
  const modal = document.getElementById("cart-modal")
  if (modal) {
    modal.style.display = "none"
  }
}

function checkout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty!")
    return
  }

  // Track checkout initiation
  trackClick("Checkout Initiated", {
    cart_total: getCartTotal(),
    cart_size: getCartSize(),
    products: cart.map((item) => ({
      product_id: item.id,
      product_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  })

  // Simulate checkout process
  showNotification("Redirecting to checkout...")
  setTimeout(() => {
    window.location.href = "checkout.html"
  }, 1000)
}

// Newsletter signup
function handleNewsletterSignup(event) {
  event.preventDefault()
  const email = event.target.querySelector('input[type="email"]').value

  // Identify user when they sign up for newsletter
  if (typeof analytics !== "undefined" && analytics) {
    analytics.identify(email, {
      email: email,
      newsletter_signup: true,
      signup_source: "homepage",
      signup_date: new Date().toISOString(),
    })
  }

  trackFormSubmit("Newsletter Signup", {
    email: email,
    source: "homepage",
  })

  showNotification("Thank you for subscribing to our newsletter!")
  event.target.reset()
}

// Notification system
function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "var(--success-color)" : "var(--error-color)"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Add CSS for notification animation
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`
document.head.appendChild(style)

// Close modal when clicking outside
window.onclick = (event) => {
  const modal = document.getElementById("cart-modal")
  if (event.target === modal) {
    closeCart()
  }
}

// Track page load
document.addEventListener("DOMContentLoaded", () => {
  trackPageView("Homepage", {
    page_type: "landing",
    user_type: "visitor",
  })
})

// Track scroll depth
let maxScroll = 0
window.addEventListener("scroll", () => {
  const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
  if (scrollPercent > maxScroll) {
    maxScroll = scrollPercent
    if (maxScroll >= 25 && maxScroll < 50) {
      trackClick("Page Scroll", { depth: "25%" })
    } else if (maxScroll >= 50 && maxScroll < 75) {
      trackClick("Page Scroll", { depth: "50%" })
    } else if (maxScroll >= 75) {
      trackClick("Page Scroll", { depth: "75%" })
    }
  }
})
