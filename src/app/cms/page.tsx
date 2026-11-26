"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import {
  FileText,
  Plus,
  Check,
  Edit3,
  Trash2,
  Tag,
  FolderTree,
  Image as ImageIcon,
  HelpCircle,
  FileCode,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
} from "lucide-react";

interface PromptItem {
  id: string;
  category: string;
  promptText: string;
  usageCount: number;
  status: "Active" | "Draft";
}

interface InterestItem {
  id: string;
  name: string;
  category: string;
  icon?: string;
  status: "Active" | "Draft";
  popularity: string;
}

interface BannerItem {
  id: string;
  title: string;
  placement: "Discovery Header" | "Matches Screen" | "Profile Upgrade";
  ctaText: string;
  status: "Active" | "Draft";
  impressions: string;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "Billing" | "Privacy & Safety" | "Matching" | "Account";
  status: "Active" | "Draft";
}

interface StaticPageItem {
  id: string;
  slug: string;
  title: string;
  lastUpdated: string;
  status: "Active" | "Draft";
}

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<
    "prompts" | "interests" | "categories" | "banners" | "faqs" | "static"
  >("prompts");

  // Prompts State
  const [prompts, setPrompts] = useState<PromptItem[]>([
    { id: "p1", category: "First Date", promptText: "The quickest way to my heart is...", usageCount: 42100, status: "Active" },
    { id: "p2", category: "Humor", promptText: "My most irrational fear has to be...", usageCount: 38400, status: "Active" },
    { id: "p3", category: "Lifestyle", promptText: "On a typical Sunday morning you can find me...", usageCount: 51200, status: "Active" },
    { id: "p4", category: "Deep Talk", promptText: "A green flag I always look for in a partner...", usageCount: 33700, status: "Active" },
    { id: "p5", category: "First Date", promptText: "Best street food spot in my city is...", usageCount: 29800, status: "Active" },
    { id: "p6", category: "Humor", promptText: "Two truths and a lie: Dating edition...", usageCount: 46200, status: "Active" },
  ]);

  // Interests State
  const [interests, setInterests] = useState<InterestItem[]>([
    { id: "i1", name: "Filter Coffee", category: "Food & Drink", status: "Active", popularity: "Very High" },
    { id: "i2", name: "Indie Music", category: "Culture", status: "Active", popularity: "High" },
    { id: "i3", name: "Weekend Hiking", category: "Fitness", status: "Active", popularity: "Medium" },
    { id: "i4", name: "Dogs & Puppies", category: "Pets", status: "Active", popularity: "Very High" },
    { id: "i5", name: "Sci-Fi Books", category: "Literature", status: "Active", popularity: "Medium" },
    { id: "i6", name: "Anime & Manga", category: "Entertainment", status: "Active", popularity: "High" },
    { id: "i7", name: "Street Photography", category: "Creative", status: "Active", popularity: "High" },
    { id: "i8", name: "Gourmet Cooking", category: "Food & Drink", status: "Active", popularity: "Medium" },
  ]);

  // Categories State
  const [categories, setCategories] = useState([
    { id: "c1", name: "First Date", icon: "Coffee", count: 18, status: "Active" },
    { id: "c2", name: "Humor & Quirks", icon: "Smile", count: 24, status: "Active" },
    { id: "c3", name: "Lifestyle & Routine", icon: "Sun", count: 16, status: "Active" },
    { id: "c4", name: "Deep Talk & Values", icon: "Heart", count: 22, status: "Active" },
    { id: "c5", name: "Travel & Adventure", icon: "Compass", count: 14, status: "Active" },
  ]);

  // Banners State
  const [banners, setBanners] = useState<BannerItem[]>([
    { id: "b1", title: "Diwali Spark Match Boost: 50% Off VIP", placement: "Discovery Header", ctaText: "Claim Discount", status: "Active", impressions: "1.2M views" },
    { id: "b2", title: "Identity Verification: Get Your Blue Tick", placement: "Matches Screen", ctaText: "Verify Now", status: "Active", impressions: "840K views" },
    { id: "b3", title: "Weekend Speed Dating Live Room", placement: "Profile Upgrade", ctaText: "Join Queue", status: "Draft", impressions: "0 views" },
  ]);

  // FAQs State
  const [faqs, setFaqs] = useState<FaqItem[]>([
    { id: "f1", question: "How does the mutual matching algorithm work?", answer: "When two users both swipe right on each other's card, a match is instantly created and a direct messaging channel unlocks.", category: "Matching", status: "Active" },
    { id: "f2", question: "What is the blue verification badge and how do I get it?", answer: "Users must upload a government ID (Aadhaar or PAN) and take a live selfie. Our moderation team verifies biometric alignment within 2 hours.", category: "Privacy & Safety", status: "Active" },
    { id: "f3", question: "Can I cancel my subscription at any time?", answer: "Yes. In Account Settings > Subscriptions, you can cancel auto-renewal anytime without penalty.", category: "Billing", status: "Active" },
    { id: "f4", question: "How can I request permanent deletion of my profile?", answer: "Go to Settings > Account > Privacy & Data and submit a deletion request. All personal photos and messages will be scrubbed within 48 hours.", category: "Account", status: "Active" },
  ]);

  // Static Pages State
  const [staticPages, setStaticPages] = useState<StaticPageItem[]>([
    { id: "s1", slug: "/terms-of-service", title: "Terms of Service Agreement", lastUpdated: "Oct 15, 2025", status: "Active" },
    { id: "s2", slug: "/privacy-policy", title: "Comprehensive Privacy Policy", lastUpdated: "Oct 20, 2025", status: "Active" },
    { id: "s3", slug: "/community-guidelines", title: "Community Safety & Zero-Tolerance Policy", lastUpdated: "Oct 22, 2025", status: "Active" },
    { id: "s4", slug: "/cookie-policy", title: "Cookie & Tracking Disclosure", lastUpdated: "Sep 12, 2025", status: "Active" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleTogglePrompt = (id: string) => {
    setPrompts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "Active" ? "Draft" : "Active" } : p
      )
    );
    showToast("Prompt visibility updated.");
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
    showToast("Prompt deleted.");
  };

  const handleCreatePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newP: PromptItem = {
      id: `p_${Date.now()}`,
      category: "First Date",
      promptText: newTitle,
      usageCount: 0,
      status: "Active",
    };
    setPrompts([newP, ...prompts]);
    setModalOpen(false);
    setNewTitle("");
    showToast("New profile prompt published!");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="CMS / Content Management"
          description="Curate onboarding profile prompts, interests catalogue, promotion banners, community guidelines, and support FAQs."
          actions={
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-xs font-semibold text-white flex items-center gap-2 shadow-md shadow-pink-500/20 hover:opacity-90 transition-opacity"
            >
              <Plus size={15} />
              Add Content Item
            </button>
          }
        />

        {toast && (
          <div className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between">
            <span>{toast}</span>
            <button onClick={() => setToast(null)}>✕</button>
          </div>
        )}

        {/* CMS Category Tabs */}
        <div className="flex border-b border-[#263247] gap-2 overflow-x-auto scrollbar-thin pb-px">
          {[
            { id: "prompts", label: "Profile Prompts", icon: <FileText size={14} /> },
            { id: "interests", label: "Interests & Hobbies", icon: <Tag size={14} /> },
            { id: "categories", label: "Categories", icon: <FolderTree size={14} /> },
            { id: "banners", label: "App Banners", icon: <ImageIcon size={14} /> },
            { id: "faqs", label: "FAQs", icon: <HelpCircle size={14} /> },
            { id: "static", label: "Static Pages", icon: <FileCode size={14} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-pink-500 text-white bg-pink-500/10 rounded-t-xl"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Profile Prompts */}
        {activeTab === "prompts" && (
          <div className="bg-[#151F30] border border-[#263247] rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-[#263247] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Active Profile Prompts Bank
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Questions displayed to users when constructing their dating profiles.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {prompts.length} items
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-[#263247] text-slate-400 font-medium bg-[#0D1424]/40">
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Prompt Question</th>
                    <th className="py-3 px-4">Profile Usage</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#263247]/50">
                  {prompts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#0D1424] text-slate-300 border border-[#263247] text-[11px] font-medium">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        &quot;{p.promptText}&quot;
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {p.usageCount.toLocaleString()} answers
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={p.status} size="sm" dot />
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleTogglePrompt(p.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-[#263247]"
                        >
                          {p.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDeletePrompt(p.id)}
                          className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors inline-flex items-center"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Interests & Hobbies */}
        {activeTab === "interests" && (
          <div className="bg-[#151F30] border border-[#263247] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Interests & Passion Tags Catalogue
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tags users can select during onboarding to enhance algorithm match compatibility.
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold font-mono">
                {interests.length} active tags
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {interests.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#0D1424] border border-[#263247] flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-white block text-xs">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {item.category} • {item.popularity}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setInterests((prev) =>
                        prev.map((i) =>
                          i.id === item.id
                            ? { ...i, status: i.status === "Active" ? "Draft" : "Active" }
                            : i
                        )
                      );
                      showToast(`Updated status for "${item.name}".`);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === "Active"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {item.status}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Categories */}
        {activeTab === "categories" && (
          <div className="bg-[#151F30] border border-[#263247] rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">
              Prompt & Match Categories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-[#0D1424] border border-[#263247] flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-semibold text-white text-xs">{c.name}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {c.count} items configured
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 text-[11px] font-bold">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: App Banners */}
        {activeTab === "banners" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {banners.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl bg-[#151F30] border border-[#263247] space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400 font-mono">
                        {b.placement}
                      </span>
                      <StatusBadge status={b.status} size="sm" dot />
                    </div>
                    <h4 className="font-bold text-white text-sm mt-2">{b.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">Button CTA: &quot;{b.ctaText}&quot;</p>
                  </div>
                  <div className="pt-3 border-t border-[#263247] flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">{b.impressions}</span>
                    <button
                      onClick={() => {
                        setBanners((prev) =>
                          prev.map((item) =>
                            item.id === b.id
                              ? { ...item, status: item.status === "Active" ? "Draft" : "Active" }
                              : item
                          )
                        );
                        showToast(`Banner visibility toggled.`);
                      }}
                      className="text-pink-400 hover:text-pink-300 font-medium"
                    >
                      {b.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: FAQs */}
        {activeTab === "faqs" && (
          <div className="bg-[#151F30] border border-[#263247] rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">
              In-App Help Center & FAQ Articles
            </h3>
            <div className="space-y-3">
              {faqs.map((f) => (
                <div
                  key={f.id}
                  className="p-4 rounded-xl bg-[#0D1424] border border-[#263247] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">
                      Q: {f.question}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#151F30] text-slate-400 text-[10px] font-mono">
                      {f.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {f.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Static Pages */}
        {activeTab === "static" && (
          <div className="bg-[#151F30] border border-[#263247] rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-[#263247]">
              <h3 className="text-sm font-semibold text-white">
                Legal Policies & Static Markdown Pages
              </h3>
            </div>
            <div className="divide-y divide-[#263247]/50">
              {staticPages.map((s) => (
                <div
                  key={s.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold text-white text-xs">{s.title}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Slug: {s.slug} • Last Updated: {s.lastUpdated}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={s.status} size="sm" />
                    <button
                      onClick={() => alert(`Opening markdown editor for ${s.title} (Frontend Demo)`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-[#263247]"
                    >
                      Edit Content
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Item Modal */}
        {modalOpen && (
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Publish New CMS Content"
            description="Add an item to the selected active platform category."
            footer={
              <>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreatePrompt}
                  className="px-4 py-2 text-xs rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:opacity-90"
                >
                  Publish Content
                </button>
              </>
            }
          >
            <form onSubmit={handleCreatePrompt} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Title / Content Text
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. My all-time favorite travel destination is..."
                  className="w-full px-3 py-2 bg-[#0D1424] border border-[#263247] rounded-xl text-slate-100 outline-none focus:border-pink-500"
                />
              </div>
            </form>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}
