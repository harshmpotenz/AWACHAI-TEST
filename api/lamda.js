// require('dotenv').config();
// const xmlrpc = require('xmlrpc');
// const axios = require("axios");

// const {
//     ODOO_URL,
//     ODOO_DB,
//     ODOO_USERNAME,
//     ODOO_PASSWORD,
// } = process.env;

// const PAYMENT_TERM_IMMEDIATE = 1;

// const productsList = [
//     // Jotform
//     { "Chaï Latte BIO 1kg": "ChaiLatteBIO1KG" },
//     { "Chaï Latte BIO 250g": "ChaiLatteBIO250G" },
//     { "Masala Chaï Garam 1kg": "GARAM1KG" },
//     { "Masala Chaï Garam 250g": "MASALA250G" },
//     { "Golden Latte Ayurvédique 1kg": "GOLDENBIO1KG" },
//     { "Golden Latte Ayurvédique 250g": "GOLDEN BIO 250g" },
//     { "1kg Hot Choc BIO 57%": "HOTCHOCBIO1KG" },
//     { "Matcha Premium BIO 100g": "MATCHABIO 100G" },
//     { "Matcha First Flush": "FIRSTFLUSHBIO100G" },
//     { "Cuillère à Chaï / Golden": "CUILLERE8G" },
//     { "Cuillère à Matcha": "CUILLERE1G" },

//     // Shopify - French - Deutsch
//     { "Chaï Latte 100% BIO - 1kg": "ChaiLatteBIO1KG" },
//     { "Chaï Latte 100% BIO - 250g": "ChaiLatteBIO250G" },
//     { "Golden Latte 100% BIO - 250g": "GOLDEN BIO 250g" },
//     { "Matcha Premium du Japon 100% BIO - 100g": "MATCHABIO 100G" },
//     { "Masala Chaï Garam - 250g": "MASALA250G" },
//     { "Cuillère de 8 g": "CUILLERE8G" },
//     { "Matcha First Flush 100% BIO - 100g": "FIRSTFLUSHBIO100G" },
//     { "Masala Chaï Garam - 1kg": "GARAM1KG" },
//     { "57% Hot Choc BIO - 1kg": "HOTCHOCBIO1KG" },
//     { "Cuillère de 1 g": "CUILLERE1G" },

//     // Shopify - Spanish
//     { "Chai Latte 100% ORGÁNICO - 1 kg": "ChaiLatteBIO1KG" },
//     { "Chai Latte 100% ORGÁNICO": "ChaiLatteBIO250G" },
//     { "Café con leche dorado 100% orgánico": "GOLDEN BIO 250g" },
//     { "Matcha Premium de Japón 100% ORGÁNICO": "MATCHABIO 100G" },
//     { "Chai garam masala": "MASALA250G" },
//     { "Cuchara de 8g": "CUILLERE8G" },
//     { "Matcha de primera calidad 100 % orgánico": "FIRSTFLUSHBIO100G" },
//     { "Masala Chai Garam - 1 kg": "GARAM1KG" },
//     { "Chocolate caliente BIO al 57 %": "HOTCHOCBIO1KG" },
//     { "1 g cuchara": "CUILLERE1G" },

//     // Shopify - English
//     { "Chaï Latte 100% Organic - 1kg": "ChaiLatteBIO1KG" },
//     { "Chaï Latte 100% Organic - 250g": "ChaiLatteBIO250G" },
//     { "Golden Latte 100% Organic": "GOLDEN BIO 250g" },
//     { "Japanese Organic Matcha": "MATCHABIO 100G" },
//     { "Masala Chaï Garam": "MASALA250G" },
//     { "Measuring spoon - 8g": "CUILLERE8G" },
//     { "Matcha First Flush 100% BIO - 100g": "FIRSTFLUSHBIO100G" },
//     { "Masala Chaï Garam - 1kg": "GARAM1KG" },
//     { "Organic Hot Choc 57% Cacao": "HOTCHOCBIO1KG" },
//     { "Matcha measuring spoon - 1g": "CUILLERE1G" }
// ];

// const accessories = [
//     "Cuillère à Chaï / Golden",
//     "Cuillère à Matcha",
//     "Measuring spoon - 8g",
//     "Matcha measuring spoon - 1g",
//     "Cuchara de 8g",
//     "1 g cuchara",
//     "Cuillère de 8 g",
//     "Cuillère de 1 g",
// ];


// function normalizeAddressField(value) {
//     return (value || '')
//         .toLowerCase()
//         .replace(/\s/g, '')                      // Remove all whitespace
//         .normalize('NFD')                        // Decompose accents
//         .replace(/[\u0300-\u036f]/g, '')         // Remove accents
//         .trim();
// }

// function isPickupPointOrder(order) {
//     if (!order || !order.billing_address || !order.shipping_address) {
//         throw new Error("Missing billing or shipping address in order payload");
//     }

//     const billing = order.billing_address;
//     const shipping = order.shipping_address;

//     const fieldsToCompare = ['address1', 'address2', 'city', 'zip', 'country', 'province', 'name'];

//     for (const field of fieldsToCompare) {
//         const billingVal = normalizeAddressField(billing[field]);
//         const shippingVal = normalizeAddressField(shipping[field]);

