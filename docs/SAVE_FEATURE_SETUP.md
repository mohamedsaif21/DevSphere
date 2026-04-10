# Code Save & View Feature Setup Guide

This guide explains how to set up the code save and view saved projects functionality in DevSphere.

## ✅ What's Implemented:

1. **Save Code Modal** - Beautiful modal to save code with title & description
2. **Saved Projects Page** - Dashboard to view, delete, and load saved code
3. **Database Integration** - Supabase table to persist code snippets
4. **User Context** - Each saved code is linked to the authenticated user
5. **Open & Continue** - Click saved project to continue editing in compiler

## 🚀 Setup Instructions:

### Step 1: Create Supabase Table

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click **"SQL Editor"** → **"New Query"**
4. Copy & paste the SQL from `/docs/database-schema.sql`
5. Click **"Run"** ✅

The SQL will:
- ✅ Create `saved_codes` table
- ✅ Add user_id foreign key
- ✅ Enable Row Level Security (RLS)
- ✅ Create security policies

### Step 2: Files Created/Updated

**New Files:**
- `types/savedCode.ts` - TypeScript interface for saved code
- `lib/savedCodeService.ts` - CRUD functions for saving/loading code
- `components/compiler/SaveCodeModal.tsx` - Modal component
- `app/saved-projects/page.tsx` - View all saved projects page
- `docs/database-schema.sql` - Database schema

**Updated Files:**
- `app/compiler/page.tsx` - Integrated save functionality
- `components/Navbar.tsx` - Added "Saved Projects" link

### Step 3: Test It Out

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Go to Compiler:**
   - Navigate to `/compiler`
   - Write some code

3. **Save Code:**
   - Click the 💾 **Save** button in the header
   - Enter title & optional description
   - Click **"Save Code"** ✅

4. **View Saved Projects:**
   - Click your profile in navbar
   - Select **"Saved Projects"**
   - See all your saved code snippets

5. **Open & Continue:**
   - Click any saved project
   - Code loads in compiler
   - Continue editing!

## 📁 File Structure:

```
app/
├── compiler/page.tsx          ← Save integration
├── saved-projects/page.tsx    ← View saved code
└── ...

components/
└── compiler/
    ├── SaveCodeModal.tsx      ← Save modal
    └── ...

lib/
├── supabase.ts                ← Auth functions
└── savedCodeService.ts        ← Save/Load functions

types/
└── savedCode.ts               ← TypeScript interface

docs/
└── database-schema.sql        ← Database setup
```

## 🔒 Security:

- ✅ Only authenticated users can save code
- ✅ Users can only view their own saved code
- ✅ Row Level Security (RLS) enforced at database level
- ✅ All operations require user_id checking

## 💡 Features:

| Feature | Status |
|---------|--------|
| Save code with title | ✅ Done |
| Add description (optional) | ✅ Done |
| View all saved projects | ✅ Done |
| Delete saved code | ✅ Done |
| Load saved code for editing | ✅ Done |
| Show creation date & line count | ✅ Done |
| Language color coding | ✅ Done |
| RLS protection | ✅ Done |

## 🔄 How It Works:

### Saving Code:
```
User clicks Save → Modal opens → Enters title & description
→ Calls saveCode() → Data sent to Supabase → Saved in database
```

### Loading Saved Projects:
```
Go to /saved-projects → Fetch user's saved codes from database
→ Display as cards → Click to load in compiler
```

### Opening Saved Code:
```
Click a project → Store in sessionStorage → Redirect to /compiler
→ Compiler loads code → Continue editing
```

## 📊 Database Schema:

```sql
saved_codes:
├── id (UUID, Primary Key)
├── user_id (UUID, FK to auth.users)
├── title (TEXT) ← Required
├── language (TEXT) ← Python, JavaScript, etc.
├── code (TEXT) ← Full code content
├── description (TEXT) ← Optional
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## 🐛 If Something Goes Wrong:

**Error: "Could not find the 'saved_codes' column"**
- → Table not created yet
- → Run the SQL from `docs/database-schema.sql`

**Error: "User not authenticated"**
- → Not logged in
- → Make sure you're logged in before saving

**Error: "Failed to save code"**
- → Check Supabase RLS policies
- → Check network tab in browser console
- → Verify user_id is set correctly

## 📝 Next Steps (Optional):

- Add code search / filtering
- Add code tags/categories
- Add public/private sharing
- Add collaborative editing
- Add version history
- Add starred/favorites

## 🎉 You're All Set!

Save button is now fully functional with persistent storage! 🚀
