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

## 🧭 How It Works

### 1. **Authentication**

When you open the AutoCherry panel:

- Choose either **GitHub** or **Bitbucket** to authenticate.
- A browser tab will open for OAuth permissions.
- Once allowed, you'll be redirected back to VS Code.

📸 **Initial View (Choose Provider)**

![Auth Screen](extension/assets/screens/AuthCTA.png)

✅ **If successful**: You'll see a connection message like `Connected to GitHub`.

![Success](extension/assets/screens/AuthSuccess.png)

❌ **If authentication fails**: An error is shown below the buttons.

![Error](extension/assets/screens/AuthError.png)

❗ **If the repo host doesn’t match the provider selected** (e.g., Bitbucket selected for a GitHub repo), an error will appear too.

![Error](extension/assets/screens/WrongHostError.png)

---

### 2. **Pull Request Fetch**

After authentication, the next section prompts:

- Enter the pull request number in the field labeled: **“Enter pull request number...”**
- Click **Fetch Commits**

📸 **Fetch PR UI**
✅ **Success**: Shows PR info and commits

![PR Info](extension/assets/screens/SelectCommits.png)

❌ **Failure**: Shows a red error message below the button.

![Fetch PR Failure](extension/assets/screens/PullRequestSearchError.png)

---

### 3. **Select Commits**

If commits are found:

- A list appears titled: **“Please Select Commits”**
- Each item includes:

  - 📝 Commit message
  - 🆔 SHA
  - 🕒 Time
  - ⬜ Checkbox to select

📸 **Commit List**

![Select Commits](extension/assets/screens/SelectCommits.png)

Click **Confirm Commits** to move forward.

---

### 4. **Target Branch Selection**

Now you’ll see:

- A list of selected commits under **“Selected Commits”**
- A new input: **“Enter branch name...”** and a **Search** button

📸 **Selected Commits View**

![Selected Commits](extension/assets/screens/SelectedCommits.png)

✅ If branch exists and is valid:

- Info appears like: `Target Branch: new-ship-int-hotfix`

![Branch Exists](extension/assets/screens/CherryPickCTA.png)

❌ If not found or already merged:

- An error is shown.

📸 **Branch Not Found / Error Example**

![Branch Error](extension/assets/screens/BranchSearchError.png)

---

### 5. **Cherry-Pick Execution**

Once the target branch is found:

- Click **Let’s cherry pick** to begin
- Results will vary depending on outcome:

#### ✅ **Success: Commits Pushed**

Shows how many commits were cherry-picked and a link to the branch.

📸
![Cherry Pick Success](extension/assets/screens/CherryPickPushed.png)

#### 🔁 **Skipped: Duplicates**

If some commits already exist, they’ll be skipped.

📸
![Cherry Pick Skipped](extension/assets/screens/CherryPickSkipped.png)

#### ❌ **Merge Conflict**

If a conflict occurs, an error message appears.

📸
![Merge Conflict Error](extension/assets/screens/CherryPickMergeError.png)

---
