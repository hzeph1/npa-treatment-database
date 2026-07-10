import React, { useState, useMemo, useEffect } from "react";
import { Search, ArrowLeft, ArrowRight, Brain, Activity, MapPin, ExternalLink, CheckCircle2, Layers, Database, Loader2 } from "lucide-react";

/* ============================================================================
   NPA TREATMENT DATABASE — PROTOTYPE
   ----------------------------------------------------------------------------
   Data model matches Izzy's 3 entry points + Sherry's master index.
   "Stroke" is fully built out as the reference prototype (per the brief);
   other conditions are stubbed with the same schema so they populate as
   content is authored. Everything below is a relational shape:

     categories → conditions → (symptoms, therapies, centers)
     therapies are shared and can span multiple conditions (many-to-many)

   Swap the in-file DATA object for an API response with the identical shape
   and the UI needs no changes.
   ========================================================================== */

const SEED_CATEGORIES = [
  { id: "abi", label: "Acquired Brain Injury" },
  { id: "neuro", label: "Neurodegenerative" },
  { id: "dev", label: "Developmental" },
  { id: "mental", label: "Mental & Emotional Health" },
  { id: "pain", label: "Pain" },
  { id: "epilepsy", label: "Epilepsy" },
];

// Shared therapy library — referenced by id so a therapy can span conditions.
const SEED_THERAPIES = {
  cimt: {
    id: "cimt",
    name: "Constraint-Induced Movement Therapy (CIMT)",
    type: "Motor rehabilitation",
    summary:
      "Restrains the unaffected limb to force intensive, repetitive use of the affected limb, driving cortical remapping of motor function.",
    evidence: "Strong",
    modality: "In-clinic, therapist-led",
  },
  mirror: {
    id: "mirror",
    name: "Mirror Therapy",
    type: "Motor / perceptual",
    summary:
      "Uses a mirror reflection of the intact limb to create the visual illusion of normal movement, recruiting neuroplastic pathways for the affected side.",
    evidence: "Moderate",
    modality: "In-clinic or home program",
  },
  tms: {
    id: "tms",
    name: "Transcranial Magnetic Stimulation (TMS)",
    type: "Neuromodulation",
    summary:
      "Non-invasive magnetic pulses stimulate or inhibit targeted cortical regions to rebalance activity between hemispheres after injury.",
    evidence: "Moderate–Strong",
    modality: "In-clinic, device-based",
  },
  aphasia: {
    id: "aphasia",
    name: "Intensive Aphasia Therapy",
    type: "Speech & language",
    summary:
      "High-dose, task-specific language practice that leverages plasticity in perilesional and right-hemisphere language networks.",
    evidence: "Strong",
    modality: "Therapist-led, high frequency",
  },
  fes: {
    id: "fes",
    name: "Functional Electrical Stimulation (FES)",
    type: "Neuromuscular",
    summary:
      "Electrical impulses activate weakened muscles during functional tasks, pairing movement intent with sensory feedback to reinforce motor circuits.",
    evidence: "Moderate",
    modality: "In-clinic or wearable",
  },
  vr: {
    id: "vr",
    name: "Virtual Reality Rehabilitation",
    type: "Task-specific training",
    summary:
      "Immersive, gamified environments deliver high-repetition, motivating practice with real-time feedback to accelerate motor and cognitive recovery.",
    evidence: "Emerging",
    modality: "In-clinic or home device",
  },
  cogrehab: {
    id: "cogrehab",
    name: "Cognitive Rehabilitation Therapy",
    type: "Cognitive",
    summary:
      "Structured retraining of attention, memory, and executive function using restorative drills and compensatory strategies to rebuild damaged cognitive networks.",
    evidence: "Strong",
    modality: "Therapist-led, structured program",
  },
  vestibular: {
    id: "vestibular",
    name: "Vestibular Rehabilitation",
    type: "Balance & sensory",
    summary:
      "Graded gaze-stabilization and balance exercises retrain the brain to compensate for disrupted vestibular signals, reducing dizziness and instability after injury.",
    evidence: "Moderate–Strong",
    modality: "Therapist-led, home exercises",
  },
  nfb: {
    id: "nfb",
    name: "Neurofeedback (EEG Biofeedback)",
    type: "Neuromodulation",
    summary:
      "Real-time display of the person's own brainwave activity lets them learn to self-regulate cortical patterns, targeting attention, sleep, and emotional regulation.",
    evidence: "Emerging",
    modality: "In-clinic, device-based",
  },
};

// Rehabilitation centers — also shared / referenceable across conditions.
const SEED_CENTERS = {
  select: {
    id: "select",
    name: "Select Neuro Rehabilitation Institute",
    location: "Louisville, KY",
    focus: "Stroke, TBI, intensive motor recovery",
  },
  bridge: {
    id: "bridge",
    name: "Bridge Recovery Center",
    location: "Atlanta, GA",
    focus: "Aphasia, cognitive rehabilitation",
  },
  summit: {
    id: "summit",
    name: "Summit Brain Injury Program",
    location: "Boston, MA",
    focus: "TBI, cognitive & vestibular rehabilitation",
  },
};

// Conditions keyed by id. Stroke & TBI are fully authored reference records.
const SEED_CONDITIONS = {
  stroke: {
    id: "stroke",
    name: "Stroke",
    category: "abi",
    status: "ready",
    overview:
      "Stroke interrupts blood flow to part of the brain, causing loss of function in the areas it controls. Because the brain can reorganize, targeted, high-intensity therapy can help recruit healthy tissue to take over lost abilities — the core premise of applied neuroplasticity.",
    symptoms: [
      "Weakness or paralysis on one side (hemiparesis)",
      "Difficulty speaking or understanding language (aphasia)",
      "Loss of coordination or balance",
      "Vision changes",
      "Cognitive or memory difficulties",
    ],
    therapies: ["cimt", "mirror", "tms", "aphasia", "fes", "vr"],
    centers: ["select", "bridge"],
    docUrl:
      "https://docs.google.com/document/d/1Oh5cauyB-zQW4LEhsXnlHU4uz",
  },
  tbi: {
    id: "tbi",
    name: "Traumatic Brain Injury | TBI",
    category: "abi",
    status: "ready",
    overview:
      "A traumatic brain injury results from an external force — a fall, collision, or blow to the head — that disrupts normal brain function. Effects range from brief concussion to lasting changes in movement, thinking, and mood. Because recovery depends on the brain forming new connections around the injured tissue, structured neuroplasticity-based rehabilitation is central to regaining function.",
    symptoms: [
      "Persistent headaches",
      "Difficulty concentrating or remembering (cognitive fog)",
      "Dizziness or balance problems",
      "Mood changes, irritability, or depression",
      "Sensitivity to light or noise",
      "Fatigue and disrupted sleep",
    ],
    therapies: ["cogrehab", "vestibular", "tms", "vr", "fes", "nfb"],
    centers: ["summit", "select"],
    docUrl:
      "https://docs.google.com/document/d/1aKP9m_24h-vakxEKKN3-v3LOko3jPOZfH",
  },
  alzheimers: { id: "alzheimers", name: "Alzheimer's Disease", category: "neuro", status: "draft", symptoms: [], therapies: ["tms"], centers: [] },
  ms: { id: "ms", name: "Multiple Sclerosis", category: "neuro", status: "draft", symptoms: [], therapies: ["fes", "vr"], centers: [] },
  parkinsons: { id: "parkinsons", name: "Parkinson's Disease", category: "neuro", status: "draft", symptoms: [], therapies: ["vr", "fes"], centers: [] },
  dyslexia: { id: "dyslexia", name: "Dyslexia", category: "dev", status: "draft", symptoms: [], therapies: [], centers: [] },
  adhd: { id: "adhd", name: "ADHD", category: "dev", status: "draft", symptoms: [], therapies: [], centers: [] },
  autism: { id: "autism", name: "Autism", category: "dev", status: "draft", symptoms: [], therapies: [], centers: [] },
  devdelay: { id: "devdelay", name: "Developmental Delays", category: "dev", status: "draft", symptoms: [], therapies: [], centers: [] },
  anxiety: { id: "anxiety", name: "Anxiety", category: "mental", status: "draft", symptoms: [], therapies: ["tms"], centers: [] },
  depression: { id: "depression", name: "Depression", category: "mental", status: "draft", symptoms: [], therapies: ["tms"], centers: [] },
  ptsd: { id: "ptsd", name: "PTSD/Trauma & Addiction", category: "mental", status: "draft", symptoms: [], therapies: ["tms"], centers: [] },
  pain: { id: "pain", name: "Persistent Pain", category: "pain", status: "draft", symptoms: [], therapies: ["mirror", "tms"], centers: [] },
  migraine: { id: "migraine", name: "Migraine - Headaches", category: "pain", status: "draft", symptoms: [], therapies: ["tms"], centers: [] },
  epilepsy: { id: "epilepsy", name: "Epilepsy", category: "epilepsy", status: "draft", symptoms: [], therapies: [], centers: [] },
};