//         if (billingVal !== shippingVal) {
//             // A difference in any field implies it's likely a pickup point
//             return true;
//         }
//     }

//     // All normalized fields match → likely a Ship to Home order
//     return false;
// }

// async function downloadAndEncodePDF(url) {
//     try {
//         const response = await axios.get(url, { responseType: 'arraybuffer' });
//         const base64 = Buffer.from(response.data).toString('base64');
//         return base64;
//     } catch (error) {
//         throw new Error(`Failed to download or encode PDF: ${error.message}`);
//     }
// }

// function generateInvoiceURL(orderId, orderNumber) {
//     const multiplied = BigInt(orderId) * 7991n; // safer with BigInt
//     return `https://awachai.fr/apps/download-pdf/orders/3ea9e103aa9935475ef9/${multiplied}/${orderNumber}.pdf`;
// }


// // Odoo XML-RPC clients
// const common = xmlrpc.createClient({ url: `${ODOO_URL}/xmlrpc/2/common` });
// const object = xmlrpc.createClient({ url: `${ODOO_URL}/xmlrpc/2/object` });

// // Authenticate at startup
// async function authenticate() {
//     return new Promise((resolve, reject) => {
//         common.methodCall('authenticate', [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {}], (err, res) => {
//             if (err || !res) {
//                 console.error('Odoo auth failed:', err || 'Invalid credentials');
//                 return reject(err || new Error('Invalid credentials'));
//             }
//             console.log('Connected to Odoo, UID:', res);
//             resolve(res);
//         });
//     });
// }

// function getProductCode(productsList, productName) {
//     const found = productsList.find(product => Object.keys(product)[0] === productName);
//     return found ? found[productName] : null;
// }

// // Helper function to create or find a customer
// async function createOrFindCustomer(uid, customerName, customerEmail, contactNumber, billing) {
//     return new Promise((resolve, reject) => {
//         const countryName = billing.country || 'France';

//         const proceedWithCountryId = (countryId) => {
//             const findOrCreate = (stateId = null) => {
//                 // Step 1: Search for customer by email
//                 const searchDomain = [
//                     ['email', '=', customerEmail.toLowerCase()],
//                     ['phone', '=', contactNumber]

//                 ];

//                 object.methodCall('execute_kw', [
//                     ODOO_DB, uid, ODOO_PASSWORD,
//                     'res.partner', 'search',
//                     [searchDomain]
//                 ], (err, ids) => {
//                     if (err) return reject(err);

//                     const billingStreet = `${billing.address1 || ''}`;
//                     const billingStreet2 = [billing.address2, billing.province].filter(Boolean).join(', ');
//                     const billingCity = billing.city || '';
//                     const billingZip = billing.zip || '';

//                     // Step 2: If found, update address if changed
//                     if (ids.length > 0) {
//                         const existingCustomerId = ids[0];

//                         object.methodCall('execute_kw', [
//                             ODOO_DB, uid, ODOO_PASSWORD,
//                             'res.partner', 'read',
//                             [existingCustomerId, ['name', 'phone', 'street', 'street2', 'city', 'zip', 'country_id', 'state_id']]
//                         ], (err2, result) => {
//                             if (err2 || !result || !result.length) return reject(err2 || new Error("Failed to read customer"));
//                             const current = result[0];

//                             const currentStreet = current.street || '';
//                             const currentStreet2 = current.street2 || '';
//                             const currentCity = current.city || '';
//                             const currentZip = current.zip || '';
//                             const currentCountryId = current.country_id ? current.country_id[0] : null;
//                             const currentStateId = current.state_id ? current.state_id[0] : null;

//                             const hasChanges =
//                                 customerName !== current.name ||
//                                 contactNumber !== (current.phone || '') ||
//                                 currentStreet !== billingStreet ||
//                                 currentStreet2 !== billingStreet2 ||
//                                 currentCity !== billingCity ||
//                                 currentZip !== billingZip ||
//                                 currentCountryId !== countryId ||
//                                 currentStateId !== stateId;

//                             if (hasChanges) {
//                                 object.methodCall('execute_kw', [
//                                     ODOO_DB, uid, ODOO_PASSWORD,
//                                     'res.partner', 'write',
//                                     [[existingCustomerId], {
//                                         name: customerName,
//                                         phone: contactNumber,
//                                         street: billingStreet,
//                                         street2: billingStreet2,
//                                         city: billingCity,
//                                         zip: billingZip,
//                                         country_id: countryId,
//                                         state_id: stateId
//                                     }]
//                                 ], (err3) => {
//                                     if (err3) return reject(err3);
//                                     return resolve(existingCustomerId);
//                                 });
//                             } else {
//                                 return resolve(existingCustomerId); // No change needed
//                             }
//                         });
//                     } else {
//                         // Step 3: Create new customer
//                         object.methodCall('execute_kw', [
//                             ODOO_DB, uid, ODOO_PASSWORD,
//                             'res.partner', 'create',
//                             [{
//                                 name: customerName,
//                                 email: customerEmail.toLowerCase(),
//                                 phone: contactNumber,
//                                 street: billingStreet,
//                                 street2: billingStreet2,
//                                 city: billingCity,
//                                 zip: billingZip,
//                                 country_id: countryId,
//                                 state_id: stateId
//                             }]
//                         ], (err4, newId) => {
//                             if (err4) return reject(err4);
//                             resolve(newId);
//                         });
//                     }
//                 });
//             };

//             // Get state ID if province is provided
//             if (billing.province) {
//                 object.methodCall('execute_kw', [
//                     ODOO_DB, uid, ODOO_PASSWORD,
//                     'res.country.state', 'search',
//                     [[['name', '=', billing.province], ['country_id', '=', countryId]]]
//                 ], (err, stateIds) => {
//                     const stateId = (!err && stateIds.length) ? stateIds[0] : null;
//                     findOrCreate(stateId);
//                 });
//             } else {
//                 findOrCreate(null);
//             }
//         };

//         // Use fixed country ID for France
//         if (countryName.trim().toLowerCase() === 'france') {
//             proceedWithCountryId(75);
//         } else {
//             // Lookup other country IDs
//             object.methodCall('execute_kw', [
//                 ODOO_DB, uid, ODOO_PASSWORD,
//                 'res.country', 'search',
//                 [[['name', '=', countryName]]]
//             ], (err, countryIds) => {
//                 if (err || !countryIds.length) return reject(new Error('Country not found'));
//                 proceedWithCountryId(countryIds[0]);
//             });
//         }
//     });
// }

// async function createOrUpdateChildAddress(uid, parentId, address, type, customerName = '') {
//     return new Promise((resolve, reject) => {
//         const street = address.address1 || '';
//         const street2 = [address.address2, address.province].filter(Boolean).join(', ');
//         const city = address.city || '';
//         const zip = address.zip || '';
//         const countryName = address.country || 'France';

//         // Name pattern: "Customer Name (Invoice Address)" or "Customer Name (Delivery Address)"
//         // const typeLabel = type === 'invoice' ? 'Invoice Address' : 'Delivery Address';
//         // const childName = customerName ? `${customerName} (${typeLabel})` : typeLabel;
//         const childName = customerName;

//         const proceedWithCountryId = (countryId) => {
//             const handleStateId = (stateId) => {
//                 object.methodCall('execute_kw', [
//                     ODOO_DB, uid, ODOO_PASSWORD,
//                     'res.partner', 'search',
//                     [[['parent_id', '=', parentId], ['type', '=', type]]]
//                 ], (err, ids) => {
//                     if (err) return reject(err);

//                     const values = {
//                         parent_id: parentId,
//                         type,
//                         name: childName,
//                         street,
//                         street2,
//                         city,
//                         zip,
//                         country_id: countryId,
//                         state_id: stateId,
//                     };

//                     if (address.phone) values.phone = address.phone;
//                     if (address.email) values.email = address.email;
                    
//                     if (ids.length > 0) {
//                         const existingId = ids[0];
                    
//                         object.methodCall('execute_kw', [
//                             ODOO_DB, uid, ODOO_PASSWORD,
//                             'res.partner', 'read',
//                             [existingId, ['name', 'street', 'street2', 'city', 'zip', 'country_id', 'state_id', 'phone', 'email']]
//                         ], (err2, result) => {
//                             if (err2 || !result || !result.length) return reject(err2 || new Error("Failed to read child address"));
//                             const current = result[0];
                    
//                             const hasChanges =
//                                 childName !== current.name ||
//                                 street !== (current.street || '') ||
//                                 street2 !== (current.street2 || '') ||
//                                 city !== (current.city || '') ||
//                                 zip !== (current.zip || '') ||
//                                 countryId !== (current.country_id ? current.country_id[0] : null) ||
//                                 stateId !== (current.state_id ? current.state_id[0] : null) ||
//                                 (address.phone && address.phone !== (current.phone || '')) ||
//                                 (address.email && address.email !== (current.email || ''));
                    
//                             if (hasChanges) {
//                                 object.methodCall('execute_kw', [
//                                     ODOO_DB, uid, ODOO_PASSWORD,
//                                     'res.partner', 'write',
//                                     [[existingId], values]
//                                 ], (err3) => {
//                                     if (err3) return reject(err3);
//                                     resolve(existingId);
//                                 });
//                             } else {
//                                 resolve(existingId); // No update needed
//                             }
//                         });
//                     } else {
//                         object.methodCall('execute_kw', [
//                             ODOO_DB, uid, ODOO_PASSWORD,
//                             'res.partner', 'create',
//                             [values]
//                         ], (err3, newId) => {
//                             if (err3) return reject(err3);
//                             resolve(newId);
//                         });
//                     }
//                 });
//             };

//             if (address.province) {
//                 object.methodCall('execute_kw', [
//                     ODOO_DB, uid, ODOO_PASSWORD,
//                     'res.country.state', 'search',
//                     [[['name', '=', address.province], ['country_id', '=', countryId]]]
//                 ], (err, stateIds) => {
//                     const stateId = (!err && stateIds.length > 0) ? stateIds[0] : null;
//                     handleStateId(stateId);
//                 });
//             } else {
//                 handleStateId(null);
//             }
//         };

//         if (countryName.trim().toLowerCase() === 'france') {
//             proceedWithCountryId(75);
//         } else {
//             object.methodCall('execute_kw', [
//                 ODOO_DB, uid, ODOO_PASSWORD,
//                 'res.country', 'search',
//                 [[['name', '=', countryName]]]
//             ], (err, countryIds) => {
//                 if (err || !countryIds.length) return reject(new Error(`Country not found: ${countryName}`));
//                 proceedWithCountryId(countryIds[0]);
//             });
//         }
//     });
// }

// // Helper function to find or create/update a product
// async function findOrCreateOrUpdateProduct(uid, productName, price, productSku) {
//     const defaultCode = getProductCode(productsList, productName);

//     return new Promise((resolve, reject) => {
//         // Step 1: Search for product by name or SKU
//         object.methodCall('execute_kw', [
//             ODOO_DB, uid, ODOO_PASSWORD,
//             'product.product', 'search_read',
//             [[['name', '=', productName], ['default_code', '=', defaultCode]]],
//             { fields: ['id', 'list_price'], limit: 1 }
//         ], (err, result) => {
//             if (err) return reject(err);

//             if (result.length > 0) {
//                 const product = result[0];

//                 // Step 2: If price is different, update it
//                 if (parseFloat(product.list_price) !== parseFloat(price)) {
//                     object.methodCall('execute_kw', [
//                         ODOO_DB, uid, ODOO_PASSWORD,
//                         'product.product', 'write',
//                         [[product.id], { list_price: price }]
//                     ], (updateErr) => {
//                         if (updateErr) return reject(updateErr);
//                         console.log(`Updated price for product '${productName}' to ${price}`);
//                         resolve(product.id);
//                     });
//                 } else {
//                     // Price is the same, return as is
//                     resolve(product.id);
//                 }
//             } else {
//                 // Step 3: Product not found, create it
//                 object.methodCall('execute_kw', [
//                     ODOO_DB, uid, ODOO_PASSWORD,
//                     'product.product', 'create',
//                     [{
//                         name: productName,
//                         list_price: price,
//                         default_code: defaultCode,
//                         type: 'consu'
//                     }]
//                 ], (createErr, newId) => {
//                     if (createErr) return reject(createErr);
//                     console.log(`Created new product '${productName}' with price ${price}`);
//                     resolve(newId);
//                 });
//             }
//         });
//     });
// }

// async function createSaleOrder(uid, customerId, orderLines, note, shopifyId, shopifyOrderNumber, invoiceId, shippingId, carrierService) {
//     return new Promise((resolve, reject) => {
//         object.methodCall('execute_kw', [
//             ODOO_DB, uid, ODOO_PASSWORD,
//             'sale.order', 'create',
//             [{
//                 partner_id: customerId,
//                 partner_invoice_id: invoiceId,
//                 partner_shipping_id: shippingId,
//                 order_line: orderLines,
//                 note: note,
//                 payment_term_id: PAYMENT_TERM_IMMEDIATE,
//                 x_studio_order_source: "B2C",
//                 x_studio_source_order_id_1: `${shopifyId}`,
//                 x_studio_source_order_number: `${shopifyOrderNumber}`,
//                 // x_studio_carrier_service: carrierService,
//                 x_studio_carrier_service_selection: carrierService,
//                 x_studio_fulfillment_status: "Unfulfilled",
//             }]
//         ], (err, id) => {
//             if (err) return reject(err);
//             resolve(id);
//         });
//     });
// }

// async function attachInvoicePDFToSaleOrder(uid, saleOrderId, base64PDF, fileName = 'invoice.pdf') {
//     return new Promise((resolve, reject) => {
//         object.methodCall('execute_kw', [
//             ODOO_DB, uid, ODOO_PASSWORD,
//             'ir.attachment', 'create',
//             [{
//                 name: fileName,
//                 datas: base64PDF,
//                 res_model: 'sale.order',
//                 res_id: saleOrderId,
//                 type: 'binary',
//                 mimetype: 'application/pdf',
//             }]
//         ], (err, attachmentId) => {
//             if (err) return reject(new Error(`Failed to attach PDF: ${err.faultString || err.message}`));
//             console.log(`✅ Attached PDF to Sale Order ${saleOrderId} with Attachment ID ${attachmentId}`);
//             resolve(attachmentId);
//         });
//     });
// }

// async function saleOrderExists(uid, shopifyOrderId) {
//     return new Promise((resolve, reject) => {
//         object.methodCall('execute_kw', [
//             ODOO_DB, uid, ODOO_PASSWORD,
//             'sale.order', 'search',
//             [[['x_studio_source_order_id_1', '=', `${shopifyOrderId}`]]]
//         ], (err, ids) => {
//             if (err) return reject(err);
//             resolve(ids.length > 0);
//         });
//     });
// }

// // Helper function to confirm a sale order
// // async function confirmSaleOrder(uid, saleOrderId) {
// //     return new Promise((resolve, reject) => {
// //         object.methodCall('execute_kw', [
// //             ODOO_DB, uid, ODOO_PASSWORD,
// //             'sale.order', 'action_confirm',
// //             [saleOrderId]
// //         ], (err, result) => {
// //             if (err) return reject(err);
// //             resolve(result);
// //         });
// //     });
// // }

