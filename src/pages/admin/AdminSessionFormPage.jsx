import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addSession, updateSession } from "../../store/slices/sessionsSlice";
import { showToast } from "../../store/slices/uiSlice";
import AdminLayout from "../../components/layout/AdminLayout";
import { ArrowLeft, Save, Send, X, Check } from "lucide-react";

const MODES = ["Online", "In-Person", "Hybrid"];

const DEFAULT_FORM = {
  title: "",
  shortDescription: "",
  description: "",
  coverImage: "",
  tags: [],
  date: "",
  time: "",
  endTime: "",
  duration: 60,
  mode: "Online",
  location: "",
  price: "",
  totalSeats: "",
  status: "draft",
};

export default function AdminSessionFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sessions, tags } = useSelector((s) => s.sessions);

  const isEditing = !!id;
  const existingSession = id ? sessions.find((s) => s.id === id) : null;

  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing && existingSession) {
      setForm({
        title: existingSession.title || "",
        shortDescription: existingSession.shortDescription || "",
        description: existingSession.description || "",
        coverImage: existingSession.coverImage || "",
        tags: existingSession.tags || [],
        date: existingSession.date || "",
        time: existingSession.time || "",
        endTime: existingSession.endTime || "",
        duration: existingSession.duration || 60,
        mode: existingSession.mode || "Online",
        location: existingSession.location || "",
        price: existingSession.price || "",
        totalSeats: existingSession.totalSeats || "",
        status: existingSession.status || "active",
      });
    }
  }, [isEditing, existingSession]);

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const toggleTag = (tagId) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tagId)
        ? f.tags.filter((t) => t !== tagId)
        : [...f.tags, tagId],
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.shortDescription.trim())
      errs.shortDescription = "Short description is required";
    if (!form.date) errs.date = "Date is required";
    if (!form.time) errs.time = "Start time is required";
    if (!form.price) errs.price = "Price is required";
    if (!form.totalSeats) errs.totalSeats = "Capacity is required";
    if (form.tags.length === 0) errs.tags = "Select at least one tag";
    return errs;
  };

  const handleSave = (publish = false) => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      dispatch(
        showToast({
          message: "Please fill in all required fields.",
          type: "error",
        }),
      );
      return;
    }

    setIsSaving(true);
    const sessionData = {
      ...form,
      id: isEditing ? id : `sess-${Date.now()}`,
      price: Number(form.price),
      totalSeats: Number(form.totalSeats),
      bookedSeats: existingSession?.bookedSeats || 0,
      availableSeats:
        Number(form.totalSeats) - (existingSession?.bookedSeats || 0),
      status: publish ? "active" : "draft",
      coverImage:
        form.coverImage ||
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      availableSlots: existingSession?.availableSlots || [],
      bookedSlots: existingSession?.bookedSlots || [],
      whatToExpect: existingSession?.whatToExpect || [],
      whoIsItFor: existingSession?.whoIsItFor || "",
      featured: existingSession?.featured || false,
    };

    setTimeout(() => {
      if (isEditing) {
        dispatch(updateSession(sessionData));
        dispatch(
          showToast({
            message: "Session updated successfully!",
            type: "success",
          }),
        );
      } else {
        dispatch(addSession(sessionData));
        dispatch(
          showToast({
            message: publish ? "Session published!" : "Session saved as draft.",
            type: "success",
          }),
        );
      }
      setIsSaving(false);
      navigate("/admin/sessions");
    }, 800);
  };

  const Input = ({ label, field, type = "text", placeholder, required }) => (
    <div>
      <label className="block text-sm font-semiboldtext-text-primary mb-1.5">
        {label} {required && <span className="text-[#C96A6A]">*</span>}
      </label>
      <input
        type={type}
        value={form[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border text-smtext-text-primary placeholder:text-muted outline-none transition-colors ${
          errors[field]
            ? "border-[#C96A6A] bg-red-50"
            : "border-border bg-white focus:border-[#4F8A7A]"
        }`}
      />
      {errors[field] && (
        <p className="text-xs text-[#C96A6A] mt-1">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/admin/sessions")}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Back to sessions
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-boldtext-text-primary">
            {isEditing ? "Edit Session" : "Create Session"}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-bordertext-text-primary text-sm font-medium hover:border-[#4F8A7A] transition-colors disabled:opacity-50"
            >
              <Save size={15} />
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xlbg-primary text-white text-sm font-semibold hover:bg-[#356B5F] transition-colors disabled:opacity-60"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={15} />
              )}
              Publish Session
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic info */}
            <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
              <h2 className="font-semiboldtext-text-primary">
                Session Information
              </h2>
              <Input
                label="Session Title"
                field="title"
                placeholder="e.g. Understanding Social Anxiety"
                required
              />
              <div>
                <label className="block text-sm font-semiboldtext-text-primary mb-1.5">
                  Short Description <span className="text-[#C96A6A]">*</span>
                </label>
                <textarea
                  value={form.shortDescription}
                  onChange={(e) =>
                    handleChange("shortDescription", e.target.value)
                  }
                  placeholder="A brief 1-2 sentence description..."
                  rows={2}
                  className={`w-full px-4 py-3 rounded-xl border text-smtext-text-primary placeholder:text-muted outline-none transition-colors resize-none ${
                    errors.shortDescription
                      ? "border-[#C96A6A]"
                      : "border-border focus:border-[#4F8A7A]"
                  }`}
                />
                {errors.shortDescription && (
                  <p className="text-xs text-[#C96A6A] mt-1">
                    {errors.shortDescription}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semiboldtext-text-primary mb-1.5">
                  Full Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Detailed session description..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-border text-smtext-text-primary placeholder:text-muted outline-none focus:border-[#4F8A7A] transition-colors resize-none"
                />
              </div>
              <Input
                label="Cover Image URL"
                field="coverImage"
                placeholder="https://..."
              />
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semiboldtext-text-primary mb-1.5">
                What can this session help with?{" "}
                <span className="text-[#C96A6A]">*</span>
              </h2>
              <p className="text-xs text-text-secondary mb-4">
                Select all concerns this session addresses.
              </p>
              {errors.tags && (
                <p className="text-xs text-[#C96A6A] mb-3">{errors.tags}</p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tags.map((tag) => {
                  const selected = form.tags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
                        selected
                          ? "border-[#4F8A7A] bg-[#EBF2F0] text-primary"
                          : "border-border bg-white text-text-secondary hover:border-[#4F8A7A]"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                          selected ? "bg-primary" : "border border-[#C4D0CC]"
                        }`}
                      >
                        {selected && <Check size={10} className="text-white" />}
                      </div>
                      <span className="text-xs">
                        {tag.emoji} {tag.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Schedule */}
            <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
              <h2 className="font-semiboldtext-text-primary">Schedule</h2>
              <Input label="Date" field="date" type="date" required />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Start Time" field="time" type="time" required />
                <Input label="End Time" field="endTime" type="time" />
              </div>
              <div>
                <label className="block text-sm font-semiboldtext-text-primary mb-1.5">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) =>
                    handleChange("duration", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-[#4F8A7A] transition-colors"
                />
              </div>
            </div>

            {/* Session details */}
            <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
              <h2 className="font-semiboldtext-text-primary">
                Session Details
              </h2>
              <div>
                <label className="block text-sm font-semiboldtext-text-primary mb-1.5">
                  Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {MODES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleChange("mode", m)}
                      className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                        form.mode === m
                          ? "border-[#4F8A7A] bg-[#EBF2F0] text-primary"
                          : "border-border text-text-secondary hover:border-[#4F8A7A]"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              {form.mode !== "Online" && (
                <Input
                  label="Location"
                  field="location"
                  placeholder="City, Venue"
                />
              )}
              <Input
                label="Price (₹)"
                field="price"
                type="number"
                placeholder="799"
                required
              />
              <Input
                label="Total Capacity"
                field="totalSeats"
                type="number"
                placeholder="20"
                required
              />
              <div>
                <label className="block text-sm font-semiboldtext-text-primary mb-1.5">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-[#4F8A7A]"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
