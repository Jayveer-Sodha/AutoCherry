# 🍒 AutoCherry - Smart Git Cherry-Picking in VS Code

**AutoCherry** helps you cherry-pick commits from pull requests across branches — directly inside **Visual Studio Code** — with zero need to touch the command line.

Supports **GitHub** and **Bitbucket** repositories. Fully OAuth-enabled. Intuitive. Clean. Fast.

---

## 🚀 Features

- ✅ OAuth login for GitHub and Bitbucket
- ✅ Fetch pull request commits with a PR number
- ✅ Select specific commits to cherry-pick
- ✅ Search for and validate target branches
- ✅ Perform cherry-pick across branches
- ✅ Detailed success, skip, and conflict messaging
- ✅ All within VS Code's side panel

---

## 🖼️ Screenshots

> _(Add screenshots for each step here — placeholders included below)_

1. **Authentication screen**
   ![auth](extension/assets/screens/authPage.png)

2. **Fetch PR and select commits**
   ![pr](assets/screens/pr.png)

3. **Target branch & cherry-pick results**
   ![result](assets/screens/result.png)

---

## 🧭 How It Works

### 1. **Authentication**

When you open the AutoCherry panel:

- Click either **GitHub** or **Bitbucket**.
- A browser popup will ask for permissions (OAuth).
- If successful: You'll see `"Connected to GitHub"` (or Bitbucket) on the panel.
- ❗ If authentication fails, an error appears below the buttons.
- ❌ If the current repo and selected provider mismatch (e.g., Bitbucket on a GitHub repo), an error is shown.

---

### 2. **Pull Request Fetch**

- Once authenticated:
  - You'll see a labeled field: **"Enter pull request number..."**
  - Enter a valid PR number and click **Fetch Commits**
  - ✅ If successful: PR details and commit list are shown
  - ❌ If failed: A red error message appears below the button

---

### 3. **Select Commits**

- Commit list includes:

  - 📝 Message
  - 🔢 Commit SHA
  - 🕒 Timestamp
  - ⬜️ Checkbox to select each commit

- Click **"Confirm Commits"** to proceed

---

### 4. **Target Branch Selection**

- Confirmed commits will be shown under **"Selected Commits"**
- Enter the target branch name in the new field: **"Enter branch name..."**
- Click **Search**
  - ✅ If found and not merged: displays target info like `Target Branch: new-ship-int-hotfix`
  - ❌ If not found or merged: error message shown

---

### 5. **Cherry-Pick Execution**

- When the target is validated, click **"Let's cherry pick"**
- You'll see one of the following results:

#### ✅ Success:
