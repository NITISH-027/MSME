-- MSME Growth OS - Supabase Database Schema
-- Run this SQL in your Supabase SQL editor to create all tables and seed with dummy data.

-- ============================================================
-- TABLE: inventory
-- Tracks raw materials and finished goods stock levels
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory (
  id            SERIAL PRIMARY KEY,
  item_name     TEXT NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  min_required  INTEGER NOT NULL DEFAULT 0,
  unit          TEXT NOT NULL
);

INSERT INTO inventory (item_name, current_stock, min_required, unit) VALUES
  ('White Fabric',         1200, 500,  'metres'),
  ('Black Dye',            80,   200,  'litres'),
  ('Polyester Stuffing',   950,  300,  'kg'),
  ('Cardboard Packaging',  40,   150,  'boxes'),
  ('Zipper',               2500, 1000, 'pieces'),
  ('Thread (White)',       600,  400,  'spools'),
  ('Thread (Black)',       150,  400,  'spools'),
  ('Plastic Eyes',         3000, 1500, 'pieces'),
  ('Hang Tags',            90,   500,  'pieces'),
  ('Bubble Wrap',          200,  300,  'rolls');

-- ============================================================
-- TABLE: machines
-- Factory machine details, efficiency and capacity
-- ============================================================
CREATE TABLE IF NOT EXISTS machines (
  id                 SERIAL PRIMARY KEY,
  name               TEXT NOT NULL,
  status             TEXT NOT NULL CHECK (status IN ('Running', 'Idle', 'Under Maintenance')),
  efficiency_percent INTEGER NOT NULL DEFAULT 0,
  max_capacity       INTEGER NOT NULL DEFAULT 0,
  limitations        TEXT
);

INSERT INTO machines (name, status, efficiency_percent, max_capacity, limitations) VALUES
  ('Sewing Machine A',    'Running',           88,  200, 'Motor needs servicing every 500 hours'),
  ('Cutting Machine',     'Running',           95,  500, 'Blade sharpening required weekly'),
  ('Embroidery Unit',     'Idle',              0,   150, 'Awaiting design file upload'),
  ('Packaging Machine',   'Running',           100, 300, 'At full capacity – bottleneck identified'),
  ('Washing Machine',     'Under Maintenance', 0,   400, 'Drum bearing replacement in progress'),
  ('Printing Press',      'Running',           72,  250, 'Ink cartridges running low'),
  ('Sewing Machine B',    'Running',           81,  200, 'Thread tension adjustment needed'),
  ('Quality Scanner',     'Idle',              0,   600, 'Awaiting operator assignment');

-- ============================================================
-- TABLE: orders
-- Active client orders with delivery tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id            SERIAL PRIMARY KEY,
  client        TEXT NOT NULL,
  product       TEXT NOT NULL,
  quantity      INTEGER NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('Pending', 'In Production', 'Ready to Ship', 'Delivered')),
  delivery_date DATE NOT NULL
);

INSERT INTO orders (client, product, quantity, status, delivery_date) VALUES
  ('Flipkart',       'Stuffed Penguin (Large)',      500,  'In Production',  '2026-03-15'),
  ('Amazon India',   'Stuffed Penguin (Small)',      1200, 'Pending',         '2026-03-22'),
  ('Myntra',         'Stuffed Polar Bear',           300,  'Ready to Ship',   '2026-03-10'),
  ('Meesho',         'Stuffed Elephant (Grey)',      800,  'In Production',   '2026-03-18'),
  ('FirstCry',       'Stuffed Bunny (White)',        450,  'Pending',         '2026-03-28'),
  ('Snapdeal',       'Stuffed Penguin (Large)',      200,  'Delivered',       '2026-03-05'),
  ('Reliance Retail','Plush Keychain Penguin',       2000, 'Pending',         '2026-04-01'),
  ('BigBasket Gifts','Stuffed Penguin Gift Set',     150,  'In Production',   '2026-03-20');

-- ============================================================
-- TABLE: trends
-- Market & social media trend tracking for R&D and innovation
-- ============================================================
CREATE TABLE IF NOT EXISTS trends (
  id                    SERIAL PRIMARY KEY,
  keyword               TEXT NOT NULL,
  search_spike_percent  INTEGER NOT NULL DEFAULT 0,
  recommended_action    TEXT NOT NULL
);

INSERT INTO trends (keyword, search_spike_percent, recommended_action) VALUES
  ('Penguin Reels',         400, 'Launch limited-edition Penguin plush series. Current stock of white & black materials can yield ~500 units. Expected margin: 40%.'),
  ('Eco-Friendly Toys',     280, 'Source organic cotton and natural dyes. Premium pricing (+25%) can increase margin. Promote sustainability certifications.'),
  ('Customised Gifts',      320, 'Add personalised name embroidery service. Requires embroidery unit activation. Upsell potential: ₹150 per unit.'),
  ('Festive Gifting 2026',  190, 'Pre-produce 1,000 gift sets for Diwali. Begin now to meet October demand spike.'),
  ('Miniature Collections', 230, 'Develop a 5-piece miniature animal set. Low material cost, high perceived value. Expected ROI: 60%.'),
  ('ASMR Unboxing',         175, 'Invest in premium packaging with tissue paper and ribbon. Improves brand recall and social sharing.'),
  ('Pet Lookalike Toys',    310, 'Offer custom pet-lookalike plush orders. Partner with Instagram pet influencers for promotions.'),
  ('AR Toy Integration',    150, 'Explore AR QR code on packaging linking to animated stories. Low-cost tech upgrade with high engagement value.');