/* ============================================================================
   DATA LAYER
   ----------------------------------------------------------------------------
   These `let` bindings are what every component reads. They start as the seed
   data (so the app always runs) and get replaced at startup if a Supabase
   backend is reachable. To go live, fill in SUPABASE_URL + SUPABASE_ANON_KEY
   below and create the tables described in the SQL block at the bottom of the
   config. No component code changes — the shapes are identical.
   ========================================================================== */

// ▼▼▼ Paste your Supabase project values here to switch on the live backend ▼▼▼
const SUPABASE_URL = "";        // e.g. "https://xxxx.supabase.co"
const SUPABASE_ANON_KEY = "";   // public anon key (read-only via RLS)
// ▲▲▲ Leave blank to run on the built-in seed data ▲▲▲

let CATEGORIES = SEED_CATEGORIES;
let THERAPIES = SEED_THERAPIES;
let CENTERS = SEED_CENTERS;
let CONDITIONS = SEED_CONDITIONS;
let SYMPTOM_INDEX = {};

function buildSymptomIndex() {
  const map = {};
  Object.values(CONDITIONS).forEach((c) => {
    (c.symptoms || []).forEach((s) => {
      if (!map[s]) map[s] = [];
      map[s].push(c.id);
    });
  });
  SYMPTOM_INDEX = map;
}
buildSymptomIndex();

// Turn flat Supabase rows into the keyed, nested shape the UI expects.
function hydrate({ categories, therapies, centers, conditions, condition_therapies, condition_centers, condition_symptoms }) {
  const therMap = {};
  therapies.forEach((t) => (therMap[t.id] = t));
  const ctrMap = {};
  centers.forEach((c) => (ctrMap[c.id] = c));

  const condMap = {};
  conditions.forEach((c) => {
    condMap[c.id] = {
      ...c,
      symptoms: condition_symptoms.filter((r) => r.condition_id === c.id).sort((a, b) => a.sort - b.sort).map((r) => r.symptom),
      therapies: condition_therapies.filter((r) => r.condition_id === c.id).map((r) => r.therapy_id),
      centers: condition_centers.filter((r) => r.condition_id === c.id).map((r) => r.center_id),
    };
  });

  CATEGORIES = categories.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
  THERAPIES = therMap;
  CENTERS = ctrMap;
  CONDITIONS = condMap;
  buildSymptomIndex();
}

