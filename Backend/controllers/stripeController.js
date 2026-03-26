import Stripe from 'stripe';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

export const createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user._id.toString(); 

    if (!plan || !['monthly', 'yearly'].includes(plan.toLowerCase())) {
      return res.status(400).json({ message: "Valid plan required (Monthly or Yearly)" });
    }

    const priceId = plan.toLowerCase() === 'yearly' 
      ? process.env.STRIPE_YEARLY_PRICE_ID || 'price_yearly_placeholder' 
      : process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly_placeholder';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/subscription`,
      metadata: {
        userId: userId,
        plan: plan.toLowerCase()
      }
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ message: 'Internal Server Error initiating checkout' });
  }
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const plan = session.metadata.plan;
        
        await User.findByIdAndUpdate(userId, { 
          subscription_status: 'active', 
          subscription_tier: plan,
          stripe_customer_id: session.customer 
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        await User.findOneAndUpdate(
          { stripe_customer_id: customerId },
          { subscription_status: 'canceled' }
        );
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        await User.findOneAndUpdate(
          { stripe_customer_id: customerId },
          { subscription_status: 'past_due' }
        );
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ message: 'Error processing webhook event' });
  }
};
