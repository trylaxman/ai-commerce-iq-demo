'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Brain,
  Boxes,
  Building2,
  ChevronRight,
  CircleDollarSign,
  Database,
  Download,
  FileSpreadsheet,
  Gauge,
  LineChart,
  Lock,
  Megaphone,
  PackagePlus,
  PieChart,
  PlugZap,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  Users,
  Zap,
} from 'lucide-react';

type Store = {
  id: string;
  name: string;
  platform: string;
  revenue: number;
  orders: number;
  aov: number;
  conversion: number;
  status: string;
};

type Customer = {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  segment: string;
  lastOrder: string;
  predictedLtv: number;
  churnRisk: 'Low' | 'Medium' | 'High';
};

type Product = {
  id: string;
  name: string;
  category: string;
  stock: number;
  sales: number;
  margin: number;
  velocity: number;
  opportunity: string;
};

type Campaign = {
  id: string;
  name: string;
  segment: string;
  product: string;
  clicks: number;
  sales: number;
  revenue: number;
  spend: number;
  status: string;
};

type State = {
  stores: Store[];
  customers: Customer[];
  products: Product[];
  campaigns: Campaign[];
  events: string[];
};

const months = [
  { label: 'Jan', revenue: 42000, orders: 720, customers: 410 },
  { label: 'Feb', revenue: 47500, orders: 781, customers: 462 },
  { label: 'Mar', revenue: 51600, orders: 835, customers: 515 },
  { label: 'Apr', revenue: 58800, orders: 912, customers: 568 },
  { label: 'May', revenue: 67400, orders: 1030, customers: 631 },
  { label: 'Jun', revenue: 81200, orders: 1214, customers: 702 },
];

const segments = [
  { name: 'VIP Repeat Buyers', value: 28, color: 'bg-emerald-400', note: 'Best for bundles + early access' },
  { name: 'Likely To Reorder', value: 34, color: 'bg-cyan-400', note: 'Trigger refill reminders' },
  { name: 'Discount Sensitive', value: 22, color: 'bg-violet-400', note: 'Offer threshold discounts' },
  { name: 'Churn Risk', value: 16, color: 'bg-rose-400', note: 'Win-back within 7 days' },
];

