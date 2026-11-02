# 🔧 Web Portal Edit Functionality - Manual Implementation Guide

## Current Status
- ✅ `editingNote` state added to StaffNotesPage
- ❌ Edit functions need to be added manually
- ❌ UI updates need to be applied manually

---

## STEP 1: Add Edit Functions (After deleteNote function)

**Location**: After the `deleteNote` function (around line 1603)

**Add these three functions**:

```javascript
  function openEditModal(note) {
    setEditingNote(note);
    setForm({
      title: note.title || "",
      subjectId: note.subjectId?._id || note.subjectId || "",
      chapterId: note.chapterId?._id || note.chapterId || "",
      fileType: note.fileType || "pdf",
      fileUrl: note.fileUrl || "",
      body: note.body || "",
      isPublic: note.isPublic !== false,
      isPremium: note.isPremium === true
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingNote(null);
    setForm({ title: "", subjectId: "", chapterId: "", fileType: "pdf", fileUrl: "", body: "", isPublic: true, isPremium: false });
  }

  async function updateNote(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiRequest(`/notes/${editingNote._id}`, {
        method: "PUT",
        body: JSON.stringify(form)
      });
      setMsg({ text: "Study note updated successfully.", type: "success" });
      closeModal();
      load();
    } catch (err) {
      setMsg({ text: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  }
```

---

## STEP 2: Update createNote Function

**Find** (around line 1577):
```javascript
setMsg({ text: "Educational study material created successfully.", type: "success" });
setShowModal(false);
setForm({ title: "", subjectId: "", chapterId: "", fileType: "pdf", fileUrl: "", body: "", isPublic: true, isPremium: false });
load();
```

**Replace with**:
```javascript
setMsg({ text: "Educational study material created successfully.", type: "success" });
closeModal();
load();
```

---

## STEP 3: Add Edit Button in Table

**Find** (around line 1690):
```jsx
<button className="btn btn-sm btn-secondary" onClick={() => setViewingNote(n)}>
  Read
</button>
<button className="btn btn-sm btn-danger" onClick={() => deleteNote(n._id)}>
  Delete
</button>
```

**Replace with**:
```jsx
<button className="btn btn-sm btn-secondary" onClick={() => setViewingNote(n)}>
  Read
</button>
<button className="btn btn-sm btn-primary" onClick={() => openEditModal(n)}>
  Edit
</button>
<button className="btn btn-sm btn-danger" onClick={() => deleteNote(n._id)}>
  Delete
</button>
```

---

## STEP 4: Update Modal Component

**Find** (around line 1710):
```jsx
<Modal show={showModal} onClose={() => setShowModal(false)} title="Upload / Create Study Note">
  <form onSubmit={createNote}>
```

**Replace with**:
```jsx
<Modal show={showModal} onClose={closeModal} title={editingNote ? "Edit Study Note" : "Upload / Create Study Note"}>
  <form onSubmit={editingNote ? updateNote : createNote}>
```

---

## STEP 5: Update Modal Buttons

**Find** (around line 1785):
```jsx
<button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
  Cancel
</button>
<button type="submit" className="btn btn-primary" disabled={saving}>
  {saving ? "Publishing…" : "Publish Study Note"}
</button>
```

**Replace with**:
```jsx
<button type="button" className="btn btn-secondary" onClick={closeModal}>
  Cancel
</button>
<button type="submit" className="btn btn-primary" disabled={saving}>
  {saving ? (editingNote ? "Updating…" : "Publishing…") : (editingNote ? "Update Study Note" : "Publish Study Note")}
</button>
```

---

## Quick Edit Instructions

1. Open `Web/JavaScript/src/main.jsx` in your editor
2. Search for `async function deleteNote`
3. Add the three new functions after it
4. Make the 4 UI updates listed above
5. Save the file
6. Test locally with `npm run dev`
7. Commit and push

---

## Testing

After applying changes, test:
1. Click "Edit" button on any note
2. Modal should say "Edit Study Note"
3. Form should be pre-filled with note data
4. Make changes and click "Update Study Note"
5. Note should update successfully