// async function confirmSaleOrderAndCreateInvoice(uid, saleOrderId) {
//     return new Promise((resolve, reject) => {
//         console.log(`[Step 1/6] Confirming Sale Order: ${saleOrderId}`);

//         // Step 1: Confirm the Sale Order
//         object.methodCall('execute_kw', [ODOO_DB, uid, ODOO_PASSWORD, 'sale.order', 'action_confirm', [[saleOrderId]]], (err) => {
//             if (err) return reject(new Error(`Failed to confirm SO ${saleOrderId}: ${err.faultString || err.message}`));
//             console.log(`[Step 2/6] Sale Order confirmed. Creating invoice...`);

//             // Step 2 & 3: Create and execute the invoice wizard
//             object.methodCall('execute_kw', [ODOO_DB, uid, ODOO_PASSWORD, 'sale.advance.payment.inv', 'create', [[{ advance_payment_method: 'delivered' }]], { context: { active_ids: [saleOrderId] } }], (err2, wizardId) => {
//                 if (err2) return reject(new Error(`Failed to create invoice wizard: ${err2.faultString || err2.message}`));

//                 object.methodCall('execute_kw', [ODOO_DB, uid, ODOO_PASSWORD, 'sale.advance.payment.inv', 'create_invoices', [wizardId]], (err3) => {
//                     if (err3) return reject(new Error(`Failed to execute invoice wizard: ${err3.faultString || err3.message}`));

//                     // Step 4: Fetch the created invoice ID
//                     object.methodCall('execute_kw', [ODOO_DB, uid, ODOO_PASSWORD, 'sale.order', 'read', [[saleOrderId], ['invoice_ids']]], (err4, soData) => {
//                         if (err4 || !soData || !soData[0]?.invoice_ids?.length) return reject(new Error(`Invoice not found after creation.`));
//                         const invoiceId = soData[0].invoice_ids[0];
//                         console.log(`[Step 4/6] Invoice ${invoiceId} created. Posting invoice...`);

//                         // Step 5: Post the invoice (This makes it 'Posted' but 'Not Paid')
//                         object.methodCall('execute_kw', [ODOO_DB, uid, ODOO_PASSWORD, 'account.move', 'action_post', [[invoiceId]]], (err5) => {
//                             if (err5) return reject(new Error(`Failed to post invoice ${invoiceId}: ${err5.faultString || err5.message}`));
//                             console.log(`[Step 5/6] Invoice posted. Registering payment...`);

//                             // ✅ START: REPLACEMENT LOGIC
//                             // Step 6: Create the payment registration wizard. This is the correct way.
//                             object.methodCall('execute_kw', [
//                                 ODOO_DB, uid, ODOO_PASSWORD,
//                                 'account.payment.register', // Use the payment wizard model
//                                 'create',
//                                 [[{
//                                     journal_id: 13, // Your 'Bank' journal ID
//                                 }]],
//                                 // This context is CRUCIAL: it links the wizard to the invoice you want to pay.
//                                 { context: { active_model: 'account.move', active_ids: [invoiceId] } }
//                             ], (err6, paymentWizardId) => {
//                                 if (err6) return reject(new Error(`Failed to create payment wizard: ${err6.faultString || err6.message}`));
//                                 console.log(`[Step 6/6] Payment wizard ${paymentWizardId} created. Executing...`);

//                                 // Step 7: Execute the wizard to create and post the payment.
//                                 // This single action marks the invoice as "Paid".
//                                 object.methodCall('execute_kw', [
//                                     ODOO_DB, uid, ODOO_PASSWORD,
//                                     'account.payment.register',
//                                     'action_create_payments', // The wizard's action method
//                                     [paymentWizardId]
//                                 ], (err7) => {
//                                     if (err7) return reject(new Error(`Failed to execute payment wizard: ${err7.faultString || err7.message}`));
//                                     console.log(`✅ Invoice ${invoiceId} marked as paid successfully.`);

//                                     // You can now proceed with the email step if you wish
//                                     resolve({
//                                         success: true,
//                                         invoiceId,
//                                         message: 'Confirmed, invoiced, and paid successfully.'
//                                     });
//                                 });
//                             });
//                             // ✅ END: REPLACEMENT LOGIC
//                         });
//                     });
//                 });
//             });
//         });
//     });
// }

// // Main Lambda handler
// exports.handler = async (event) => {
//     try {
//         const uid = await authenticate();
//         const orderData = JSON.parse(event.body);

//         const shopifyOrderId = `${orderData.id}`;
//         const shopifyOrderNumber = orderData.order_number;

//         const taxId20 = 45;
//         const taxId5_5 = 48;

//         const isPickup = isPickupPointOrder(orderData);
        
//         // Standard
//         // DPD - SHIP TO ADDRESS
//         // EXTENDED EUROPE + UK
//         // FEDEX EUROPE SHIPPING
//         const shippingCode = orderData?.shipping_lines?.[0]?.code?.toLowerCase() || "";
//         console.log(`Shipping Code: ${shippingCode}`);
//         const shippingCountry = orderData?.shipping_address?.country?.toLowerCase() || "";

//         let carrierService = "DPD - Ship To Address"; // Default fallback