const seed: State = {
  stores: [
    { id: 's1', name: 'GlowCart', platform: 'Shopify', revenue: 82450, orders: 1380, aov: 59.7, conversion: 3.8, status: 'Connected' },
    { id: 's2', name: 'UrbanNest', platform: 'WooCommerce', revenue: 51320, orders: 842, aov: 60.9, conversion: 2.9, status: 'CSV Import' },
    { id: 's3', name: 'WellnessHub', platform: 'API-ready', revenue: 36240, orders: 514, aov: 70.5, conversion: 2.4, status: 'Pending Sync' },
  ],
  customers: [
    { id: 'c1', name: 'Ava Martin', email: 'ava@example.com', orders: 9, spent: 1280, segment: 'VIP repeat buyer', lastOrder: '2 days ago', predictedLtv: 1860, churnRisk: 'Low' },
    { id: 'c2', name: 'Noah Lee', email: 'noah@example.com', orders: 1, spent: 89, segment: 'First-time buyer', lastOrder: '21 days ago', predictedLtv: 210, churnRisk: 'High' },
    { id: 'c3', name: 'Mia Patel', email: 'mia@example.com', orders: 5, spent: 640, segment: 'Likely to reorder', lastOrder: '8 days ago', predictedLtv: 980, churnRisk: 'Medium' },
    { id: 'c4', name: 'Ethan Brooks', email: 'ethan@example.com', orders: 3, spent: 310, segment: 'Discount sensitive', lastOrder: '15 days ago', predictedLtv: 520, churnRisk: 'Medium' },
    { id: 'c5', name: 'Priya Shah', email: 'priya@example.com', orders: 7, spent: 940, segment: 'VIP repeat buyer', lastOrder: '1 day ago', predictedLtv: 1510, churnRisk: 'Low' },
  ],
  products: [
    { id: 'p1', name: 'Hydration Serum', category: 'Skincare', stock: 42, sales: 312, margin: 68, velocity: 8.4, opportunity: 'Hero SKU' },
    { id: 'p2', name: 'Bamboo Towel Set', category: 'Home', stock: 16, sales: 144, margin: 52, velocity: 5.2, opportunity: 'Low stock bundle' },
    { id: 'p3', name: 'Daily Greens Pack', category: 'Wellness', stock: 84, sales: 221, margin: 61, velocity: 6.1, opportunity: 'Win-back offer' },
    { id: 'p4', name: 'Travel Organizer', category: 'Accessories', stock: 9, sales: 98, margin: 45, velocity: 4.6, opportunity: 'Stock risk' },
    { id: 'p5', name: 'Sleep Recovery Gummies', category: 'Wellness', stock: 58, sales: 188, margin: 73, velocity: 7.2, opportunity: 'High-margin push' },
  ],
  campaigns: [
    { id: 'ca1', name: 'VIP Reorder Push', segment: 'VIP repeat buyer', product: 'Hydration Serum', clicks: 1240, sales: 118, revenue: 8260, spend: 1120, status: 'Active' },
    { id: 'ca2', name: 'Low Stock Bundle', segment: 'Likely to reorder', product: 'Bamboo Towel Set', clicks: 690, sales: 44, revenue: 3820, spend: 580, status: 'Draft' },
    { id: 'ca3', name: 'Sleep Recovery Upsell', segment: 'Discount sensitive', product: 'Sleep Recovery Gummies', clicks: 960, sales: 77, revenue: 6120, spend: 760, status: 'Active' },
  ],
  events: [
    'AI found 3 revenue opportunities worth approx. $18.4k',
    'Imported 1,240 customer rows from customer_orders_june.xlsx',
    'Merged duplicate emails safely and preserved history',
    'Generated customer segments using purchase frequency and recency',
    'Flagged 2 products with stockout risk before campaign launch',
  ],
};

