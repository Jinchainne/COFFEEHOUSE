import { useState, useCallback, useEffect } from 'react';

export const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'vi', label: 'VI', name: 'Tiếng Việt' },
] as const;

export type LangCode = (typeof LANGUAGES)[number]['code'];

const translations: Record<LangCode, Record<string, string>> = {
  en: {
    // Navbar
    'nav.menu': 'Menu',
    'nav.orders': 'Orders',
    'nav.track': 'Track',
    'nav.feedback': 'Feedback',
    'nav.admin': 'Admin',
    'nav.cart': 'Cart',
    // Shop
    'shop.addToCart': 'Add to Cart',
    'shop.viewCart': 'View Cart',
    'shop.checkout': 'Checkout',
    'shop.total': 'Total',
    'shop.emptyCart': 'Your cart is empty',
    'shop.browseMenu': 'Browse our menu to add items',
    'shop.orderPlaced': 'Order Placed!',
    'shop.orderConfirmed': 'Your order has been confirmed',
    // Footer
    'footer.shop': 'Shop',
    'footer.payment': 'Payment',
    'footer.resources': 'Resources',
    'footer.menu': 'Menu',
    'footer.myOrders': 'My Orders',
    'footer.trackOrder': 'Track Order',
    'footer.copyright': '© 2026 Coffee House. All rights reserved. Built on Arc Testnet.',
    // Social Share
    'share.title': 'Share',
    'share.facebook': 'Facebook',
    'share.zalo': 'Zalo',
    'share.twitter': 'Twitter / X',
    'share.copyLink': 'Copy Link',
    'share.copied': 'Link copied!',
    // General
    'general.connectWallet': 'Connect Wallet',
    'general.disconnect': 'Disconnect',
    'general.cancel': 'Cancel',
    'general.confirm': 'Confirm',
    'general.loading': 'Loading...',
    'general.error': 'Error',
    'general.success': 'Success',
    // Banner
    'banner.official': 'Official e-commerce site · ',
    'banner.payWith': 'Pay with USDC on Arc Testnet',
    // Delivery
    'delivery.title': 'Delivery',
    'delivery.address': 'Delivery Address',
    'delivery.estimatedTime': 'Estimated Time',
    'delivery.free': 'Free',
  },
  vi: {
    // Navbar
    'nav.menu': 'Thực Đơn',
    'nav.orders': 'Đơn Hàng',
    'nav.track': 'Theo Dõi',
    'nav.feedback': 'Đánh Giá',
    'nav.admin': 'Quản Trị',
    'nav.cart': 'Giỏ Hàng',
    // Shop
    'shop.addToCart': 'Thêm Vào Giỏ',
    'shop.viewCart': 'Xem Giỏ Hàng',
    'shop.checkout': 'Thanh Toán',
    'shop.total': 'Tổng Cộng',
    'shop.emptyCart': 'Giỏ hàng trống',
    'shop.browseMenu': 'Duyệt thực đơn để thêm món',
    'shop.orderPlaced': 'Đã Đặt Hàng!',
    'shop.orderConfirmed': 'Đơn hàng đã được xác nhận',
    // Footer
    'footer.shop': 'Cửa Hàng',
    'footer.payment': 'Thanh Toán',
    'footer.resources': 'Tài Nguyên',
    'footer.menu': 'Thực Đơn',
    'footer.myOrders': 'Đơn Hàng Của Tôi',
    'footer.trackOrder': 'Theo Dõi Đơn',
    'footer.copyright': '© 2026 Coffee House. Mọi quyền được bảo lưu. Xây dựng trên Arc Testnet.',
    // Social Share
    'share.title': 'Chia sẻ',
    'share.facebook': 'Facebook',
    'share.zalo': 'Zalo',
    'share.twitter': 'Twitter / X',
    'share.copyLink': 'Sao chép liên kết',
    'share.copied': 'Đã sao chép!',
    // General
    'general.connectWallet': 'Kết Nối Ví',
    'general.disconnect': 'Ngắt Kết Nối',
    'general.cancel': 'Hủy',
    'general.confirm': 'Xác Nhận',
    'general.loading': 'Đang tải...',
    'general.error': 'Lỗi',
    'general.success': 'Thành Công',
    // Banner
    'banner.official': 'Trang thương mại điện tử chính thức · ',
    'banner.payWith': 'Thanh toán bằng USDC trên Arc Testnet',
    // Delivery
    'delivery.title': 'Giao Hàng',
    'delivery.address': 'Địa Chỉ Giao Hàng',
    'delivery.estimatedTime': 'Thời Gian Dự Kiến',
    'delivery.free': 'Miễn phí',
  },
};

const STORAGE_KEY = 'coffeehouse_lang';

function getStoredLang(): LangCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'vi') return stored;
  } catch {
    // SSR or localStorage unavailable
  }
  return 'en';
}

export function useTranslation() {
  const [lang, setLang] = useState<LangCode>(getStoredLang);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      return translations[lang]?.[key] ?? translations.en[key] ?? fallback ?? key;
    },
    [lang]
  );

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'vi' : 'en'));
  }, []);

  return { t, lang, setLang, toggleLang };
}
