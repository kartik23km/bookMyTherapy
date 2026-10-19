import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTag, updateTag, deleteTag } from "../../store/slices/sessionsSlice";
import { showToast } from "../../store/slices/uiSlice";
import AdminLayout from "../../components/layout/AdminLayout";
import { Plus, Edit, Trash2, X, Check, Tag } from "lucide-react";

export default function AdminTagsPage() {
  const dispatch = useDispatch();
  const { tags, sessions } = useSelector((s) => s.sessions);
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({
    label: "",
    slug: "",
    emoji: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  const getSessionCount = (tagId) =>
    sessions.filter((s) => s.tags.includes(tagId)).length;

  const handleSubmit = () => {
    const errs = {};
    if (!form.label.trim()) errs.label = "Label is required";
    if (!form.slug.trim()) errs.slug = "Slug is required";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (editingTag) {
      dispatch(updateTag({ ...editingTag, ...form }));
      dispatch(showToast({ message: "Tag updated!", type: "success" }));
    } else {
      dispatch(addTag({ id: form.slug, ...form, count: 0 }));
      dispatch(showToast({ message: "Tag created!", type: "success" }));
    }
    resetForm();
  };

  const resetForm = () => {
    setForm({ label: "", slug: "", emoji: "", description: "" });
    setErrors({});
    setShowForm(false);
    setEditingTag(null);
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setForm({
      label: tag.label,
      slug: tag.slug,
      emoji: tag.emoji || "",
      description: tag.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = (tag) => {
    dispatch(deleteTag(tag.id));
    dispatch(
      showToast({ message: `"${tag.label}" tag deleted.`, type: "info" }),
    );
    setDeleteConfirm(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-boldtext-text-primary">
              What can sessions help with?
            </h1>
            <p className="text-text-secondary text-sm mt-0.5">
              Manage the concern tags used to categorise sessions.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xlbg-primary text-white text-sm font-semibold hover:bg-[#356B5F] transition-colors"
          >
            <Plus size={16} />
            Add Tag
          </button>
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-border p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semiboldtext-text-primary">
                {editingTag ? "Edit Tag" : "New Tag"}
              </h2>
              <button
                onClick={resetForm}
                className="p-1.5 rounded-lg text-muted hover:bg-[#F5F8F7]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semiboldtext-text-primary mb-1.5">
                  Label <span className="text-[#C96A6A]">*</span>
                </label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, label: e.target.value }))
                  }
                  placeholder="e.g. Social Anxiety"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                    errors.label
                      ? "border-[#C96A6A]"
                      : "border-border focus:border-[#4F8A7A]"
                  }`}
                />
                {errors.label && (
                  <p className="text-xs text-[#C96A6A] mt-1">{errors.label}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semiboldtext-text-primary mb-1.5">
                  Slug <span className="text-[#C96A6A]">*</span>
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    }))
                  }
                  placeholder="e.g. social-anxiety"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors font-mono ${
                    errors.slug
                      ? "border-[#C96A6A]"
                      : "border-border focus:border-[#4F8A7A]"
                  }`}
                />
                {errors.slug && (
                  <p className="text-xs text-[#C96A6A] mt-1">{errors.slug}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semiboldtext-text-primary mb-1.5">
                  Emoji
                </label>
                <input
                  type="text"
                  value={form.emoji}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, emoji: e.target.value }))
                  }
                  placeholder="e.g. 🤝"
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-[#4F8A7A]"
                />
              </div>
              <div>
                <label className="block text-sm font-semiboldtext-text-primary mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Short description"
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-[#4F8A7A]"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl border border-border text-smtext-text-primary font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xlbg-primary text-white text-sm font-semibold"
              >
                <Check size={15} />
                {editingTag ? "Update Tag" : "Create Tag"}
              </button>
            </div>
          </div>
        )}

        {/* Tags grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => {
            const sessionCount = getSessionCount(tag.id);
            return (
              <div
                key={tag.id}
                className="bg-white rounded-2xl border border-border p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{tag.emoji || "🏷"}</span>
                    <div>
                      <h3 className="font-semiboldtext-text-primary text-sm">
                        {tag.label}
                      </h3>
                      <code className="text-xs text-muted">{tag.slug}</code>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => handleEdit(tag)}
                      className="p-1.5 rounded-lg text-text-secondary hover:bg-[#F5F8F7] hover:text-primary transition-colors"
                    >
                      <Edit size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(tag)}
                      className="p-1.5 rounded-lg text-text-secondary hover:bg-red-50 hover:text-[#C96A6A] transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                {tag.description && (
                  <p className="text-xs text-text-secondary mb-3">
                    {tag.description}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <Tag size={11} />
                  <span>
                    {sessionCount} session{sessionCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-boldtext-text-primary mb-2">
              Delete tag?
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              Are you sure you want to delete{" "}
              <strong>"{deleteConfirm.label}"</strong>? Sessions using this tag
              will be unaffected.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl border border-border text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 rounded-xl bg-error text-white text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