function load(): State {
  if (typeof window === 'undefined') return seed;
  const v = localStorage.getItem('commerce-iq-demo-v2');
  if (!v) {
    localStorage.setItem('commerce-iq-demo-v2', JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(v);
}

function money(n: number) {
  return '$' + Math.round(n).toLocaleString();
}

function percent(n: number) {
  return n.toFixed(1) + '%';
}

export default function Page() {
  const [data, setData] = useState<State>(seed);
  const [tab, setTab] = useState('dashboard');
  const [locked, setLocked] = useState(true);
  const [pw, setPw] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => setData(load()), []);
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('commerce-iq-demo-v2', JSON.stringify(data));
  }, [data]);

  const stats = useMemo(() => {
    const rev = data.stores.reduce((a, b) => a + b.revenue, 0);
    const orders = data.stores.reduce((a, b) => a + b.orders, 0);
    const campaignRev = data.campaigns.reduce((a, b) => a + b.revenue, 0);
    const campaignSpend = data.campaigns.reduce((a, b) => a + b.spend, 0);
    return {
      rev,
      orders,
      cust: data.customers.length,
      roi: campaignSpend ? campaignRev / campaignSpend : 0,
      aov: rev / orders,
      opportunity: 18400,
    };
  }, [data]);

  function importMock() {
    setData((d) => ({
      ...d,
      customers: [
        ...d.customers,
        {
          id: 'c' + Date.now(),
          name: 'Sophia Rivera',
          email: 'sophia@example.com',
          orders: 2,
          spent: 220,
          segment: 'New high intent',
          lastOrder: 'today',
          predictedLtv: 640,
          churnRisk: 'Low',
        },
      ],
      events: [
        'Uploaded customer_orders_june.xlsx',
        'Normalized customer, product and order columns',
        'Merged duplicate customer records without losing history',
        'AI detected 1 new high-intent customer segment',
        ...d.events,
      ],
    }));
  }

  function generateAI() {
    setData((d) => ({
      ...d,
      campaigns: [
        {
          id: 'ca' + Date.now(),
          name: 'AI Winback Campaign',
          segment: 'First-time buyer',
          product: 'Daily Greens Pack',
          clicks: 0,
          sales: 0,
          revenue: 0,
          spend: 0,
          status: 'AI Suggested',
        },
        ...d.campaigns,
      ],
      events: [
        'AI suggested Daily Greens winback campaign',
        'Generated 4 audience segments from recency/frequency/spend behavior',
        'Recommended holding Travel Organizer campaign due to stockout risk',
        'Predicted $18.4k revenue opportunity across 3 campaigns',
        ...d.events,
      ],
    }));
    setTab('ai');
  }

  function addCampaign() {
    setData((d) => ({
      ...d,
      campaigns: [
        ...d.campaigns,
        { id: 'ca' + Date.now(), name: 'Bundle Upsell Test', segment: 'Discount sensitive', product: 'Travel Organizer', clicks: 0, sales: 0, revenue: 0, spend: 0, status: 'Draft' },
      ],
      events: ['Created new campaign draft', ...d.events],
    }));
  }

  if (locked)
    return (
      <main className="min-h-screen grid-bg flex items-center justify-center p-6">
        <div className="card max-w-md w-full rounded-3xl p-8 shadow-2xl">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-300 to-emerald-300 text-slate-950 grid place-items-center mb-6 shadow-glow">
            <Brain />
          </div>
          <p className="text-cyan-300 font-bold text-sm">AI Commerce Analytics MVP</p>
          <h1 className="text-4xl font-black mt-2">CommerceIQ</h1>
          <p className="text-slate-400 mt-3">Executive analytics, AI insights, customer segmentation and campaign intelligence for online stores.</p>
          <div className="mt-6 rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-sm text-slate-400">
            Demo password: <b className="text-white">admin123</b>
          </div>
          <input className="mt-4 w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-300" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} type="password" />
          <button onClick={() => pw === 'admin123' && setLocked(false)} className="mt-4 w-full rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3">
            Enter dashboard
          </button>
        </div>
      </main>
    );

  const nav = [
    ['dashboard', BarChart3],
    ['analytics', Gauge],
    ['data', Database],
    ['customers', Users],
    ['products', Boxes],
    ['campaigns', Megaphone],
    ['ai', Sparkles],
    ['reports', LineChart],
  ] as const;

  return (
    <main className="min-h-screen grid-bg text-slate-100">
      <aside className="fixed left-0 top-0 h-full w-72 border-r border-slate-800 bg-slate-950/85 backdrop-blur p-5">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-300 to-emerald-300 text-slate-950 grid place-items-center shadow-glow">
            <Brain />
          </div>
          <div>
            <b className="text-lg">CommerceIQ</b>
            <p className="text-xs text-slate-400">AI commerce intelligence</p>
          </div>
        </div>
        {nav.map(([k, I]) => (
          <button key={k} onClick={() => setTab(k)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl capitalize mb-2 transition ${tab === k ? 'bg-cyan-400 text-slate-950 font-bold shadow-glow' : 'text-slate-300 hover:bg-slate-800'}`}>
            <I size={18} />
            {k}
          </button>
        ))}
        <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 text-sm text-slate-400">
          <div className="flex items-center gap-2 text-cyan-300 font-bold mb-2">
            <PlugZap size={16} /> API-ready
          </div>
          Foundation for future Shopify, WooCommerce and custom store sync.
        </div>
      </aside>

      <section className="ml-72 p-8">
        <header className="flex justify-between items-start mb-8">
          <div>
            <p className="text-cyan-300 font-bold">Internal AI Commerce Platform</p>
            <h1 className="text-4xl font-black tracking-tight">{tab === 'dashboard' ? 'Executive Dashboard' : tab.charAt(0).toUpperCase() + tab.slice(1)}</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={importMock} className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-3 font-bold flex gap-2">
              <Upload size={18} /> Import data
            </button>
            <button onClick={generateAI} className="rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-4 py-3 font-bold flex gap-2 shadow-glow">
              <Sparkles size={18} /> Generate AI insights
            </button>
          </div>
        </header>

        {tab === 'dashboard' && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Metric label="Total Revenue" value={money(stats.rev)} delta="+18.4%" icon={CircleDollarSign} good />
              <Metric label="Orders" value={stats.orders.toLocaleString()} delta="+12.8%" icon={TrendingUp} good />
              <Metric label="Customers" value={stats.cust.toString()} delta="+6 new" icon={Users} good />
              <Metric label="AI Opportunity" value={money(stats.opportunity)} delta="3 campaigns" icon={Sparkles} good />
            </div>

            <div className="grid grid-cols-12 gap-5 mb-5">
              <div className="col-span-8">
                <Panel title="Revenue & Order Trend" action="Last 6 months">
                  <RevenueChart />
                </Panel>
              </div>
              <div className="col-span-4">
                <Panel title="Customer Segments" action="AI generated">
                  <SegmentDonut />
                </Panel>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              <Panel title="AI Growth Recommendations">
                <Insight title="Promote Hydration Serum" text="High margin + repeat purchase behavior. Best target: VIP repeat buyers." impact="$7.8k potential" />
                <Insight title="Launch first-order winback" text="First-time buyers drop sharply after day 21. Trigger reorder messaging now." impact="$4.2k potential" />
                <Insight title="Pause Travel Organizer ads" text="Stock risk is high. Recommend bundle-only exposure until inventory is updated." impact="Avoid stockout" warning />
              </Panel>
              <Panel title="Top Product Opportunities">
                <OpportunityBars products={data.products} />
              </Panel>
              <Panel title="Recent Intelligence Feed">
                {data.events.slice(0, 6).map((e) => (
                  <p className="border-b border-slate-800 py-3 text-slate-300 text-sm" key={e}>
                    • {e}
                  </p>
                ))}
              </Panel>
            </div>
          </>
        )}

        {tab === 'analytics' && (
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-8">
              <Panel title="Campaign ROI Intelligence" action="Revenue / Spend">
                <CampaignRoiChart campaigns={data.campaigns} />
              </Panel>
            </div>
            <div className="col-span-4">
              <Panel title="Health Score">
                <ScoreCard score={86} />
              </Panel>
            </div>
            <div className="col-span-6">
              <Panel title="Inventory Risk Matrix">
                <RiskMatrix products={data.products} />
              </Panel>
            </div>
            <div className="col-span-6">
              <Panel title="Store Performance">
                <Table rows={data.stores} cols={['name', 'platform', 'revenue', 'orders', 'aov', 'conversion', 'status']} />
              </Panel>
            </div>
          </div>
        )}

        {tab === 'data' && (
          <Panel title="Data Upload, Merge & History Center" action="CSV / Excel today, API sync later">
            <div className="grid grid-cols-3 gap-4">
              <UploadBox title="Customers / Orders" description="Upload historical orders and merge by email, phone or customer ID." />
              <UploadBox title="Products / Inventory" description="Normalize SKUs, stock levels, pricing and product categories." />
              <UploadBox title="Campaign Results" description="Track clicks, sales, spend, revenue and ROI by campaign." />
            </div>
            <button onClick={importMock} className="mt-6 rounded-xl bg-cyan-400 text-slate-950 font-bold px-5 py-3">
              Simulate CSV/Excel Import
            </button>
          </Panel>
        )}

        {tab === 'customers' && (
          <Panel title="Customer Intelligence">
            <SearchBox query={query} setQuery={setQuery} />
            <Table rows={data.customers.filter((c) => JSON.stringify(c).toLowerCase().includes(query.toLowerCase()))} cols={['name', 'email', 'orders', 'spent', 'predictedLtv', 'segment', 'churnRisk', 'lastOrder']} />
          </Panel>
        )}

        {tab === 'products' && (
          <Panel title="Product & Inventory Intelligence">
            <Table rows={data.products} cols={['name', 'category', 'stock', 'sales', 'margin', 'velocity', 'opportunity']} />
          </Panel>
        )}

        {tab === 'campaigns' && (
          <Panel title="Campaign Tracking">
            <button onClick={addCampaign} className="mb-4 rounded-xl bg-cyan-400 text-slate-950 font-bold px-4 py-2">
              Create Campaign
            </button>
            <Table rows={data.campaigns.map((c) => ({ ...c, roi: c.spend ? (c.revenue / c.spend).toFixed(1) + 'x' : '—' }))} cols={['name', 'segment', 'product', 'clicks', 'sales', 'spend', 'revenue', 'roi', 'status']} />
          </Panel>
        )}

        {tab === 'ai' && (
          <div className="grid grid-cols-3 gap-5">
            <Panel title="AI Customer Segments">
              <Insight title="VIP repeat buyers" text="High LTV, low discount sensitivity. Use early access, bundles and premium offers." impact="28% of revenue" />
              <Insight title="First-time buyers" text="Need trust-building and reorder reminders within 14–21 days." impact="Winback priority" />
              <Insight title="Churn risk customers" text="No repeat purchase after expected reorder window. Use urgency + incentive." impact="High risk" warning />
            </Panel>
            <Panel title="AI Product Strategy">
              <Insight title="Promote Hydration Serum" text="Strong margin and sales velocity. Best product for next campaign." impact="Hero SKU" />
              <Insight title="Sleep Recovery Gummies" text="High margin and strong upsell potential with wellness buyers." impact="Upsell SKU" />
              <Insight title="Protect Travel Organizer" text="Low stock. Avoid aggressive campaign until replenishment." impact="Inventory alert" warning />
            </Panel>
            <Panel title="AI Campaign Message">
              <div className="rounded-2xl bg-slate-950 p-4 text-slate-300 border border-slate-800">
                <p className="text-cyan-300 font-bold mb-3">Generated message</p>
                <p className="font-bold">Subject: Your next refill is ready ✨</p>
                <p className="mt-3 text-sm text-slate-400">Based on what customers like you purchased, Hydration Serum is the perfect reorder this week. Add Daily Greens and save 12%.</p>
              </div>
            </Panel>
          </div>
        )}

        {tab === 'reports' && (
          <Panel title="Reports & Exports" action="Client-ready outputs">
            <div className="grid grid-cols-4 gap-4">
              {['Executive Summary', 'Customer Insights', 'Product Performance', 'Campaign ROI'].map((r) => (
                <div className="rounded-2xl bg-slate-950 p-5 border border-slate-800 hover:border-cyan-400/60 transition" key={r}>
                  <Download className="text-cyan-300 mb-4" />
                  <b>{r}</b>
                  <p className="text-slate-400 text-sm mt-2">Export-ready report for future analysis and decision making.</p>
                </div>
              ))}
            </div>
          </Panel>
        )}
      </section>
    </main>
  );
}

function Metric({ label, value, delta, icon: Icon, good }: { label: string; value: string; delta: string; icon: any; good?: boolean }) {
  return (
    <div className="card rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan-400/10" />
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm">{label}</p>
          <b className="text-3xl mt-1 block">{value}</b>
        </div>
        <div className="h-10 w-10 rounded-xl bg-slate-950 grid place-items-center text-cyan-300 border border-slate-800">
          <Icon size={20} />
        </div>
      </div>
      <p className={`mt-4 text-sm font-bold flex items-center gap-1 ${good ? 'text-emerald-300' : 'text-rose-300'}`}>{good ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />} {delta}</p>
    </div>
  );
}

function Panel({ title, children, action }: { title: string; children: React.ReactNode; action?: string }) {
  return (
    <div className="card rounded-3xl p-6 h-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-black">{title}</h2>
        {action && <span className="text-xs rounded-full border border-slate-700 px-3 py-1 text-slate-400">{action}</span>}
      </div>
      {children}
    </div>
  );
}

function RevenueChart() {
  const max = Math.max(...months.map((m) => m.revenue));
  const points = months.map((m, i) => `${(i / (months.length - 1)) * 100},${100 - (m.revenue / max) * 82}`).join(' ');
  return (
    <div>
      <div className="h-72 rounded-2xl bg-slate-950 border border-slate-800 p-5 relative overflow-hidden">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full p-5">
          <polyline points={points} fill="none" stroke="rgb(34 211 238)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          <polyline points={`0,100 ${points} 100,100`} fill="rgba(34,211,238,0.10)" stroke="none" />
        </svg>
        <div className="absolute left-5 right-5 bottom-5 flex justify-between text-xs text-slate-500">
          {months.map((m) => (
            <span key={m.label}>{m.label}</span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        <MiniStat label="AOV" value="$63.2" />
        <MiniStat label="Conversion" value="3.4%" />
        <MiniStat label="Repeat Rate" value="41%" />
      </div>
    </div>
  );
}

function SegmentDonut() {
  return (
    <div>
      <div className="h-44 grid place-items-center">
        <div className="relative h-36 w-36 rounded-full bg-[conic-gradient(#34d399_0_28%,#22d3ee_28%_62%,#a78bfa_62%_84%,#fb7185_84%_100%)]">
          <div className="absolute inset-6 rounded-full bg-slate-950 grid place-items-center text-center border border-slate-800">
            <div>
              <b className="text-2xl">4</b>
              <p className="text-xs text-slate-400">segments</p>
            </div>
          </div>
        </div>
      </div>
      {segments.map((s) => (
        <div key={s.name} className="flex items-start gap-3 py-2 border-b border-slate-800 last:border-0">
          <span className={`mt-1 h-3 w-3 rounded-full ${s.color}`} />
          <div className="flex-1">
            <div className="flex justify-between text-sm"><b>{s.name}</b><span>{s.value}%</span></div>
            <p className="text-xs text-slate-500">{s.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function OpportunityBars({ products }: { products: Product[] }) {
  const max = Math.max(...products.map((p) => p.sales));
  return (
    <div className="space-y-4">
      {products.slice(0, 5).map((p) => (
        <div key={p.id}>
          <div className="flex justify-between text-sm mb-1"><b>{p.name}</b><span className="text-slate-400">{p.opportunity}</span></div>
          <div className="h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-300" style={{ width: `${(p.sales / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function CampaignRoiChart({ campaigns }: { campaigns: Campaign[] }) {
  const max = Math.max(...campaigns.map((c) => c.spend ? c.revenue / c.spend : 0), 1);
  return (
    <div className="space-y-5">
      {campaigns.map((c) => {
        const roi = c.spend ? c.revenue / c.spend : 0;
        return (
          <div key={c.id}>
            <div className="flex justify-between mb-2 text-sm"><b>{c.name}</b><span className="text-cyan-300 font-bold">{roi ? roi.toFixed(1) + 'x ROI' : 'No spend yet'}</span></div>
            <div className="h-8 bg-slate-950 border border-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-300 rounded-full" style={{ width: `${Math.min((roi / max) * 100, 100)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScoreCard({ score }: { score: number }) {
  return (
    <div className="text-center">
      <div className="mx-auto h-40 w-40 rounded-full bg-[conic-gradient(#22d3ee_0_86%,#1e293b_86%_100%)] p-3">
        <div className="h-full w-full rounded-full bg-slate-950 grid place-items-center border border-slate-800">
          <div><b className="text-5xl">{score}</b><p className="text-xs text-slate-400">commerce score</p></div>
        </div>
      </div>
      <p className="mt-5 text-slate-400 text-sm">Strong revenue momentum. Watch low-stock SKUs before launching additional paid campaigns.</p>
    </div>
  );
}

function RiskMatrix({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {products.map((p) => {
        const risk = p.stock < 20 ? 'High' : p.stock < 50 ? 'Medium' : 'Low';
        return (
          <div key={p.id} className={`rounded-2xl p-4 border ${risk === 'High' ? 'bg-rose-500/10 border-rose-400/30' : risk === 'Medium' ? 'bg-amber-500/10 border-amber-400/30' : 'bg-emerald-500/10 border-emerald-400/30'}`}>
            <AlertTriangle size={18} className={risk === 'High' ? 'text-rose-300' : risk === 'Medium' ? 'text-amber-300' : 'text-emerald-300'} />
            <b className="block mt-3 text-sm">{p.name}</b>
            <p className="text-xs text-slate-400 mt-1">Stock: {p.stock}</p>
            <p className="text-xs font-bold mt-3">{risk} risk</p>
          </div>
        );
      })}
    </div>
  );
}

function Insight({ title, text, impact, warning }: { title: string; text: string; impact?: string; warning?: boolean }) {
  return (
    <div className="rounded-2xl bg-slate-950 p-4 mb-3 border border-slate-800">
      <b className="flex items-center gap-2"><ChevronRight className={warning ? 'text-amber-300' : 'text-cyan-300'} size={18} />{title}</b>
      <p className="text-slate-400 text-sm mt-1">{text}</p>
      {impact && <span className={`inline-block mt-3 text-xs rounded-full px-3 py-1 ${warning ? 'bg-amber-300/10 text-amber-200' : 'bg-cyan-300/10 text-cyan-200'}`}>{impact}</span>}
    </div>
  );
}

function UploadBox({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-600 bg-slate-950 p-6 hover:border-cyan-400/70 transition">
      <FileSpreadsheet className="text-cyan-300 mb-4" />
      <b>{title}</b>
      <p className="text-sm text-slate-400 mt-2">{description}</p>
    </div>
  );
}

function SearchBox({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-xl bg-slate-950 border border-slate-800 px-3">
      <Search size={18} />
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customers, segments, emails..." className="w-full bg-transparent py-3 outline-none" />
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4"><p className="text-xs text-slate-500">{label}</p><b className="text-xl">{value}</b></div>;
}

function Table({ rows, cols }: { rows: any[]; cols: string[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-950 text-slate-400">
          <tr>{cols.map((c) => <th className="text-left p-3 capitalize" key={c}>{c.replace(/([A-Z])/g, ' $1')}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr className="border-t border-slate-800 hover:bg-slate-900/60" key={r.id || i}>
              {cols.map((c) => <td className="p-3" key={c}>{formatCell(c, r[c])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCell(key: string, value: any) {
  if (typeof value === 'number' && ['spent', 'revenue', 'spend', 'predictedLtv'].includes(key)) return money(value);
  if (typeof value === 'number' && ['aov'].includes(key)) return '$' + value.toFixed(1);
  if (typeof value === 'number' && ['conversion', 'margin'].includes(key)) return percent(value);
  if (key === 'churnRisk') {
    const cls = value === 'High' ? 'bg-rose-400/10 text-rose-200' : value === 'Medium' ? 'bg-amber-400/10 text-amber-200' : 'bg-emerald-400/10 text-emerald-200';
    return <span className={`rounded-full px-3 py-1 text-xs font-bold ${cls}`}>{value}</span>;
  }
  if (key === 'status') return <span className="rounded-full bg-cyan-400/10 text-cyan-200 px-3 py-1 text-xs font-bold">{value}</span>;
  return value;
}