async function fetchTable(name) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${name}?select=*`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  if (!res.ok) throw new Error(`${name}: ${res.status}`);
  return res.json();
}

// Returns { source: "live" | "seed", error? }
async function loadData() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return { source: "seed" };
  try {
    const [categories, therapies, centers, conditions, condition_therapies, condition_centers, condition_symptoms] =
      await Promise.all([
        fetchTable("categories"),
        fetchTable("therapies"),
        fetchTable("centers"),
        fetchTable("conditions"),
        fetchTable("condition_therapies"),
        fetchTable("condition_centers"),
        fetchTable("condition_symptoms"),
      ]);
    hydrate({ categories, therapies, centers, conditions, condition_therapies, condition_centers, condition_symptoms });
    return { source: "live" };
  } catch (err) {
    return { source: "seed", error: err.message };
  }
}

const C = {
  bg: "#0d1b2a",
  panel: "#13293d",
  panelSoft: "#1b3a53",
  ink: "#eaf2f8",
  sub: "#9db4c7",
  line: "#254a68",
  accent: "#3dd4c8",
  accentDim: "#1f8f86",
  gold: "#e9b949",
};

const EVIDENCE_COLOR = {
  Strong: C.accent,
  "Moderate–Strong": "#7fd88f",
  Moderate: C.gold,
  Emerging: "#c98fd8",
};

export default function App() {
  const [view, setView] = useState({ screen: "home" });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState({ loading: true, source: "seed", error: null });

  useEffect(() => {
    let alive = true;
    loadData().then((r) => {
      if (alive) setStatus({ loading: false, source: r.source, error: r.error || null });
    });
    return () => { alive = false; };
  }, []);

  const go = (screen, payload = {}) => setView({ screen, ...payload });

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600;700&display=swap');
        .fr { font-family: 'Fraunces', Georgia, serif; }
        .card { transition: transform .18s ease, border-color .18s ease, background .18s ease; cursor: pointer; }
        .card:hover { transform: translateY(-3px); border-color: ${C.accent}; }
        .lnk:hover { color: ${C.accent}; }
        button:focus-visible, a:focus-visible, .card:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        @media (prefers-reduced-motion: reduce){ .card{transition:none} .spin{animation:none} }
      `}</style>

      <Header onHome={() => go("home")} status={status} />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px 80px" }}>
        {status.loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "120px 0", color: C.sub }}>
            <Loader2 size={20} className="spin" /> Connecting to treatment database…
          </div>
        ) : (
          <>
            {view.screen === "home" && <Home go={go} query={query} setQuery={setQuery} />}
            {view.screen === "symptoms" && <SymptomList go={go} />}
            {view.screen === "categories" && <CategoryList go={go} />}
            {view.screen === "category" && <ConditionsInCategory go={go} categoryId={view.categoryId} />}
            {view.screen === "therapies" && <AllTherapies go={go} />}
            {view.screen === "condition" && <ConditionDetail go={go} conditionId={view.conditionId} />}
            {view.screen === "therapy" && <TherapyDetail go={go} therapyId={view.therapyId} />}
          </>
        )}
      </main>

      <DisclaimerBar />
    </div>
  );
}

function DataBadge({ status }) {
  const live = status.source === "live";
  const col = live ? C.accent : C.gold;
  const label = status.loading ? "connecting" : live ? "live database" : "preview";
  return (
    <span title={status.error ? `Falling back to sample data: ${status.error}` : label}
      style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: col, border: `1px solid ${col}55`, background: col + "18", padding: "3px 9px", borderRadius: 20 }}>
      <Database size={12} /> {label}
    </span>
  );
}

function DisclaimerBar() {
  return (
    <div style={{ borderTop: `1px solid ${C.line}`, background: C.panel, padding: "16px 20px" }}>
      <p style={{ maxWidth: 1080, margin: "0 auto", fontSize: 12, color: C.sub, lineHeight: 1.6 }}>
        This directory is for education and awareness only and is not medical advice. Treatment suitability varies by individual — always consult a qualified healthcare provider before starting or changing any therapy. The Neuroplasticity Alliance does not endorse specific providers or centers.
      </p>
    </div>
  );
}

