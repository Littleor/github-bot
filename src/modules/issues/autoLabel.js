/**
 * @file 自动根据创建的 issue 内标识创建对应 label
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const {addLabelsToIssue} = require('../../github')
const {appLog} = require('../../logger')

function autoAssign (on) {
  on('issues_opened', ({payload, repo}) => {
    appLog.log('payload', payload)
    appLog.log('repo', repo)

    const label = (payload.issue.body.match(/<!--\s*label:\s*(.+?)\s*-->/) || [])[1]
    if (label) {
      addLabelsToIssue(payload, label)
    }
  })
}

module.exports = autoAssign
