const { default: simpleGit } = require('simple-git');
const { sendToWebview } = require('./webviewHandler');
const { BitbucketRepoService } = require('../services/bitbucketService');
const { getRepoPath, getRemoteUrl, getBranchUrl } = require('../utils/commonUtils');
const { BITBUCKET_TOKEN_KEY, MESSAGE_TYPE, AUTH_TYPE } = require('../../shared/constants');

async function fetchCommitsHandler({ prId, context, webview }) {
  const tokenData = context.globalState.get(BITBUCKET_TOKEN_KEY);
  const service = await BitbucketRepoService.create(tokenData.access_token);

  try {
    const { prDetails, prCommits } = await service.fetchPullRequestWithCommits(prId);
    console.log('PR Commits:', prDetails, prCommits);

    sendToWebview({
      webview,
      type: MESSAGE_TYPE.FETCH_COMMITS_SUCCESS,
      payload: { prDetails, prCommits },
    });
  } catch (err) {
    console.error('Commit fetch failed:', err.message);
    sendToWebview({
      webview,
      type: MESSAGE_TYPE.FETCH_COMMITS_ERROR,
      payload: {
        provider: AUTH_TYPE.BITBUCKET,
        commits: [],
        prId,
        error: err,
      },
    });
  }
}

async function fetchBranchDetailsHandler({ branchName, context, webview }) {
  const tokenData = context.globalState.get(BITBUCKET_TOKEN_KEY);
  const service = await BitbucketRepoService.create(tokenData.access_token);
  try {
    const isBranchAvailable = await service.isBranchAvailableAndNotMerged(branchName);
    console.warn({ isBranchAvailable });
    if (isBranchAvailable) {
      sendToWebview({
        webview,
        type: MESSAGE_TYPE.FETCH_BRANCH_SUCCESS,
        payload: {
          isBranchAvailable,
          branchName,
        },
      });
    }
  } catch (error) {
    sendToWebview({
      webview,
      type: MESSAGE_TYPE.FETCH_BRANCH_ERROR,
      payload: {
        isBranchAvailable: false,
        branchError: {
          branchName,
          message: error.message,
        },
      },
    });
  }
}

async function cherryPickCommits({ targetBranch, commits, provider, webview }) {
  const repoPath = await getRepoPath();
  const git = simpleGit(repoPath);

  try {
    await git.fetch();

    // Checkout the target branch
    await git.checkout(targetBranch);
    console.log(`✅ Checked out to ${targetBranch}`);

    const orderedCommits = [...commits].sort((a, b) => new Date(a.date) - new Date(b.date));

    const cherryPicked = [];

    for (const commit of orderedCommits) {
      const sha = typeof commit === 'string' ? commit : commit.sha;

      try {
        console.log(`🔁 Cherry-picking ${sha}`);
        await git.raw(['cherry-pick', sha]);
        cherryPicked.push(sha);
      } catch (err) {
        const errMessage = err.message || '';

        if (
          /The previous cherry-pick is now empty/i.test(errMessage) ||
          /is a duplicate of a commit already applied/i.test(errMessage) ||
          (/could not apply/i.test(errMessage) && errMessage.includes('patch failed'))
        ) {
          console.warn(`⚠️ Skipping duplicate commit ${sha}`);
          await git.raw(['cherry-pick', '--skip']);
          continue;
        }

        if (/conflict/i.test(errMessage) || /merge conflict/i.test(errMessage)) {
          console.error(`❌ Merge conflict while applying ${sha}`);
          await git.raw(['cherry-pick', '--abort']);
          sendToWebview({
            webview,
            type: MESSAGE_TYPE.CHERRY_PICK_ERROR,
            payload: {
              cherryPickError: {
                sha,
                message: `Merge conflict occurred while cherry-picking ${sha}. Please resolve conflicts manually.`,
              },
            },
          });
          return;
        }

        console.error(`❌ Cherry-pick failed on ${sha}:`, errMessage);
        await git.raw(['cherry-pick', '--abort']);
        sendToWebview({
          webview,
          type: MESSAGE_TYPE.CHERRY_PICK_ERROR,
          payload: {
            cherryPickError: {
              sha,
              message: `Cherry-pick failed on commit ${sha}: ${errMessage}`,
            },
          },
        });
        return;
      }
    }

    // All commits cherry-picked successfully
    console.log(`✅ All commits applied, pushing...`);
    await git.push('origin', targetBranch);

    // Get branch link for GitHub UI
    const remoteUrl = await getRemoteUrl(repoPath);
    const branchUrl = getBranchUrl(remoteUrl, targetBranch, provider);

    sendToWebview({
      webview,
      type: MESSAGE_TYPE.CHERRY_PICK_SUCCESS,
      payload: {
        cherryPickSuccess: {
          commits: cherryPicked,
          branch: targetBranch,
          branchUrl,
          message: `Successfully cherry-picked and pushed ${cherryPicked.length} commit(s).`,
        },
      },
    });
    console.warn({
      cherryPickSuccess: {
        commits: cherryPicked,
        branch: targetBranch,
        branchUrl,
        message: `Successfully cherry-picked and pushed ${cherryPicked.length} commit(s).`,
      },
    });
  } catch (err) {
    console.error('❌ Unexpected cherry-pick error:', err);
    sendToWebview({
      webview,
      type: MESSAGE_TYPE.CHERRY_PICK_ERROR,
      payload: {
        message: `Unexpected error: ${err.message || err}`,
      },
    });
  }
}

module.exports = { fetchCommitsHandler, fetchBranchDetailsHandler, cherryPickCommits };