function Header({ onHome, status }) {
  return (
    <header style={{ borderBottom: `1px solid ${C.line}`, position: "sticky", top: 0, background: C.bg + "f2", backdropFilter: "blur(8px)", zIndex: 10 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onHome} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", color: C.ink }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${C.accent}, ${C.accentDim})`, display: "grid", placeItems: "center" }}>
            <Brain size={19} color={C.bg} />
          </div>
          <div style={{ textAlign: "left", lineHeight: 1.1 }}>
            <div className="fr" style={{ fontSize: 17, fontWeight: 600 }}>Neuroplasticity Alliance</div>
            <div style={{ fontSize: 11, color: C.sub, letterSpacing: 0.4 }}>TREATMENT DATABASE</div>
          </div>
        </button>
        <div style={{ marginLeft: "auto" }}>{status && <DataBadge status={status} />}</div>
      </div>
    </header>
  );
}

function Home({ go, query, setQuery }) {
  const results = useMemo(() => {
    if (query.trim().length < 2) return null;
    const q = query.toLowerCase();
    const conds = Object.values(CONDITIONS).filter((c) => c.name.toLowerCase().includes(q));
    const ther = Object.values(THERAPIES).filter((t) => t.name.toLowerCase().includes(q) || t.type.toLowerCase().includes(q));
    return { conds, ther };
  }, [query]);

  const entries = [
    { key: "symptoms", icon: Activity, title: "Explore by Symptom", desc: "Start from what you're experiencing and find conditions and treatments that address it.", screen: "symptoms" },
    { key: "challenge", icon: Brain, title: "Explore by Neurological Challenge", desc: "Browse by condition category — brain injury, neurodegenerative, developmental, and more.", screen: "categories" },
    { key: "all", icon: Layers, title: "Explore All Treatment Types", desc: "See every applied-neuroplasticity therapy in the database, across all conditions.", screen: "therapies" },
  ];

  return (
    <>
      <section style={{ padding: "56px 0 30px", textAlign: "center" }}>
        <div style={{ fontSize: 12, letterSpacing: 2, color: C.accent, marginBottom: 14 }}>REWIRING HOPE, ONE NEURON AT A TIME</div>
        <h1 className="fr" style={{ fontSize: 42, fontWeight: 600, margin: "0 0 14px", lineHeight: 1.1 }}>
          Find the treatment<br />that fits the challenge.
        </h1>
        <p style={{ color: C.sub, maxWidth: 560, margin: "0 auto 30px", fontSize: 16, lineHeight: 1.6 }}>
          An open repository of applied-neuroplasticity treatments. Choose how you'd like to explore.
        </p>

        <div style={{ position: "relative", maxWidth: 520, margin: "0 auto" }}>
          <Search size={18} color={C.sub} style={{ position: "absolute", left: 16, top: 15 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conditions or treatments…"
            aria-label="Search conditions or treatments"
            style={{ width: "100%", padding: "13px 16px 13px 46px", borderRadius: 12, border: `1px solid ${C.line}`, background: C.panel, color: C.ink, fontSize: 15 }}
          />
        </div>

        {results && (
          <div style={{ maxWidth: 520, margin: "12px auto 0", textAlign: "left", background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 10 }}>
            {results.conds.length === 0 && results.ther.length === 0 && (
              <div style={{ color: C.sub, padding: 10, fontSize: 14 }}>No matches yet. Try “stroke” or “stimulation.”</div>
            )}
            {results.conds.map((c) => (
              <Row key={c.id} onClick={() => go("condition", { conditionId: c.id })} label={c.name} tag="Condition" />
            ))}
            {results.ther.map((t) => (
              <Row key={t.id} onClick={() => go("therapy", { therapyId: t.id })} label={t.name} tag="Treatment" />
            ))}
          </div>
        )}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 20 }}>
        {entries.map((e, i) => (
          <div key={e.key} tabIndex={0} role="button" className="card" onClick={() => go(e.screen)}
            onKeyDown={(ev) => ev.key === "Enter" && go(e.screen)}
            style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 16, padding: 26 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: C.panelSoft, display: "grid", placeItems: "center" }}>
                <e.icon size={22} color={C.accent} />
              </div>
              <span style={{ fontSize: 13, color: C.sub }}>{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="fr" style={{ fontSize: 20, margin: "0 0 8px", fontWeight: 600 }}>{e.title}</h3>
            <p style={{ color: C.sub, fontSize: 14, lineHeight: 1.55, margin: 0 }}>{e.desc}</p>
            <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 6, color: C.accent, fontSize: 14, fontWeight: 500 }}>
              Start here <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

function Row({ onClick, label, tag }) {
  return (
    <button onClick={onClick} style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", padding: "10px 12px", borderRadius: 8, cursor: "pointer", color: C.ink }}>
      <span style={{ fontSize: 15 }}>{label}</span>
      <span style={{ fontSize: 11, color: C.sub, border: `1px solid ${C.line}`, padding: "2px 8px", borderRadius: 20 }}>{tag}</span>
    </button>
  );
}

function Back({ go, to, label }) {
  return (
    <button onClick={() => go(to.screen, to.payload || {})} className="lnk"
      style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.sub, cursor: "pointer", padding: "20px 0 4px", fontSize: 14 }}>
      <ArrowLeft size={16} /> {label}
    </button>
  );
}

function Crumb({ children }) {
  return <div style={{ fontSize: 12, letterSpacing: 1.5, color: C.accent, margin: "22px 0 6px" }}>{children}</div>;
}

function SymptomList({ go }) {
  const symptoms = Object.keys(SYMPTOM_INDEX).sort();
  return (
    <>
      <Back go={go} to={{ screen: "home" }} label="Back to explore" />
      <Crumb>EXPLORE BY SYMPTOM</Crumb>
      <h2 className="fr" style={{ fontSize: 30, margin: "0 0 8px" }}>What are you experiencing?</h2>
      <p style={{ color: C.sub, marginBottom: 24 }}>Select a symptom to see the conditions and treatments associated with it.</p>
      {symptoms.length === 0 && <Empty text="Symptoms populate as condition pages are authored. Stroke is live." />}
      <div style={{ display: "grid", gap: 10 }}>
        {symptoms.map((s) => (
          <div key={s} className="card" tabIndex={0} role="button"
            onClick={() => go("condition", { conditionId: SYMPTOM_INDEX[s][0] })}
            onKeyDown={(ev) => ev.key === "Enter" && go("condition", { conditionId: SYMPTOM_INDEX[s][0] })}
            style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 15 }}>{s}</span>
            <span style={{ fontSize: 12, color: C.sub }}>
              {SYMPTOM_INDEX[s].length} condition{SYMPTOM_INDEX[s].length > 1 ? "s" : ""} <ArrowRight size={13} style={{ verticalAlign: "middle" }} />
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function CategoryList({ go }) {
  const count = (catId) => Object.values(CONDITIONS).filter((c) => c.category === catId).length;
  return (
    <>
      <Back go={go} to={{ screen: "home" }} label="Back to explore" />
      <Crumb>EXPLORE BY NEUROLOGICAL CHALLENGE</Crumb>
      <h2 className="fr" style={{ fontSize: 30, margin: "0 0 24px" }}>Browse by category</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="card" tabIndex={0} role="button"
            onClick={() => go("category", { categoryId: cat.id })}
            onKeyDown={(ev) => ev.key === "Enter" && go("category", { categoryId: cat.id })}
            style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, padding: 22 }}>
            <h3 className="fr" style={{ fontSize: 19, margin: "0 0 6px" }}>{cat.label}</h3>
            <div style={{ color: C.sub, fontSize: 13 }}>{count(cat.id)} condition{count(cat.id) > 1 ? "s" : ""}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function ConditionsInCategory({ go, categoryId }) {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  const conds = Object.values(CONDITIONS).filter((c) => c.category === categoryId);
  return (
    <>
      <Back go={go} to={{ screen: "categories" }} label="Back to categories" />
      <Crumb>{cat.label.toUpperCase()}</Crumb>
      <h2 className="fr" style={{ fontSize: 30, margin: "0 0 24px" }}>Select a condition</h2>
      <div style={{ display: "grid", gap: 10 }}>
        {conds.map((c) => (
          <div key={c.id} className="card" tabIndex={0} role="button"
            onClick={() => go("condition", { conditionId: c.id })}
            onKeyDown={(ev) => ev.key === "Enter" && go("condition", { conditionId: c.id })}
            style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 16 }}>{c.name}</span>
            <StatusPill status={c.status} />
          </div>
        ))}
      </div>
    </>
  );
}

function StatusPill({ status }) {
  const ready = status === "ready";
  return (
    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: ready ? C.accentDim + "33" : C.panelSoft, color: ready ? C.accent : C.sub, border: `1px solid ${ready ? C.accentDim : C.line}` }}>
      {ready ? "Full page" : "In progress"}
    </span>
  );
}

