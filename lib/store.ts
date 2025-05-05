import { create } from "zustand"

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
