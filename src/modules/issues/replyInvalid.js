/**
 * @file 不规范issue则自动关闭
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const format = require('string-template')
const {
  commentIssue,
  closeIssue,
  addLabelsToIssue
} = require('../../github')

const comment = [
  'Hi @{user},Thank you very much for your feedback.',
  'But because you didn\'t use the [issue template](./new/choose) to submit, it will be closed directly.',
  'Thank you!'
].join('\n')

function replyInvalid (on) {
  on('issues_opened', ({payload}) => {
    const issue = payload.issue
    const opener = issue.user.login
    if ((issue.body.match(/<!--\s*label:\s*(.+?)\s*-->/) || []).length === 0) {
      commentIssue(
        payload,
        format(comment, {
          user: opener
        })
      )

      closeIssue(payload)
      addLabelsToIssue(payload, 'invalid')
    }
  })
}

module.exports = replyInvalid