function AllTherapies({ go }) {
  return (
    <>
      <Back go={go} to={{ screen: "home" }} label="Back to explore" />
      <Crumb>ALL TREATMENT TYPES</Crumb>
      <h2 className="fr" style={{ fontSize: 30, margin: "0 0 8px" }}>Every treatment in the repository</h2>
      <p style={{ color: C.sub, marginBottom: 24 }}>Treatments are shared across conditions — one therapy may address several challenges.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
        {Object.values(THERAPIES).map((t) => {
          const usedIn = Object.values(CONDITIONS).filter((c) => c.therapies.includes(t.id)).length;
          return (
            <div key={t.id} className="card" tabIndex={0} role="button"
              onClick={() => go("therapy", { therapyId: t.id })}
              onKeyDown={(ev) => ev.key === "Enter" && go("therapy", { therapyId: t.id })}
              style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 11, color: C.sub, marginBottom: 6 }}>{t.type.toUpperCase()}</div>
              <h3 className="fr" style={{ fontSize: 17, margin: "0 0 10px", lineHeight: 1.25 }}>{t.name}</h3>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <EvidenceTag level={t.evidence} />
                <span style={{ fontSize: 12, color: C.sub }}>· used in {usedIn} condition{usedIn > 1 ? "s" : ""}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function EvidenceTag({ level }) {
  const col = EVIDENCE_COLOR[level] || C.sub;
  return (
    <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 20, background: col + "22", color: col, border: `1px solid ${col}55` }}>
      {level} evidence
    </span>
  );
}

function ConditionDetail({ go, conditionId }) {
  const c = CONDITIONS[conditionId];
  const cat = CATEGORIES.find((x) => x.id === c.category);
  const therapies = c.therapies.map((id) => THERAPIES[id]).filter(Boolean);
  const centers = c.centers.map((id) => CENTERS[id]).filter(Boolean);

  return (
    <>
      <Back go={go} to={{ screen: "category", payload: { categoryId: c.category } }} label={`Back to ${cat.label}`} />
      <Crumb>{cat.label.toUpperCase()}</Crumb>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h2 className="fr" style={{ fontSize: 34, margin: "0 0 6px" }}>{c.name}</h2>
        <StatusPill status={c.status} />
      </div>

      {c.status !== "ready" && !c.overview && (
        <Empty text="This condition page is in progress. It uses the same structure as Stroke and will fill in as content is authored." />
      )}

      {c.overview && (
        <p style={{ color: C.ink, fontSize: 16, lineHeight: 1.7, maxWidth: 720, marginTop: 10 }}>{c.overview}</p>
      )}

      {c.symptoms?.length > 0 && (
        <Section icon={Activity} title="Common symptoms">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {c.symptoms.map((s) => (
              <span key={s} style={{ background: C.panelSoft, border: `1px solid ${C.line}`, borderRadius: 20, padding: "6px 14px", fontSize: 13 }}>{s}</span>
            ))}
          </div>
        </Section>
      )}

      {therapies.length > 0 && (
        <Section icon={Brain} title={`Neuroplasticity treatments (${therapies.length})`}>
          <div style={{ display: "grid", gap: 10 }}>
            {therapies.map((t) => (
              <div key={t.id} className="card" tabIndex={0} role="button"
                onClick={() => go("therapy", { therapyId: t.id })}
                onKeyDown={(ev) => ev.key === "Enter" && go("therapy", { therapyId: t.id })}
                style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.5 }}>{t.summary}</div>
                  </div>
                  <ArrowRight size={18} color={C.accent} style={{ flexShrink: 0, marginTop: 4 }} />
                </div>
                <div style={{ marginTop: 10 }}><EvidenceTag level={t.evidence} /></div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {centers.length > 0 && (
        <Section icon={MapPin} title="Rehabilitation centers">
          <div style={{ display: "grid", gap: 10 }}>
            {centers.map((ctr) => (
              <div key={ctr.id} style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{ctr.name}</div>
                <div style={{ fontSize: 13, color: C.sub, marginTop: 4, display: "flex", gap: 6, alignItems: "center" }}>
                  <MapPin size={13} /> {ctr.location} · {ctr.focus}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {c.docUrl && (
        <a href={c.docUrl} target="_blank" rel="noreferrer" className="lnk"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, marginTop: 28, textDecoration: "none" }}>
          Source document <ExternalLink size={13} />
        </a>
      )}
    </>
  );
}

function TherapyDetail({ go, therapyId }) {
  const t = THERAPIES[therapyId];
  const conds = Object.values(CONDITIONS).filter((c) => c.therapies.includes(t.id));
  return (
    <>
      <Back go={go} to={{ screen: "therapies" }} label="Back to all treatments" />
      <Crumb>{t.type.toUpperCase()}</Crumb>
      <h2 className="fr" style={{ fontSize: 32, margin: "0 0 12px", maxWidth: 720 }}>{t.name}</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        <EvidenceTag level={t.evidence} />
        <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: C.panelSoft, border: `1px solid ${C.line}`, color: C.sub }}>{t.modality}</span>
      </div>
      <p style={{ fontSize: 16, lineHeight: 1.7, maxWidth: 720, color: C.ink }}>{t.summary}</p>

      <Section icon={Layers} title="Conditions this treatment addresses">
        <div style={{ display: "grid", gap: 10 }}>
          {conds.map((c) => (
            <div key={c.id} className="card" tabIndex={0} role="button"
              onClick={() => go("condition", { conditionId: c.id })}
              onKeyDown={(ev) => ev.key === "Enter" && go("condition", { conditionId: c.id })}
              style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 15 }}>{c.name}</span>
              <ArrowRight size={16} color={C.accent} />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <section style={{ marginTop: 34 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Icon size={18} color={C.accent} />
        <h3 className="fr" style={{ fontSize: 20, margin: 0 }}>{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Empty({ text }) {
  return (
    <div style={{ background: C.panel, border: `1px dashed ${C.line}`, borderRadius: 12, padding: 20, color: C.sub, fontSize: 14, marginTop: 16, display: "flex", gap: 10, alignItems: "center" }}>
      <CheckCircle2 size={18} color={C.accentDim} /> {text}
    </div>
  );
}

/* ============================================================================
   SUPABASE SCHEMA — run once in the Supabase SQL editor to create the backend.
   Then paste your project URL + anon key into the config block near the top.
   Row-Level Security is enabled with public READ only, so the anon key is safe
   to ship in the client. Writes happen through the Supabase dashboard or an
   authenticated admin tool.
   ----------------------------------------------------------------------------

   create table categories (
     id text primary key,
     label text not null,
     sort int default 0
   );

   create table therapies (
     id text primary key,
     name text not null,
     type text,
     summary text,
     evidence text,          -- 'Strong' | 'Moderate–Strong' | 'Moderate' | 'Emerging'
     modality text
   );

   create table centers (
     id text primary key,
     name text not null,
     location text,
     focus text
   );

   create table conditions (
     id text primary key,
     name text not null,
     category text references categories(id),
     status text default 'draft',   -- 'ready' | 'draft'
     overview text,
     "docUrl" text
   );

   -- symptoms belong to one condition, ordered; composite key makes seeds re-runnable
   create table condition_symptoms (
     condition_id text references conditions(id) on delete cascade,
     symptom text not null,
     sort int default 0,
     primary key (condition_id, symptom)
   );

   -- many-to-many: a therapy can span multiple conditions
   create table condition_therapies (
     condition_id text references conditions(id) on delete cascade,
     therapy_id text references therapies(id) on delete cascade,
     primary key (condition_id, therapy_id)
   );

   create table condition_centers (
     condition_id text references conditions(id) on delete cascade,
     center_id text references centers(id) on delete cascade,
     primary key (condition_id, center_id)
   );

   -- enable public read-only access
   alter table categories          enable row level security;
   alter table therapies           enable row level security;
   alter table centers             enable row level security;
   alter table conditions          enable row level security;
   alter table condition_symptoms  enable row level security;
   alter table condition_therapies enable row level security;
   alter table condition_centers   enable row level security;

   create policy "public read" on categories          for select using (true);
   create policy "public read" on therapies           for select using (true);
   create policy "public read" on centers             for select using (true);
   create policy "public read" on conditions          for select using (true);
   create policy "public read" on condition_symptoms  for select using (true);
   create policy "public read" on condition_therapies for select using (true);
   create policy "public read" on condition_centers   for select using (true);

   ----------------------------------------------------------------------------
   The SEED_* objects above are the exact data to load in first — they double as
   both the offline fallback and a ready-made seed set for the tables.
   ========================================================================== */
