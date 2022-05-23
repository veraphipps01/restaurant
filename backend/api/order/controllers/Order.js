'use strict';
/**
 * Order.js controller
 *
 * @description: A set of functions called "actions" for managing `Order`.
 */
// note that this needs to be a "private" key from STRIPE
const stripe = require('stripe')(
  'sk_test_51L0ya6Erd04QM8YBym4vwykNwtcSV0TVhSpSyHZssxu4hLaOL7eFJ6zQKqH8FH4u6evtYXWszPz9RGKTUrqMhZK300hMCo6iqw'
);
module.exports = {
  /**
   * Create a/an order record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    
    const { address, address_line_2, amount, dishes, token, city, state, zip, restaurant_id } = JSON.parse(ctx.request.body);
      
    const stripeAmount = Math.floor(amount * 100);
    // charge on stripe
    const charge = await stripe.charges.create({
      // Transform cents to dollars.
      amount: stripeAmount,
      currency: 'usd',
      description: `Order ${new Date()} by ${ctx.state.user._id}`,
      source: token,
    });

    // Register the order in the database
    const order = await strapi.services.orders.add({
      user: ctx.state.user._id,
      address,
      address_line_2,
      amount: stripeAmount,
      dishes,
      city,
      state,
      zip,
      restaurant: restaurant_id,
      charge_id: charge.id
    });

    return order;
  },

  
};
