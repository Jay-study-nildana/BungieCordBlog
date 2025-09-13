import { useEffect, useState } from 'react';

const PRODUCT_STOCK_API = 'https://localhost:7226/api/ProductStock/by-superhero';
const ORDER_BASKET_ITEM_API = 'https://localhost:7226/api/Payment/orderbasketitem';
const USER_API = 'https://localhost:7226/api/Auth/me/guid';
const BASKET_API = 'https://localhost:7226/api/Payment/orderbasket/by-user';

const API_BASE = 'https://localhost:7226/api/SuperHeroes';
const POWERS_API_BASE = 'https://localhost:7226/api/SuperPowers/by-superhero';
const SIDEKICKS_API_BASE = 'https://localhost:7226/api/Sidekicks/by-superhero';

export function useSuperHeroCard(superHeroId) {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [powers, setPowers] = useState([]);
  const [powersLoading, setPowersLoading] = useState(true);
  const [powersError, setPowersError] = useState('');

  const [sidekicks, setSidekicks] = useState([]);
  const [sidekicksLoading, setSidekicksLoading] = useState(true);
  const [sidekicksError, setSidekicksError] = useState('');

  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [imagesError, setImagesError] = useState('');

  const [productStock, setProductStock] = useState(null);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockError, setStockError] = useState('');

  // Basket related state
  const [userId, setUserId] = useState('');
  const [basketId, setBasketId] = useState('');
  const [basketLoading, setBasketLoading] = useState(false);
  const [basketError, setBasketError] = useState('');

  // Cart UI state
  const [quantity, setQuantity] = useState(1);
  const [cartStatus, setCartStatus] = useState('');
  const [showCartStatus, setShowCartStatus] = useState(false);

  // Fetch hero details
  useEffect(() => {
    if (!superHeroId) return;
    const fetchHero = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/${superHeroId}`);
        if (!res.ok) throw new Error('Failed to fetch superhero');
        const data = await res.json();
        setHero(data);
      } catch (err) {
        setError('Error loading superhero details');
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, [superHeroId]);

  // Fetch powers
  useEffect(() => {
    if (!superHeroId) return;
    const fetchPowers = async () => {
      setPowersLoading(true);
      setPowersError('');
      try {
        const res = await fetch(`${POWERS_API_BASE}/${superHeroId}`);
        if (!res.ok) throw new Error('Failed to fetch powers');
        const data = await res.json();
        setPowers(data);
      } catch (err) {
        setPowersError('Error loading super powers');
      } finally {
        setPowersLoading(false);
      }
    };
    fetchPowers();
  }, [superHeroId]);

  // Fetch sidekicks
  useEffect(() => {
    if (!superHeroId) return;
    const fetchSidekicks = async () => {
      setSidekicksLoading(true);
      setSidekicksError('');
      try {
        const res = await fetch(`${SIDEKICKS_API_BASE}/${superHeroId}`);
        if (!res.ok) throw new Error('Failed to fetch sidekicks');
        const data = await res.json();
        setSidekicks(data);
      } catch (err) {
        setSidekicksError('Error loading sidekicks');
      } finally {
        setSidekicksLoading(false);
      }
    };
    fetchSidekicks();
  }, [superHeroId]);

  // Fetch images
  useEffect(() => {
    if (!superHeroId) return;
    const fetchImages = async () => {
      setImagesLoading(true);
      setImagesError('');
      try {
        const res = await fetch(`${API_BASE}/${superHeroId}/images`);
        if (!res.ok) throw new Error('Failed to fetch images');
        const data = await res.json();
        setImages(data);
      } catch (err) {
        setImagesError('Error loading images');
      } finally {
        setImagesLoading(false);
      }
    };
    fetchImages();
  }, [superHeroId]);

  // Fetch product stock
  useEffect(() => {
    if (!superHeroId) return;
    const fetchProductStock = async () => {
      setStockLoading(true);
      setStockError('');
      try {
        const res = await fetch(`${PRODUCT_STOCK_API}/${superHeroId}`);
        if (!res.ok) throw new Error('Failed to fetch product stock');
        const data = await res.json();
        setProductStock(data);
      } catch (err) {
        setStockError('Error loading product stock');
      } finally {
        setStockLoading(false);
      }
    };
    fetchProductStock();
  }, [superHeroId]);

  // Fetch userId and basketId
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    const fetchUserId = async () => {
      try {
        const res = await fetch(USER_API, {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch user ID');
        const data = await res.json();
        setUserId(data.userId);
      } catch (err) {
        setBasketError('Error fetching user ID');
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem('authToken');
    const fetchBasket = async () => {
      setBasketLoading(true);
      setBasketError('');
      try {
        const res = await fetch(`${BASKET_API}/${userId}`, {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch order basket');
        const data = await res.json();
        setBasketId(data.id);
      } catch (err) {
        setBasketError('Error fetching order basket');
      } finally {
        setBasketLoading(false);
      }
    };
    fetchBasket();
  }, [userId]);

  // Cart status disappear logic
  useEffect(() => {
    if (showCartStatus) {
      const timer = setTimeout(() => setShowCartStatus(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showCartStatus]);

  // Add to Cart handler
  const handleAddToCart = async () => {
    if (!basketId || !productStock?.id || quantity < 1) return;
    const token = localStorage.getItem('authToken');
    setCartStatus('');
    setShowCartStatus(false);
    try {
      const res = await fetch(ORDER_BASKET_ITEM_API, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderBasketId: basketId,
          productId: productStock.id,
          quantity: quantity,
          unitPrice: productStock.unitPrice,
        }),
      });
      if (!res.ok) throw new Error('Failed to add to cart');
      setCartStatus('Added to cart!');
    } catch (err) {
      setCartStatus('Failed to add to cart.');
    } finally {
      setShowCartStatus(true);
    }
  };

  // Quantity controls
  const handleMinus = () => setQuantity(q => Math.max(1, q - 1));
  const handlePlus = () => setQuantity(q => q + 1);

  return {
    hero,
    loading,
    error,
    powers,
    powersLoading,
    powersError,
    sidekicks,
    sidekicksLoading,
    sidekicksError,
    images,
    imagesLoading,
    imagesError,
    productStock,
    stockLoading,
    stockError,
    userId,
    basketId,
    basketLoading,
    basketError,
    quantity,
    cartStatus,
    showCartStatus,
    handleAddToCart,
    handleMinus,
    handlePlus,
  };
}