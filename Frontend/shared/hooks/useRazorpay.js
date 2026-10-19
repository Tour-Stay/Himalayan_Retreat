import { useState } from 'react';
import { loadRazorpayScript } from '../utils/loadRazorpay';
import apiClient from '../services/apiClient';

export const useRazorpay = () => {
  const [isProcessing, setIsProcessing] = useState(false);

    const initializePayment = async ({
    bookingId,
    receiptId,
    amount, // Retained for backwards-compatibility with existing callers, but intentionally ignored
    bookingType = 'travel',
    prefill = { name: '', email: '', contact: '' },
    notes = {},
    onSuccess,
    onFailure,
  }) => {
    setIsProcessing(true);
    try {
      // 1. Load the Razorpay Checkout Script dynamically
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Are you online?');
      }

      const targetBookingId = bookingId || receiptId;
      if (!targetBookingId) {
        throw new Error('bookingId is required to initiate secure payment');
      }

      // 2. Fetch the Key ID from backend
      const keyRes = await apiClient.get('/payments/get-key');
      const keyId = keyRes.data.key;

      // 3. Create the order securely on backend (backend queries MongoDB for authoritative price)
      const orderRes = await apiClient.post('/payments/create-order', {
        bookingId: targetBookingId,
        bookingType,
      });

      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || 'Failed to create secure payment order');
      }

      const order = orderRes.data.order;

      // 4. Configure Razorpay Options
      const options = {
        key: keyId,
        amount: order.amount, // Authoritative order amount in paise from backend
        currency: order.currency,
        name: 'The Kasar Himalayan Heights',
        description: 'Payment for your booking',
        image: 'https://res.cloudinary.com/dvrju9hkr/image/upload/v1727780000/logo.png', // Or any valid logo URL
        order_id: order.id,
        handler: async function (response) {
          // 5. Success callback: Verify signature & amount with backend
          try {
            const verifyRes = await apiClient.post('/payments/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: targetBookingId,
              bookingType: bookingType,
            });

            if (verifyRes.data.success) {
              if (onSuccess) onSuccess(response, order);
            } else {
              throw new Error(verifyRes.data.message || 'Payment verification failed');
            }
          } catch (err) {
            console.error('Payment Verification Error:', err);
            if (onFailure) onFailure(err);
          }
        },
        prefill,
        notes: {
          ...notes,
          bookingId: targetBookingId,
          bookingType,
        },
        theme: {
          color: '#073125', // Kasar's brand dark green
        },
      };

      // 6. Open the Razorpay Popup
      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        console.error('Payment Failed:', response.error);
        if (onFailure) onFailure(response.error);
      });
      
      paymentObject.open();

    } catch (error) {
      console.error('Payment Initialization Error:', error);
      if (onFailure) onFailure(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return { initializePayment, isProcessing };
};
