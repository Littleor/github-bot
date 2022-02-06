/**
 * @file PR 提示标题正确性
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const format = require('string-template')
const {getPkgCommitPrefix} = require('../../utils')
const {
  commentPullRequest,
  addLabelsToPullRequest,
  removeLabelsToPullRequest,
  pullRequestHasLabel
} = require('../../github')

const actions = getPkgCommitPrefix()
const match = title => {
  return actions.some(action => title.indexOf(`${action}:`) === 0)
}

const commentSuccess = [
  'Hi @{user}, Thank you very much for correcting the title format in time.'
].join('')

const commentError = [
  'Hi @{user}，Thanks for your PR.',
  'But there is something wrong with the title format.',
  'Please make sure the title is in the [following format](@{url}).',
  'We look forward to your editing of the title!'
].join('\n')

module.exports = on => {
  if (actions.length) {
    on('pull_request_opened', ({payload, repo}) => {
      if (!match(payload.pull_request.title)) {
        commentPullRequest(
          payload,
          format(commentError, {
            user: payload.pull_request.user.login,
            url: `https://github.com/${payload.repository.full_name}/blob/master/.github/contributing.md#pull-request-guidelines`
          })
        )

        addLabelsToPullRequest(payload, 'invalid')
      }
    })

    on('pull_request_edited', async ({payload, repo}) => {
      if (match(payload.pull_request.title) && await pullRequestHasLabel(payload, 'invalid')) {
        commentPullRequest(
          payload,
          format(commentSuccess, {
            user: payload.pull_request.user.login
          })
        )

        removeLabelsToPullRequest(payload, 'invalid')
      }
    })
  }
}