//         if (shippingCode === "fedex europe shipping" || shippingCode === "extended europe + uk") {
//             carrierService = "FedEx Europe Shipping";
//         }
//         else if (shippingCode === "dpd - ship to address") {
//             carrierService = "DPD - Ship To Address";
//         }
//         else if (shippingCode === "standard") {
//             carrierService = "Mondial Relay - Pickup";
//         }
//         // else if (shippingCountry !== "france") {
//         //     // If country is not France and code is unknown, assume FedEx
//         //     carrierService = "FedEx Europe Shipping";
//         // }
//         else {
//             carrierService = "Undetermined";
//         }

//         console.log(`Carrier Service: ${carrierService}`);
        

//         console.log(`Shopify Order ID: ${shopifyOrderId}`);
//         console.log(`Shopify Order Number: ${shopifyOrderNumber}`);

//         const alreadyExists = await saleOrderExists(uid, shopifyOrderId);
//         if (alreadyExists) {
//             console.log(`Order already exists in Odoo: ${shopifyOrderId}`);
//             return {
//                 statusCode: 200,
//                 body: JSON.stringify({
//                     success: false,
//                     message: `Duplicate order ignored (Shopify ID: ${shopifyOrderId})`
//                 }),
//             };
//         }

//         const customerNote = `Shopify Order #${shopifyOrderNumber}`;

//         // Extract the customer
//         const customer = {
//             name: `${orderData.customer.first_name || ''} ${orderData.customer.last_name || ''}`,
//             email: orderData.customer.email || orderData.email,
//             contactNumber: orderData.customer.phone || orderData.phone || orderData.billing_address.phone || orderData.shipping_address.phone || null,
//             defaultAddress: {
//                 address1: orderData.customer.default_address.address1,
//                 address2: orderData.customer.default_address.address2,
//                 city: orderData.customer.default_address.city,
//                 province: orderData.customer.default_address.province,
//                 country: orderData.customer.default_address.country,
//                 zip: orderData.customer.default_address.zip,
//                 phone: orderData.customer.default_address.phone || orderData.customer.phone || orderData.phone || orderData.billing_address.phone || orderData.shipping_address.phone || null,
//             }
//         };


//         // Extract the billing address
//         const billingAddress = {
//             firstName: orderData.billing_address.first_name,
//             lastName: orderData.billing_address.last_name,
//             address1: orderData.billing_address.address1,
//             address2: orderData.billing_address.address2,
//             city: orderData.billing_address.city,
//             province: orderData.billing_address.province,
//             country: orderData.billing_address.country,
//             zip: orderData.billing_address.zip,
//             email: customer.email,
//             phone: orderData.billing_address.phone || customer.phone,
//         };

        
//         let deliveryAddress;
//         let deliveryFullName;
//         let deliveryName;

//         if (carrierService === "Mondial Relay - Pickup") {
//             deliveryName = customer.name;
//             deliveryFullName = `${orderData.shipping_address.first_name || ''} ${orderData.shipping_address.last_name || ''}`.trim();
//             deliveryAddress = {
//                 firstName: orderData.shipping_address.first_name,
//                 lastName: orderData.shipping_address.last_name,
//                 address1: `${deliveryFullName} ${orderData.shipping_address.address1}`.trim(),
//                 address2: orderData.shipping_address.address2,
//                 city: orderData.shipping_address.city,
//                 province: orderData.shipping_address.province,
//                 country: orderData.shipping_address.country,
//                 zip: orderData.shipping_address.zip,
//                 email: customer.email,
//                 phone: orderData.shipping_address.phone || customer.phone,
//             };
//         }
//         else {
//             deliveryName = `${orderData.shipping_address.first_name || ''} ${orderData.shipping_address.last_name || ''}`.trim();
//             deliveryAddress = {
//                 firstName: orderData.shipping_address.first_name,
//                 lastName: orderData.shipping_address.last_name,
//                 address1: orderData.shipping_address.address1,
//                 address2: orderData.shipping_address.address2,
//                 city: orderData.shipping_address.city,
//                 province: orderData.shipping_address.province,
//                 country: orderData.shipping_address.country,
//                 zip: orderData.shipping_address.zip,
//                 email: customer.email,
//                 phone: orderData.shipping_address.phone || customer.phone,
//             };
    
//         } 

//         console.log(`Customer Details: ${customer.name}, ${customer.email}, ${customer.contactNumber}`);

        

//         // Extract product information
//         const products = orderData.line_items.map(item => ({
//             sku: item.sku,
//             name: item.name,
//             quantity: item.quantity,
//             priceUnit: item.price,
//         }));

//         if (products.length === 0) {
//             throw new Error('No products found in the form submission');
//         }

//         const customerId = await createOrFindCustomer(uid, customer.name, customer.email, customer.contactNumber, customer.defaultAddress);
//         // const taxId_0 = await getTaxIdByName(uid, '0% EXEMPT G'); // 50
//         const invoiceName = `${billingAddress.firstName || ''} ${billingAddress.lastName || ''}`.trim();
//         // const deliveryName = customer.name || `${deliveryAddress.firstName || ''} ${deliveryAddress.lastName || ''}`.trim();
//         const invoiceAddressId = await createOrUpdateChildAddress(uid, customerId, billingAddress, 'invoice', invoiceName);
//         const shippingAddressId = await createOrUpdateChildAddress(uid, customerId, deliveryAddress, 'delivery', deliveryName);

