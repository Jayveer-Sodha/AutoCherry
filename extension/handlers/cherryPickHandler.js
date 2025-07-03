const { default: simpleGit } = require('simple-git');
const { sendToWebview } = require('./webviewHandler');
const { MESSAGE_TYPE } = require('../../shared/constants');
const { getRepoPath, getRemoteUrl, getBranchUrl } = require('../utils/commonUtils');

async function cherryPickHandler({ targetBranch, commits, provider, webview }) {
  const repoPath = await getRepoPath();
  const git = simpleGit(repoPath);

  const cherryPicked = [];
  const skipped = [];

  const sortCommits = commits => [...commits].sort((a, b) => new Date(a.date) - new Date(b.date));

  const isDuplicate = msg => /cherry-pick is now empty|duplicate of a commit|patch failed/i.test(msg);

  const isConflict = msg => /conflict|merge conflict/i.test(msg);

  const sendError = (type, payload) => sendToWebview({ webview, type, payload });

  const sendSuccess = async () => {
    const remoteUrl = await getRemoteUrl(repoPath);
    const branchUrl = getBranchUrl(remoteUrl, targetBranch, provider);

    const total = cherryPicked.length;
    const totalSkipped = skipped.length;

    let message = 'No commits cherry-picked or skipped.';
    if (total && totalSkipped) {
      message = `Cherry-picked ${total} and skipped ${totalSkipped} duplicate(s).`;
    } else if (total) {
      message = `Cherry-picked ${total} commit(s).`;
    } else if (totalSkipped) {
      message = `Skipped ${totalSkipped} duplicate commit(s).`;
    }

    sendToWebview({
      webview,
      type: MESSAGE_TYPE.CHERRY_PICK_SUCCESS,
      payload: {
        cherryPickSuccess: {
          commits: cherryPicked,
          branch: targetBranch,
          branchUrl,
          message: `${message} All changes pushed to "${targetBranch}".`,
        },
      },
    });
  };

  try {
    await git.fetch();
    await git.checkout(targetBranch);

    const ordered = sortCommits(commits);

    for (const commit of ordered) {
      const sha = typeof commit === 'string' ? commit : commit.sha;
      try {
        await git.raw(['cherry-pick', sha]);
        cherryPicked.push(sha);
      } catch (err) {
        const msg = err.message || '';

        if (isDuplicate(msg)) {
          await git.raw(['cherry-pick', '--skip']);
          skipped.push(sha);
          continue;
        }

        if (isConflict(msg)) {
          await git.raw(['cherry-pick', '--abort']);
          return sendError(MESSAGE_TYPE.CHERRY_PICK_ERROR, {
            cherryPickError: {
              sha,
              message: `Merge conflict on ${sha}. Please resolve it manually.`,
            },
          });
        }

        await git.raw(['cherry-pick', '--abort']);
        return sendError(MESSAGE_TYPE.CHERRY_PICK_ERROR, {
          cherryPickError: {
            sha,
            message: `Cherry-pick failed on ${sha}: ${msg}`,
          },
        });
      }
    }

    await git.push('origin', targetBranch);
    await sendSuccess();
  } catch (err) {
    sendError(MESSAGE_TYPE.CHERRY_PICK_ERROR, {
      message: `Unexpected error: ${err.message || err}`,
    });
  }
}

module.exports = { cherryPickHandler };
