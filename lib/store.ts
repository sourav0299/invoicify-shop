import { create } from "zustand"
import type { Product } from "@/data/product"

type CartStore = {
  count: number
  inc: () => void
  dec: () => void
  reset: () => void
}

export const useCartStore = create<CartStore>()((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
  dec: () => set((state) => ({ count: Math.max(0, state.count - 1) })),
  reset: () => set({ count: 0 }),
}))

type ProductQuantityStore = {
  quantities: Record<string, number>
  getQuantity: (productId: string) => number
  increment: (productId: string) => void
  decrement: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
}

export const useProductQuantityStore = create<ProductQuantityStore>()((set, get) => ({
  quantities: {},
  getQuantity: (productId: string) => {
    return get().quantities[productId] || 1
  },
  increment: (productId: string) => {
    set((state) => ({
      quantities: {
        ...state.quantities,
        [productId]: (state.quantities[productId] || 1) + 1,
      },
    }))
  },
  decrement: (productId: string) => {
    set((state) => ({
      quantities: {
        ...state.quantities,
        [productId]: Math.max(1, (state.quantities[productId] || 1) - 1),
      },
    }))
  },
  setQuantity: (productId: string, quantity: number) => {
    set((state) => ({
      quantities: {
        ...state.quantities,
        [productId]: Math.max(1, quantity),
      },
    }))
  },
}))

type CartItem = {
  product: Product
  quantity: number
}

type ShoppingCartStore = {
  items: CartItem[]
  couponCode: string | null
  couponDiscount: number
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getSubtotal: () => number
  getTax: () => number
  getDiscount: () => number
  getTotal: () => number
  applyCoupon: (code: string) => void
  removeCoupon: () => void
}

export const useShoppingCartStore = create<ShoppingCartStore>()((set, get) => ({
  items: [],
  couponCode: null,
  couponDiscount: 0,

  addItem: (product: Product, quantity: number) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.product.id === product.id)

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          ),
        }
      } else {
        return {
          items: [...state.items, { product, quantity }],
        }
      }
    })
  },

  removeItem: (productId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }))
  },

  updateQuantity: (productId: string, quantity: number) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    }))
  },

  clearCart: () => {
    set({ items: [] })
  },

  getSubtotal: () => {
    return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  },

  getTax: () => {
    return Math.round(get().getSubtotal() * 0.06) // 6% tax
  },

  getDiscount: () => {
    return get().couponDiscount
  },

  getTotal: () => {
    return get().getSubtotal() + get().getTax() - get().getDiscount()
  },

  applyCoupon: (code: string) => {
    // Simple coupon logic
    if (code === "NEW10") {
      set({
        couponCode: code,
        couponDiscount: 5000, // ₹5000 discount
      })
    }
  },

  removeCoupon: () => {
    set({
      couponCode: null,
      couponDiscount: 0,
    })
  },
}))

export type Address = {
  id: string
  type: string
  street: string
  city: string
  state: string
  zipCode: string
  mobileNumber: string
}

type AddressStore = {
  addresses: Address[]
  selectedAddressId: string | null
  addAddress: (address: Omit<Address, "id">) => void
  updateAddress: (id: string, address: Omit<Address, "id">) => void
  removeAddress: (id: string) => void
  selectAddress: (id: string) => void
  getSelectedAddress: () => Address | undefined
}

export const useAddressStore = create<AddressStore>()((set, get) => ({
  addresses: [
    // {
    //   id: "1",
    //   type: "Home",
    //   street: "4517 Washington Ave.",
    //   city: "Manchester",
    //   state: "Kentucky",
    //   zipCode: "39495",
    //   mobileNumber: "9876543210",
    // },
    // {
    //   id: "2",
    //   type: "Office",
    //   street: "4517 Washington Ave.",
    //   city: "Manchester",
    //   state: "Kentucky",
    //   zipCode: "39495",
    //   mobileNumber: "9876543210",
    // },
  ],
  selectedAddressId: "1",

  addAddress: (address) => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({
      addresses: [...state.addresses, { id, ...address }],
      selectedAddressId: id,
    }))
  },

  updateAddress: (id, address) => {
    set((state) => ({
      addresses: state.addresses.map((addr) => (addr.id === id ? { ...addr, ...address } : addr)),
    }))
  },

  removeAddress: (id) => {
    set((state) => {
      const newAddresses = state.addresses.filter((addr) => addr.id !== id)
      const newSelectedId =
        state.selectedAddressId === id ? (newAddresses.length > 0 ? newAddresses[0].id : null) : state.selectedAddressId

      return {
        addresses: newAddresses,
        selectedAddressId: newSelectedId,
      }
    })
  },

  selectAddress: (id) => {
    set({ selectedAddressId: id })
  },

  getSelectedAddress: () => {
    const { addresses, selectedAddressId } = get()
    return addresses.find((addr) => addr.id === selectedAddressId)
  },
}))