//         const odooOrderLines = [];
//         for (const product of products) {
//             const productId = await findOrCreateOrUpdateProduct(uid, product.name, product.priceUnit, product.sku);

//             const isAccessory = accessories.includes(product.name);
//             const taxId = isAccessory ? taxId20 : taxId5_5;

//             odooOrderLines.push([
//                 0, 0, {
//                     product_id: productId,
//                     name: product.name,
//                     product_uom_qty: product.quantity,
//                     price_unit: product.priceUnit,
//                     tax_ids: [[6, 0, [taxId]]],
//                 }
//             ]);
//         }

//         const saleOrderId = await createSaleOrder(uid, customerId, odooOrderLines, customerNote, shopifyOrderId, shopifyOrderNumber, invoiceAddressId, shippingAddressId, carrierService);
//         // await confirmSaleOrder(uid, saleOrderId);
//         // Skip confirmation only for Mondial Relay
        
//         let result;
//         if (carrierService !== "Mondial Relay - Pickup" && carrierService !== "Undetermined") {
//             result = await confirmSaleOrderAndCreateInvoice(uid, saleOrderId);
//         } else {
//             console.log("Skipping order confirmation for Mondial Relay - Pickup or Undetermined carrier service");
//         }
        
//         // const result = await confirmSaleOrderAndCreateInvoice(uid, saleOrderId);
//         const invoiceUrl = generateInvoiceURL(shopifyOrderId, shopifyOrderNumber);
//         console.log(`Fetching invoice from: ${invoiceUrl}`);
//         const base64Invoice = await downloadAndEncodePDF(invoiceUrl);
//         await attachInvoicePDFToSaleOrder(uid, saleOrderId, base64Invoice, `invoice-${shopifyOrderNumber}.pdf`);

//         return {
//             statusCode: 200,
//             body: JSON.stringify({
//                 success: true,
//                 message: 'Order processed successfully - confirmed, invoiced, paid, and emailed',
//                 saleOrderId,
//                 invoiceId: result.invoiceId,
//                 productCount: products.length,
//                 emailSent: result.emailSent
//             }),
//         };

//     } catch (error) {
//         console.error('Error processing webhook:', error.message);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({
//                 success: false,
//                 message: error.message
//             }),
//         };
//     }
// };

// /api/shopify-webhook.js
require("dotenv").config();
const xmlrpc = require("xmlrpc");
const axios = require("axios");

const {
  ODOO_URL,
  ODOO_DB,
  ODOO_USERNAME,
  ODOO_PASSWORD,
} = process.env;

const PAYMENT_TERM_IMMEDIATE = 1;

// If Shopify payloads can be large, bump size limit:
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "2mb", // increase if needed
    },
  },
};

// -------------------- your existing constants/helpers here --------------------
// productsList, accessories, normalizeAddressField, isPickupPointOrder,
// downloadAndEncodePDF, generateInvoiceURL, etc...

// Odoo XML-RPC clients
const common = xmlrpc.createClient({ url: `${ODOO_URL}/xmlrpc/2/common` });
const object = xmlrpc.createClient({ url: `${ODOO_URL}/xmlrpc/2/object` });

async function authenticate() {
  return new Promise((resolve, reject) => {
    common.methodCall(
      "authenticate",
      [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {}],
      (err, res) => {
        if (err || !res) return reject(err || new Error("Invalid credentials"));
        resolve(res);
      }
    );
  });
}

// -------------------- keep your existing helper functions --------------------


