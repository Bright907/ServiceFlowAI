const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const DB_PATH = path.join(__dirname, 'db.json');

function loadDB(){
  try{
    return JSON.parse(fs.readFileSync(DB_PATH,'utf8'));
  }catch(e){
    return {tenants:[], leads:[]};
  }
}

function saveDB(db){
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function makeId(){
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

const app = express();
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/public', express.static(path.join(__dirname,'public')));

// Stripe setup (reads keys from environment)
let stripe = null;
if(process.env.STRIPE_SECRET_KEY){
  try{
    const Stripe = require('stripe');
    stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    console.log('Stripe initialized');
  }catch(e){
    console.warn('Stripe module error', e.message);
  }
} else {
  console.log('Stripe not configured — set STRIPE_SECRET_KEY to enable billing');
}

// Landing
app.get('/', (req,res)=>{
  res.render('index');
});

// Signup
app.get('/signup', (req,res)=>{
  res.render('signup');
});

app.post('/signup', (req,res)=>{
  const {businessName, email, trade, basePrice, perUnit, travelFee} = req.body;
  const db = loadDB();
  const id = makeId();
  const tenant = {
    id,
    businessName: businessName || 'My Service',
    email,
    trade,
    pricing: {
      basePrice: Number(basePrice) || 100,
      perUnit: Number(perUnit) || 50,
      travelFee: Number(travelFee) || 10
    },
    services: [],
    subscription: { status: 'inactive', subscriptionId: null }
  };
  // Add some default services per trade
  if(trade === 'Plumber') tenant.services = [
    {id:'leak', name:'Leak Repair', unitName:'hours', defaultUnits:2},
    {id:'pipe', name:'Pipe Replacement', unitName:'feet', defaultUnits:20},
    {id:'water', name:'Water Heater Install', unitName:'units', defaultUnits:1}
  ];
  else if(trade === 'HVAC') tenant.services = [
    {id:'repair', name:'HVAC Repair', unitName:'hours', defaultUnits:2},
    {id:'install', name:'System Install', unitName:'tons', defaultUnits:3},
    {id:'maint', name:'Maintenance Visit', unitName:'visits', defaultUnits:1}
  ];
  else if(trade === 'Roofer') tenant.services = [
    {id:'shingles', name:'Shingle Repair', unitName:'sqft', defaultUnits:100},
    {id:'replace', name:'Roof Replacement', unitName:'sqft', defaultUnits:1200},
    {id:'inspection', name:'Roof Inspection', unitName:'visits', defaultUnits:1}
  ];

  db.tenants.push(tenant);
  saveDB(db);
  res.redirect('/dashboard/' + id);
});

// Dashboard
app.get('/dashboard/:id', (req,res)=>{
  const id = req.params.id;
  const db = loadDB();
  const tenant = db.tenants.find(t=>t.id===id);
  if(!tenant) return res.status(404).send('Tenant not found');
  // get leads for tenant
  const leads = db.leads.filter(l=>l.tenantId === id).reverse();
  res.render('dashboard',{tenant, leads});
});

app.post('/api/tenant/:id', (req,res)=>{
  const id = req.params.id;
  const db = loadDB();
  const tenant = db.tenants.find(t=>t.id===id);
  if(!tenant) return res.status(404).json({error:'Tenant not found'});
  const {businessName, basePrice, perUnit, travelFee} = req.body;
  tenant.businessName = businessName || tenant.businessName;
  tenant.pricing.basePrice = Number(basePrice) || tenant.pricing.basePrice;
  tenant.pricing.perUnit = Number(perUnit) || tenant.pricing.perUnit;
  tenant.pricing.travelFee = Number(travelFee) || tenant.pricing.travelFee;
  saveDB(db);
  res.json({ok:true, tenant});
});

// API: get leads
app.get('/api/leads/:tenantId', (req,res)=>{
  const tenantId = req.params.tenantId;
  const db = loadDB();
  const leads = db.leads.filter(l=>l.tenantId === tenantId).reverse();
  res.json({leads});
});

// Stripe: create Checkout Session
app.post('/create-checkout-session', async (req,res)=>{
  if(!stripe) return res.status(500).json({error:'Stripe not configured'});
  const {tenantId} = req.body;
  const db = loadDB();
  const tenant = db.tenants.find(t=>t.id===tenantId);
  if(!tenant) return res.status(404).json({error:'Tenant not found'});

  try{
    const host = req.protocol + '://' + req.get('host');
    // For prototype: single monthly subscription amount ($49.00)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `${tenant.businessName} - ServiceFlowAI subscription (one-time prototype)` },
          unit_amount: 4900
        },
        quantity: 1
      }],
      success_url: host + '/dashboard/' + tenantId + '?checkout=success',
      cancel_url: host + '/dashboard/' + tenantId + '?checkout=cancel',
      metadata: { tenantId }
    });

    res.json({url: session.url});
  }catch(err){
    console.error('Stripe create session error', err);
    res.status(500).json({error:err.message});
  }
});

