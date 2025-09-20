"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Star, ArrowRight, Baby, Users, Shield } from "lucide-react"

declare global {
  interface Window {
    analytics: any
  }
}

const featuredProducts = [
  {
    id: 1,
    name: "Organic Cotton Baby Onesies (3-Pack)",
    price: 24.99,
    originalPrice: 34.99,
    image: "/organic-baby-onesies.jpg",
    rating: 4.8,
    reviews: 127,
    category: "Baby Essentials",
  },
  {
    id: 2,
    name: "Convertible High Chair",
    price: 89.99,
    originalPrice: 119.99,
    image: "/modern-high-chair.jpg",
    rating: 4.9,
    reviews: 89,
    category: "Feeding",
  },
  {
    id: 3,
    name: "Soft Play Activity Mat",
    price: 45.99,
    image: "/baby-play-mat.jpg",
    rating: 4.7,
    reviews: 203,
    category: "Play & Learn",
  },
  {
    id: 4,
    name: "Natural Teething Rings Set",
    price: 16.99,
    image: "/wooden-teething-rings.jpg",
    rating: 4.6,
    reviews: 156,
    category: "Baby Essentials",
  },
]

export default function HomePage() {
  useEffect(() => {
    // Track page view
    if (typeof window !== "undefined" && window.analytics) {
      window.analytics.page("Home", {
        title: "ParentShop - Home",
        path: "/",
        url: window.location.href,
      })
    }
  }, [])

  const trackEvent = (eventName: string, properties: any = {}) => {
    if (typeof window !== "undefined" && window.analytics) {
      console.log("Segment Track:", eventName, properties)
      window.analytics.track(eventName, properties)
    } else {
      console.warn("Segment analytics not available - track call skipped:", eventName)
    }
  }

  const handleProductClick = (product: any) => {
    trackEvent("Product Clicked", {
      product_id: product.id,
      product_name: product.name,
      product_category: product.category,
      product_price: product.price,
      position: featuredProducts.indexOf(product) + 1,
      list: "Featured Products",
    })
  }

  const handleAddToCart = (product: any) => {
    trackEvent("Product Added", {
      product_id: product.id,
      product_name: product.name,
      product_category: product.category,
      product_price: product.price,
      quantity: 1,
      cart_id: "temp_cart_" + Date.now(),
    })
  }

  const handleNewsletterSignup = (email: string) => {
    // Identify user when they sign up for newsletter
    if (typeof window !== "undefined" && window.analytics) {
      console.log("Segment Identify: User newsletter signup", { email, source: "homepage_hero" })
      window.analytics.identify(email, {
        email: email,
        newsletter_signup: true,
        signup_source: "homepage_hero",
        signup_date: new Date().toISOString(),
      })
    } else {
      console.warn("Segment analytics not available - identify call skipped")
    }
    
    trackEvent("Newsletter Signup", {
      email: email,
      source: "homepage_hero",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Baby className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">ParentShop</span>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/shop"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => trackEvent("Navigation Click", { destination: "Shop", location: "header" })}
              >
                Shop
              </Link>
              <Link
                href="/blog"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => trackEvent("Navigation Click", { destination: "Blog", location: "header" })}
              >
                Growing Family Blog
              </Link>
              <Link
                href="/about"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => trackEvent("Navigation Click", { destination: "About", location: "header" })}
              >
                About
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => trackEvent("Cart Viewed", { source: "header" })}>
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Button onClick={() => trackEvent("CTA Click", { button: "Get Started", location: "header" })}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">
            Everything You Need for Your Growing Family
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            From our Growing Family blog to your trusted parenting partner. Discover carefully curated products that
            make parenting easier and more joyful.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="px-8"
              onClick={() => trackEvent("CTA Click", { button: "Shop Now", location: "hero" })}
            >
              Shop Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => trackEvent("CTA Click", { button: "Read Our Story", location: "hero" })}
            >
              Read Our Story
            </Button>
          </div>

          {/* Newsletter Signup */}
          <div className="max-w-md mx-auto">
            <p className="text-sm text-muted-foreground mb-4">Join 50,000+ parents in our community</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                onFocus={() => trackEvent("Form Field Focused", { field: "email", form: "newsletter" })}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const email = (e.target as HTMLInputElement).value
                    if (email) {
                      handleNewsletterSignup(email)
                    }
                  }
                }}
              />
              <Button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                  const email = input?.value
                  if (email) {
                    handleNewsletterSignup(email)
                  }
                }}
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Safe & Tested</h3>
              <p className="text-muted-foreground text-sm">All products meet the highest safety standards</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Parent Community</h3>
              <p className="text-muted-foreground text-sm">Trusted by 50,000+ families worldwide</p>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Made with Love</h3>
              <p className="text-muted-foreground text-sm">Curated by parents, for parents</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hand-picked essentials that make parenting easier, safer, and more enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {product.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-destructive">
                        Save ${(product.originalPrice - product.price).toFixed(2)}
                      </Badge>
                    )}
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        trackEvent("Product Favorited", { product_id: product.id, product_name: product.name })
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
                    </div>

                    <h3
                      className="font-semibold mb-2 text-sm hover:text-primary transition-colors cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToCart(product)
                        }}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => trackEvent("CTA Click", { button: "View All Products", location: "featured_products" })}
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Growing Family Blog Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">From the Growing Family Blog</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real stories, expert advice, and parenting tips from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "10 Essential Items for Your Baby's First Month",
                excerpt: "Everything you need to know about preparing for your newborn's arrival...",
                author: "Ida Tarbell",
                date: "2 days ago",
                image: "/placeholder-xc3nh.png",
              },
              {
                title: "Creating Safe Sleep Environments",
                excerpt: "Expert tips on setting up the perfect nursery for peaceful nights...",
                author: "Dr. Sarah Chen",
                date: "1 week ago",
                image: "/placeholder-chh1r.png",
              },
              {
                title: "Introducing Solid Foods: A Parent's Guide",
                excerpt: "When and how to start your baby's journey with solid foods...",
                author: "Maria Rodriguez",
                date: "2 weeks ago",
                image: "/baby-food-variety.png",
              },
            ].map((post, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-6">
                    <h3
                      className="font-semibold mb-2 hover:text-primary transition-colors cursor-pointer"
                      onClick={() =>
                        trackEvent("Blog Post Clicked", {
                          post_title: post.title,
                          author: post.author,
                          position: index + 1,
                        })
                      }
                    >
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>By {post.author}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => trackEvent("CTA Click", { button: "Read More Stories", location: "blog_section" })}
            >
              Read More Stories
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Baby className="h-6 w-6" />
                <span className="text-xl font-bold">ParentShop</span>
              </div>
              <p className="text-sm opacity-90">
                From Growing Family blog to your trusted parenting partner. Making parenting easier, one product at a
                time.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li>
                  <Link
                    href="/shop/baby-essentials"
                    onClick={() => trackEvent("Footer Link Click", { link: "Baby Essentials" })}
                  >
                    Baby Essentials
                  </Link>
                </li>
                <li>
                  <Link href="/shop/feeding" onClick={() => trackEvent("Footer Link Click", { link: "Feeding" })}>
                    Feeding
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/play-learn"
                    onClick={() => trackEvent("Footer Link Click", { link: "Play & Learn" })}
                  >
                    Play & Learn
                  </Link>
                </li>
                <li>
                  <Link href="/shop/safety" onClick={() => trackEvent("Footer Link Click", { link: "Safety" })}>
                    Safety
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Growing Family</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li>
                  <Link href="/blog" onClick={() => trackEvent("Footer Link Click", { link: "Blog" })}>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/community" onClick={() => trackEvent("Footer Link Click", { link: "Community" })}>
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/experts" onClick={() => trackEvent("Footer Link Click", { link: "Expert Advice" })}>
                    Expert Advice
                  </Link>
                </li>
                <li>
                  <Link href="/stories" onClick={() => trackEvent("Footer Link Click", { link: "Parent Stories" })}>
                    Parent Stories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li>
                  <Link href="/help" onClick={() => trackEvent("Footer Link Click", { link: "Help Center" })}>
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" onClick={() => trackEvent("Footer Link Click", { link: "Contact Us" })}>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/returns" onClick={() => trackEvent("Footer Link Click", { link: "Returns" })}>
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" onClick={() => trackEvent("Footer Link Click", { link: "Shipping" })}>
                    Shipping
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-90">
            <p>&copy; 2024 ParentShop. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