export default async function handler(req, res) {
  try {
    // Shopify will POST webhooks
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    const uid = await authenticate();

    // ✅ Vercel gives parsed JSON if content-type is application/json
    const orderData = req.body;

    if (!orderData || !orderData.id) {
      return res.status(400).json({ success: false, message: "Invalid Shopify payload" });
    }

    const shopifyOrderId = `${orderData.id}`;
    const shopifyOrderNumber = orderData.order_number;

    const taxId20 = 45;
    const taxId5_5 = 48;

    const shippingCode = orderData?.shipping_lines?.[0]?.code?.toLowerCase() || "";
    const shippingCountry = orderData?.shipping_address?.country?.toLowerCase() || "";

    let carrierService = "DPD - Ship To Address";
    if (shippingCode === "fedex europe shipping" || shippingCode === "extended europe + uk") {
      carrierService = "FedEx Europe Shipping";
    } else if (shippingCode === "dpd - ship to address") {
      carrierService = "DPD - Ship To Address";
    } else if (shippingCode === "standard") {
      carrierService = "Mondial Relay - Pickup";
    } else {
      carrierService = "Undetermined";
    }

    const alreadyExists = await saleOrderExists(uid, shopifyOrderId);
    if (alreadyExists) {
      return res.status(200).json({
        success: false,
        message: `Duplicate order ignored (Shopify ID: ${shopifyOrderId})`,
      });
    }

    const customerNote = `Shopify Order #${shopifyOrderNumber}`;

    // --- build customer/billing/shipping like you already do ---
    const customer = {
      name: `${orderData.customer.first_name || ""} ${orderData.customer.last_name || ""}`.trim(),
      email: orderData.customer.email || orderData.email,
      contactNumber:
        orderData.customer.phone ||
        orderData.phone ||
        orderData.billing_address?.phone ||
        orderData.shipping_address?.phone ||
        null,
      defaultAddress: {
        address1: orderData.customer.default_address.address1,
        address2: orderData.customer.default_address.address2,
        city: orderData.customer.default_address.city,
        province: orderData.customer.default_address.province,
        country: orderData.customer.default_address.country,
        zip: orderData.customer.default_address.zip,
        phone:
          orderData.customer.default_address.phone ||
          orderData.customer.phone ||
          orderData.phone ||
          orderData.billing_address?.phone ||
          orderData.shipping_address?.phone ||
          null,
      },
    };

    const billingAddress = {
      firstName: orderData.billing_address.first_name,
      lastName: orderData.billing_address.last_name,
      address1: orderData.billing_address.address1,
      address2: orderData.billing_address.address2,
      city: orderData.billing_address.city,
      province: orderData.billing_address.province,
      country: orderData.billing_address.country,
      zip: orderData.billing_address.zip,
      email: customer.email,
      phone: orderData.billing_address.phone || customer.phone,
    };

    let deliveryAddress;
    let deliveryName;

    if (carrierService === "Mondial Relay - Pickup") {
      const deliveryFullName = `${orderData.shipping_address.first_name || ""} ${orderData.shipping_address.last_name || ""}`.trim();
      deliveryName = customer.name;

      deliveryAddress = {
        firstName: orderData.shipping_address.first_name,
        lastName: orderData.shipping_address.last_name,
        address1: `${deliveryFullName} ${orderData.shipping_address.address1}`.trim(),
        address2: orderData.shipping_address.address2,
        city: orderData.shipping_address.city,
        province: orderData.shipping_address.province,
        country: orderData.shipping_address.country,
        zip: orderData.shipping_address.zip,
        email: customer.email,
        phone: orderData.shipping_address.phone || customer.phone,
      };
    } else {
      deliveryName = `${orderData.shipping_address.first_name || ""} ${orderData.shipping_address.last_name || ""}`.trim();

      deliveryAddress = {
        firstName: orderData.shipping_address.first_name,
        lastName: orderData.shipping_address.last_name,
        address1: orderData.shipping_address.address1,
        address2: orderData.shipping_address.address2,
        city: orderData.shipping_address.city,
        province: orderData.shipping_address.province,
        country: orderData.shipping_address.country,
        zip: orderData.shipping_address.zip,
        email: customer.email,
        phone: orderData.shipping_address.phone || customer.phone,
      };
    }

    const products = (orderData.line_items || []).map((item) => ({
      sku: item.sku,
      name: item.name,
      quantity: item.quantity,
      priceUnit: item.price,
    }));

    if (!products.length) {
      return res.status(400).json({ success: false, message: "No products found" });
    }

    const customerId = await createOrFindCustomer(
      uid,
      customer.name,
      customer.email,
      customer.contactNumber,
      customer.defaultAddress
    );

    const invoiceName = `${billingAddress.firstName || ""} ${billingAddress.lastName || ""}`.trim();

    const invoiceAddressId = await createOrUpdateChildAddress(
      uid,
      customerId,
      billingAddress,
      "invoice",
      invoiceName
    );

    const shippingAddressId = await createOrUpdateChildAddress(
      uid,
      customerId,
      deliveryAddress,
      "delivery",
      deliveryName
    );

    const odooOrderLines = [];
    for (const product of products) {
      const productId = await findOrCreateOrUpdateProduct(uid, product.name, product.priceUnit, product.sku);

      const isAccessory = accessories.includes(product.name);
      const taxId = isAccessory ? taxId20 : taxId5_5;

      odooOrderLines.push([
        0, 0,
        {
          product_id: productId,
          name: product.name,
          product_uom_qty: product.quantity,
          price_unit: product.priceUnit,
          tax_ids: [[6, 0, [taxId]]],
        },
      ]);
    }

    const saleOrderId = await createSaleOrder(
      uid,
      customerId,
      odooOrderLines,
      customerNote,
      shopifyOrderId,
      shopifyOrderNumber,
      invoiceAddressId,
      shippingAddressId,
      carrierService
    );

    // ✅ FIX: result can be null if you skip confirmation
    let result = null;
    if (carrierService !== "Mondial Relay - Pickup" && carrierService !== "Undetermined") {
      result = await confirmSaleOrderAndCreateInvoice(uid, saleOrderId);
    }

    const invoiceUrl = generateInvoiceURL(shopifyOrderId, shopifyOrderNumber);
    const base64Invoice = await downloadAndEncodePDF(invoiceUrl);
    await attachInvoicePDFToSaleOrder(uid, saleOrderId, base64Invoice, `invoice-${shopifyOrderNumber}.pdf`);

    return res.status(200).json({
      success: true,
      message: "Order processed successfully",
      saleOrderId,
      invoiceId: result?.invoiceId || null,
      productCount: products.length,
      emailSent: result?.emailSent || false,
      carrierService,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}