// Stripe webhook endpoint — uses raw body for signature verification
app.post('/stripe-webhook', bodyParser.raw({type: 'application/json'}), (req,res)=>{
  if(!stripe){
    console.warn('Received webhook but Stripe not configured');
    return res.status(400).send('Stripe not configured');
  }
  const sig = req.headers['stripe-signature'];
  let event;
  if(process.env.STRIPE_WEBHOOK_SECRET){
    try{
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }catch(err){
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }else{
    try{
      event = JSON.parse(req.body.toString());
    }catch(e){
      console.error('Invalid webhook JSON', e.message);
      return res.status(400).send('Invalid payload');
    }
  }

  // Handle the event types we care about
  if(event.type === 'checkout.session.completed'){
    const session = event.data.object;
    const tenantId = session.metadata && session.metadata.tenantId;
    if(tenantId){
      const db = loadDB();
      const tenant = db.tenants.find(t=>t.id===tenantId);
      if(tenant){
        tenant.subscription = tenant.subscription || {};
        tenant.subscription.status = 'active';
        tenant.subscription.checkoutSessionId = session.id;
        saveDB(db);
        console.log('Marked tenant', tenantId, 'as active subscription');
      }
    }
  }

  res.json({received: true});
});

// Embed script that writes an iframe for the widget
app.get('/embed.js', (req,res)=>{
  const tenant = req.query.tenant;
  const host = req.protocol + '://' + req.get('host');
  res.set('Content-Type','application/javascript');
  // simple script that injects iframe
  const src = host + '/widget/' + encodeURIComponent(tenant);
  const js = `(function(){
    var w = document.currentScript.getAttribute('data-width') || '100%';
    var h = document.currentScript.getAttribute('data-height') || '520px';
    var container = document.createElement('div');
    var iframe = document.createElement('iframe');
    iframe.src = '${src}';
    iframe.style.width = w;
    iframe.style.height = h;
    iframe.style.border = '1px solid #ddd';
    iframe.style.borderRadius = '6px';
    container.appendChild(iframe);
    document.currentScript.parentNode.insertBefore(container, document.currentScript);
  })();`;
  res.send(js);
});

// Widget (iframe content)
app.get('/widget/:tenantId', (req,res)=>{
  const tenantId = req.params.tenantId;
  const db = loadDB();
  const tenant = db.tenants.find(t=>t.id===tenantId);
  if(!tenant) return res.status(404).send('Widget tenant not found');
  res.render('widget_embed',{tenant});
});

// Lead capture
app.post('/api/leads/:tenantId', (req,res)=>{
  const tenantId = req.params.tenantId;
  const {name,email,phone,address,service,units,estimate,message} = req.body;
  const db = loadDB();
  const tenant = db.tenants.find(t=>t.id===tenantId);
  if(!tenant) return res.status(404).json({error:'Tenant not found'});
  const lead = {
    id: makeId(),
    tenantId,
    name,
    email,
    phone,
    address,
    service,
    units,
    estimate: Number(estimate),
    message,
    createdAt: new Date().toISOString()
  };
  db.leads.push(lead);
  saveDB(db);
  res.json({ok:true, lead});
});

// Simple static demo of embed snippet
app.get('/embed-snippet/:tenantId', (req,res)=>{
  const tenantId = req.params.tenantId;
  const host = req.protocol + '://' + req.get('host');
  const snippet = `<script src="${host}/embed.js?tenant=${tenantId}" async></script>`;
  res.type('text/plain').send(snippet);
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
  console.log('ServiceFlowAI running on port', PORT);
});
