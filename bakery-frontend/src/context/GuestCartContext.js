import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GUEST_CART_KEY = 'bakery_guest_cart';

const GuestCartContext = createContext(null);

export const useGuestCart = () => {
    const ctx = useContext(GuestCartContext);
    if (!ctx) throw new Error('useGuestCart must be used inside GuestCartProvider');
    return ctx;
};

const loadFromStorage = () => {
    try {
        const raw = localStorage.getItem(GUEST_CART_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const saveToStorage = (items) => {
    try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    } catch {
        // storage full or unavailable — silently ignore
    }
};

export const GuestCartProvider = ({ children }) => {
    const [guestCart, setGuestCart] = useState(loadFromStorage);

    // Persist to localStorage whenever cart changes
    useEffect(() => {
        saveToStorage(guestCart);
    }, [guestCart]);

    /** Add item or increment quantity if already present */
    const addToGuestCart = useCallback((itemData, quantity = 1, opts = {}) => {
        const { eggType = null, selectedWeight = null, priceAtAddition = null } = opts;
        setGuestCart((prev) => {
            const existingIdx = prev.findIndex(
                (ci) =>
                    ci.itemId === itemData.id &&
                    ci.eggType === eggType &&
                    ci.selectedWeight === selectedWeight
            );
            if (existingIdx !== -1) {
                const updated = [...prev];
                updated[existingIdx] = {
                    ...updated[existingIdx],
                    quantity: updated[existingIdx].quantity + quantity,
                };
                return updated;
            }
            return [
                ...prev,
                {
                    // Mirror the shape returned by cartAPI so Cart.js can use the same render logic
                    id: `guest-${Date.now()}-${itemData.id}`,
                    itemId: itemData.id,
                    item: {
                        id: itemData.id,
                        name: itemData.name,
                        price: itemData.price,
                        imageUrl: itemData.imageUrl,
                        stock: itemData.stock,
                        category: itemData.category,
                    },
                    quantity,
                    eggType,
                    selectedWeight,
                    priceAtAddition: priceAtAddition ?? itemData.price,
                },
            ];
        });
    }, []);

    /** Update quantity for a specific cart entry (by its id) */
    const updateGuestCartItem = useCallback((cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        setGuestCart((prev) =>
            prev.map((ci) => (ci.id === cartItemId ? { ...ci, quantity: newQuantity } : ci))
        );
    }, []);

    /** Remove a cart entry by its id */
    const removeFromGuestCart = useCallback((cartItemId) => {
        setGuestCart((prev) => prev.filter((ci) => ci.id !== cartItemId));
    }, []);

    /** Wipe the entire guest cart */
    const clearGuestCart = useCallback(() => {
        setGuestCart([]);
        localStorage.removeItem(GUEST_CART_KEY);
    }, []);

    const totalItems = guestCart.reduce((sum, ci) => sum + ci.quantity, 0);

    return (
        <GuestCartContext.Provider
            value={{
                guestCart,
                totalItems,
                addToGuestCart,
                updateGuestCartItem,
                removeFromGuestCart,
                clearGuestCart,
            }}
        >
            {children}
        </GuestCartContext.Provider>
    );
};

export default GuestCartContext;
