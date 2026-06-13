import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Search,
  Download,
  Flame,
  Thermometer,
  Snowflake,
  ChevronDown,
  X,
  Loader2,
  Eye,
  Trash2,
  StickyNote,
  RefreshCw,
  Users,
  TrendingUp,
  Filter,
  Plane,
  Building2,
  Plus,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
type Lead = {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  age: number | null;
  pilotGoal: string | null;
  seriousness: string | null;
  spokenToSchool: string | null;
  preferredRoute: string | null;
  openToAbroad: string | null;
  fundingMethod: string | null;
  budgetRange: string | null;
  wantsFinanceInfo: string | null;
  educationLevel: string | null;
  class1Medical: string | null;
  flyingExperience: string | null;
  rightToWorkStudy: string | null;
  biggestConcern: string | null;
  startTimeframe: string | null;
  wantsSchoolContact: string | null;
  consentToContact: boolean;
  consentToShare: boolean;
  writtenAnswer: string | null;
  aiSummary: string | null;
  aiRoadmap: string | null;
  leadScore: number;
  leadCategory: "Hot" | "Warm" | "Cold";
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

const STATUSES = ["New", "Reviewed", "Contacted", "Sent to School", "School Interested", "Not Suitable", "Converted", "Archived"];

function CategoryBadge({ category }: { category: string }) {
  if (category === "Hot") return <span className="badge-hot"><Flame className="w-3 h-3" /> Hot</span>;
  if (category === "Warm") return <span className="badge-warm"><Thermometer className="w-3 h-3" /> Warm</span>;
  return <span className="badge-cold"><Snowflake className="w-3 h-3" /> Cold</span>;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "New": "bg-blue-50 text-blue-700 border-blue-100",
    "Reviewed": "bg-purple-50 text-purple-700 border-purple-100",
    "Contacted": "bg-yellow-50 text-yellow-700 border-yellow-100",
    "Sent to School": "bg-orange-50 text-orange-700 border-orange-100",
    "School Interested": "bg-green-50 text-green-700 border-green-100",
    "Not Suitable": "bg-gray-50 text-gray-600 border-gray-100",
    "Converted": "bg-emerald-50 text-emerald-700 border-emerald-100",
    "Archived": "bg-gray-50 text-gray-500 border-gray-100",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors[status] ?? "bg-gray-50 text-gray-600 border-gray-100"}`}>
      {status}
    </span>
  );
}

// ─── Lead Detail Modal ────────────────────────────────────────────────────────
function LeadDetailModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const utils = trpc.useUtils();
  const [newNote, setNewNote] = useState("");
  const [newStatus, setNewStatus] = useState(lead.status);

  const detailQuery = trpc.admin.getLead.useQuery({ id: lead.id });

  const updateStatus = trpc.admin.updateLeadStatus.useMutation({
    onSuccess: () => {
      utils.admin.listLeads.invalidate();
      toast.success("Status updated");
    },
  });

  const addNote = trpc.admin.addNote.useMutation({
    onSuccess: () => {
      setNewNote("");
      detailQuery.refetch();
      toast.success("Note added");
    },
  });

  const deleteLead = trpc.admin.deleteLead.useMutation({
    onSuccess: () => {
      utils.admin.listLeads.invalidate();
      onClose();
      toast.success("Lead deleted");
    },
  });

  const handleStatusChange = (status: string) => {
    setNewStatus(status);
    updateStatus.mutate({ id: lead.id, status: status as "New" | "Reviewed" | "Contacted" | "Sent to School" | "School Interested" | "Not Suitable" | "Converted" | "Archived" });
  };

  const fields: { label: string; value: string | number | null | undefined }[] = [
    { label: "Email", value: lead.email },
    { label: "Phone", value: lead.phone },
    { label: "Country", value: lead.country },
    { label: "City", value: lead.city },
    { label: "Age", value: lead.age },
    { label: "Pilot goal", value: lead.pilotGoal },
    { label: "Seriousness", value: lead.seriousness },
    { label: "Spoken to school", value: lead.spokenToSchool },
    { label: "Preferred route", value: lead.preferredRoute },
    { label: "Open to abroad", value: lead.openToAbroad },
    { label: "Funding method", value: lead.fundingMethod },
    { label: "Budget range", value: lead.budgetRange },
    { label: "Wants finance info", value: lead.wantsFinanceInfo },
    { label: "Education", value: lead.educationLevel },
    { label: "Class 1 Medical", value: lead.class1Medical },
    { label: "Flying experience", value: lead.flyingExperience },
    { label: "Right to work/study", value: lead.rightToWorkStudy },
    { label: "Biggest concern", value: lead.biggestConcern },
    { label: "Start timeframe", value: lead.startTimeframe },
    { label: "Wants school contact", value: lead.wantsSchoolContact },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <div>
            <h2 className="font-display font-bold text-xl text-[var(--color-navy)]">{lead.fullName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <CategoryBadge category={lead.leadCategory} />
              <span className="text-sm text-[var(--color-muted-foreground)]">Score: {lead.leadScore}/100</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--color-muted)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-foreground)] mb-2">Lead status</label>
            <select
              value={newStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:border-[var(--color-primary)] outline-none"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* AI Summary */}
          {lead.aiSummary && (
            <div className="p-4 rounded-xl bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm font-semibold text-[var(--color-primary)]">AI Summary</span>
              </div>
              <p className="text-sm text-[var(--color-foreground)] leading-relaxed">{lead.aiSummary}</p>
            </div>
          )}

          {/* Written answer */}
          {lead.writtenAnswer && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-foreground)] mb-2">Written answer</h4>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed p-3 bg-[var(--color-muted)] rounded-lg">{lead.writtenAnswer}</p>
            </div>
          )}

          {/* Details grid */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Lead details</h4>
            <div className="grid grid-cols-2 gap-2">
              {fields.map((f) => f.value ? (
                <div key={f.label} className="p-2 rounded-lg bg-[var(--color-muted)]">
                  <div className="text-xs text-[var(--color-muted-foreground)]">{f.label}</div>
                  <div className="text-sm font-medium text-[var(--color-foreground)] mt-0.5">{String(f.value)}</div>
                </div>
              ) : null)}
            </div>
          </div>

          {/* Consent */}
          <div className="flex gap-4">
            <div className={`flex items-center gap-1.5 text-xs ${lead.consentToContact ? "text-green-700" : "text-red-600"}`}>
              {lead.consentToContact ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              Consent to contact
            </div>
            <div className={`flex items-center gap-1.5 text-xs ${lead.consentToShare ? "text-green-700" : "text-gray-500"}`}>
              {lead.consentToShare ? <CheckCircle2 className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              Consent to share
            </div>
          </div>

          {/* Notes */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Admin notes</h4>
            {detailQuery.data?.notes.map((note) => (
              <div key={note.id} className="p-3 rounded-lg bg-[var(--color-muted)] mb-2">
                <p className="text-sm text-[var(--color-foreground)]">{note.note}</p>
                <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note…"
                className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:border-[var(--color-primary)] outline-none"
                onKeyDown={(e) => e.key === "Enter" && newNote.trim() && addNote.mutate({ leadId: lead.id, note: newNote })}
              />
              <button
                onClick={() => newNote.trim() && addNote.mutate({ leadId: lead.id, note: newNote })}
                disabled={!newNote.trim() || addNote.isPending}
                className="btn-primary text-sm py-2 px-4"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[var(--color-border)]">
          <button
            onClick={() => {
              if (confirm("Delete this lead? This cannot be undone.")) {
                deleteLead.mutate({ id: lead.id });
              }
            }}
            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Delete lead
          </button>
          <button onClick={onClose} className="btn-outline text-sm py-2 px-4">Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── School Management Modal ──────────────────────────────────────────────────
function SchoolModal({ onClose }: { onClose: () => void }) {
  const utils = trpc.useUtils();
  const schoolsQuery = trpc.admin.listSchools.useQuery();
  const [form, setForm] = useState({
    name: "", country: "", city: "", airport: "", courses: "",
    integratedAtpl: false, modularAtpl: false, ppl: false,
    priceRange: "", financeAvailable: "unknown" as "yes" | "no" | "unknown",
    accommodationAvailable: "unknown" as "yes" | "no" | "unknown",
    airlinePartnerships: "", website: "", contactEmail: "", phone: "",
    description: "", active: true,
  });

  const createSchool = trpc.admin.createSchool.useMutation({
    onSuccess: () => {
      utils.admin.listSchools.invalidate();
      toast.success("School added");
      setForm({ name: "", country: "", city: "", airport: "", courses: "", integratedAtpl: false, modularAtpl: false, ppl: false, priceRange: "", financeAvailable: "unknown", accommodationAvailable: "unknown", airlinePartnerships: "", website: "", contactEmail: "", phone: "", description: "", active: true });
    },
  });

  const toggleActive = trpc.admin.updateSchool.useMutation({
    onSuccess: () => utils.admin.listSchools.invalidate(),
  });

  const deleteSchool = trpc.admin.deleteSchool.useMutation({
    onSuccess: () => utils.admin.listSchools.invalidate(),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <h2 className="font-display font-bold text-xl text-[var(--color-navy)]">Flight School Management</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--color-muted)]"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Add school form */}
          <div>
            <h3 className="font-display font-semibold text-[var(--color-navy)] mb-4">Add new school</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "name", label: "School name *", placeholder: "e.g. Oxford Aviation Academy" },
                { key: "country", label: "Country", placeholder: "e.g. United Kingdom" },
                { key: "city", label: "City", placeholder: "e.g. Oxford" },
                { key: "airport", label: "Airport", placeholder: "e.g. EGTK" },
                { key: "priceRange", label: "Price range", placeholder: "e.g. £80,000–£100,000" },
                { key: "website", label: "Website", placeholder: "https://..." },
                { key: "contactEmail", label: "Contact email", placeholder: "info@school.com" },
                { key: "phone", label: "Phone", placeholder: "+44..." },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-[var(--color-muted-foreground)] mb-1">{f.label}</label>
                  <input
                    type="text"
                    value={(form as Record<string, unknown>)[f.key] as string}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:border-[var(--color-primary)] outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="mt-3">
              <label className="block text-xs font-semibold text-[var(--color-muted-foreground)] mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:border-[var(--color-primary)] outline-none resize-none"
              />
            </div>
            <div className="flex flex-wrap gap-4 mt-3">
              {[
                { key: "integratedAtpl", label: "Integrated ATPL" },
                { key: "modularAtpl", label: "Modular ATPL" },
                { key: "ppl", label: "PPL" },
              ].map((f) => (
                <label key={f.key} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(form as Record<string, unknown>)[f.key] as boolean}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.checked }))}
                    className="w-4 h-4 accent-[var(--color-primary)]"
                  />
                  {f.label}
                </label>
              ))}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-[var(--color-muted-foreground)]">Finance:</label>
                <select
                  value={form.financeAvailable}
                  onChange={(e) => setForm((p) => ({ ...p, financeAvailable: e.target.value as "yes" | "no" | "unknown" }))}
                  className="px-2 py-1 rounded border border-[var(--color-border)] text-xs"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => form.name.trim() && createSchool.mutate(form)}
              disabled={!form.name.trim() || createSchool.isPending}
              className="btn-primary text-sm mt-4"
            >
              {createSchool.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add School
            </button>
          </div>

          {/* Existing schools */}
          <div>
            <h3 className="font-display font-semibold text-[var(--color-navy)] mb-3">Existing schools ({schoolsQuery.data?.length ?? 0})</h3>
            <div className="space-y-2">
              {schoolsQuery.data?.map((school) => (
                <div key={school.id} className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)]">
                  <div>
                    <div className="text-sm font-semibold text-[var(--color-navy)]">{school.name}</div>
                    <div className="text-xs text-[var(--color-muted-foreground)]">{school.country} · {school.active ? "Active" : "Inactive"}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive.mutate({ id: school.id, active: !school.active })}
                      className={`text-xs px-2 py-1 rounded border font-medium transition-colors ${school.active ? "border-green-200 text-green-700 hover:bg-green-50" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                    >
                      {school.active ? "Active" : "Inactive"}
                    </button>
                    <button
                      onClick={() => confirm("Delete this school?") && deleteSchool.mutate({ id: school.id })}
                      className="p-1.5 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {schoolsQuery.data?.length === 0 && (
                <p className="text-sm text-[var(--color-muted-foreground)] text-center py-4">No schools added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [country, setCountry] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showSchools, setShowSchools] = useState(false);
  const [page, setPage] = useState(1);

  const filters = { search, category: category || undefined, status: status || undefined, country: country || undefined, page, pageSize: 50 };
  const leadsQuery = trpc.admin.listLeads.useQuery(filters, { enabled: isAuthenticated && user?.role === "admin" });
  const exportQuery = trpc.admin.exportLeads.useQuery(undefined, { enabled: false });

  const handleExport = useCallback(async () => {
    const result = await exportQuery.refetch();
    if (!result.data) return;
    const leads = result.data;
    const headers = ["ID", "Name", "Email", "Phone", "Country", "City", "Age", "Goal", "Route", "Budget", "Score", "Category", "Status", "Created"];
    const rows = leads.map((l) => [
      l.id, l.fullName, l.email, l.phone ?? "", l.country ?? "", l.city ?? "", l.age ?? "",
      l.pilotGoal ?? "", l.preferredRoute ?? "", l.budgetRange ?? "",
      l.leadScore, l.leadCategory, l.status,
      new Date(l.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pilotpath-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  }, [exportQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-subtle">
        <div className="card-base p-8 text-center max-w-sm">
          <Plane className="w-10 h-10 text-[var(--color-primary)] mx-auto mb-4" />
          <h2 className="font-display font-bold text-xl text-[var(--color-navy)] mb-2">Admin access required</h2>
          <p className="text-sm text-[var(--color-muted-foreground)] mb-4">Please sign in to access the admin dashboard.</p>
          <a href={getLoginUrl()} className="btn-primary w-full justify-center">Sign in</a>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-subtle">
        <div className="card-base p-8 text-center max-w-sm">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
          <h2 className="font-display font-bold text-xl text-[var(--color-navy)] mb-2">Access denied</h2>
          <p className="text-sm text-[var(--color-muted-foreground)]">You do not have admin privileges.</p>
        </div>
      </div>
    );
  }

  const leads = leadsQuery.data?.items ?? [];
  const total = leadsQuery.data?.total ?? 0;
  const hotCount = leads.filter((l) => l.leadCategory === "Hot").length;
  const warmCount = leads.filter((l) => l.leadCategory === "Warm").length;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-[var(--color-navy)]">Lead Dashboard</h1>
            <p className="text-sm text-[var(--color-muted-foreground)]">{total} total leads</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSchools(true)} className="btn-outline text-sm py-2 px-4">
              <Building2 className="w-4 h-4" />
              Schools
            </button>
            <button onClick={handleExport} className="btn-primary text-sm py-2 px-4">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total leads", value: total, icon: <Users className="w-5 h-5" />, color: "text-[var(--color-primary)]" },
            { label: "Hot leads", value: hotCount, icon: <Flame className="w-5 h-5" />, color: "text-[var(--color-hot)]" },
            { label: "Warm leads", value: warmCount, icon: <Thermometer className="w-5 h-5" />, color: "text-[var(--color-warm)]" },
            { label: "Conversion rate", value: total > 0 ? `${Math.round((leads.filter((l) => l.status === "Converted").length / total) * 100)}%` : "0%", icon: <TrendingUp className="w-5 h-5" />, color: "text-green-600" },
          ].map((stat) => (
            <div key={stat.label} className="card-base p-4">
              <div className={`${stat.color} mb-2`}>{stat.icon}</div>
              <div className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-[var(--color-muted-foreground)]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card-base p-4 mb-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search name, email, country…"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:border-[var(--color-primary)] outline-none"
              />
            </div>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:border-[var(--color-primary)] outline-none"
            >
              <option value="">All categories</option>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
            </select>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:border-[var(--color-primary)] outline-none"
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input
              type="text"
              value={country}
              onChange={(e) => { setCountry(e.target.value); setPage(1); }}
              placeholder="Filter by country…"
              className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:border-[var(--color-primary)] outline-none"
            />
            {(search || category || status || country) && (
              <button
                onClick={() => { setSearch(""); setCategory(""); setStatus(""); setCountry(""); setPage(1); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Lead table */}
        <div className="card-base overflow-hidden">
          {leadsQuery.isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-10 h-10 text-[var(--color-muted-foreground)] mx-auto mb-3" />
              <p className="font-display font-semibold text-[var(--color-navy)]">No leads found</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">Adjust your filters or wait for new submissions.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
                    {["Name", "Country", "Goal", "Budget", "Score", "Category", "Status", "Date", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-[var(--color-border)] hover:bg-[var(--color-muted)]/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedLead(lead as Lead)}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-[var(--color-navy)]">{lead.fullName}</div>
                        <div className="text-xs text-[var(--color-muted-foreground)]">{lead.email}</div>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-muted-foreground)]">{lead.country ?? "—"}</td>
                      <td className="px-4 py-3 text-[var(--color-muted-foreground)] max-w-32 truncate">{lead.pilotGoal ?? "—"}</td>
                      <td className="px-4 py-3 text-[var(--color-muted-foreground)] whitespace-nowrap">{lead.budgetRange ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-[var(--color-navy)]">{lead.leadScore}</span>
                        <span className="text-xs text-[var(--color-muted-foreground)]">/100</span>
                      </td>
                      <td className="px-4 py-3"><CategoryBadge category={lead.leadCategory} /></td>
                      <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                      <td className="px-4 py-3 text-xs text-[var(--color-muted-foreground)] whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedLead(lead as Lead); }}
                          className="p-1.5 rounded hover:bg-[var(--color-primary-light)] transition-colors"
                        >
                          <Eye className="w-4 h-4 text-[var(--color-primary)]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {total > 50 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)]">
              <span className="text-xs text-[var(--color-muted-foreground)]">
                Showing {(page - 1) * 50 + 1}–{Math.min(page * 50, total)} of {total}
              </span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="btn-outline text-xs py-1 px-3 disabled:opacity-40">Prev</button>
                <button disabled={page * 50 >= total} onClick={() => setPage((p) => p + 1)} className="btn-outline text-xs py-1 px-3 disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedLead && <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />}
      {showSchools && <SchoolModal onClose={() => setShowSchools(false)} />}
    </DashboardLayout>
  );
}
