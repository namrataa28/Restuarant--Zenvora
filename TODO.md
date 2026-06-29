# Frontend completion checklist

## Phase 1 — Backend route inspection (required)
- [x] Inspect backend auth routes to confirm exact login/signup endpoints and expected request/response payloads
- [x] Inspect backend menu/category routes to confirm menu listing/details payloads and image fields
- [x] Inspect backend cart routes to confirm cart fetch/update/delete endpoints and schema
- [x] Inspect backend order routes to confirm checkout/order creation payload
- [x] Inspect backend booking routes to confirm booking form fields and creation endpoints


## Phase 2 — Frontend implementation
- [x] Add API client helper (axios instance) in `frontend/src/lib/api.js`

- [x] Fix `frontend/src/context/AppContext.jsx` to store/authenticate user + persist token
- [ ] Replace placeholder pages with full implementations:
  - [x] `frontend/src/pages/Home.jsx`
  - [x] `frontend/src/pages/Menu.jsx`
  - [x] `frontend/src/pages/MenuDetails.jsx`
  - [x] `frontend/src/pages/Cart.jsx`
  - [x] `frontend/src/pages/Checkout.jsx`

  - [x] `frontend/src/pages/BookTable.jsx`

  - [x] `frontend/src/pages/MyBooking.jsx`
  - [x] `frontend/src/pages/MyOrder.jsx`


  - [x] `frontend/src/pages/Login.jsx`
  - [x] `frontend/src/pages/Signup.jsx`
  - [x] `frontend/src/pages/About.jsx`
  - [x] `frontend/src/pages/Contact.jsx`

- [x] Improve `frontend/src/components/Navbar.jsx` (dynamic cart badge, logout behavior)


## Phase 3 — Verification
- [ ] Run `npm install` and `npm run dev` for frontend
- [ ] Smoke test key flows: signup/login, menu browsing, add to cart, checkout, booking, my pages

