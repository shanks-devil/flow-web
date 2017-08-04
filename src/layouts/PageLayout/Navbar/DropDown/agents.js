import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { STATUS } from 'redux-http'
import autoCancel from 'react-redux-http'

import { actions } from 'redux/modules/agent'

import Loading from 'components/Loading'
import DropDown from './dropdown'

import classes from './agents.scss'

function mapStateToProps (state, props) {
  const { agent } = state
  return {
    agents: agent.get('data'),
    loaded: agent.getIn(['ui', 'query']) > STATUS.send,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: actions.query,
  }, dispatch)
}

export class AgentsDropDown extends PureComponent {
  static propTypes = {
    agents: ImmutablePropTypes.listOf(ImmutablePropTypes.contains({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      job: PropTypes.string,
    })),
    loaded: PropTypes.bool,

    query: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  componentDidMount () {
    const { query } = this.props
    query()
  }

  renderAgents () {
    const { i18n, agents } = this.props
    return <div>
      <div className={classes.header}>
        {i18n('Agent 状态机')}
      </div>
      <table className={classes.table}>
        <thead>
          <tr>
            <th className={classes.status}>{i18n('运行状态')}</th>
            <th className={classes.name}>{i18n('Agent')}</th>
            <th className={classes.job}>{i18n('任务')}</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => <tr key={agent.get('id')}>
            <td className={classes.statusCell}>
              <span className={`${classes.circle} ${agent.get('status')}`} />
            </td>
            <td>{agent.get('name')}</td>
            <td>{agent.get('job')}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  }

  renderEmpty () {
    const { i18n } = this.props
    return <div className={classes.paddingWrap}>
      {i18n('没有检测到 Agent')}
    </div>
  }

  renderContent () {
    const { agents } = this.props
    return agents.size ? this.renderAgents() : this.renderEmpty()
  }

  renderLoading () {
    return <div className={classes.paddingWrap}>
      <Loading />
    </div>
  }

  render () {
    const { loaded } = this.props
    return <DropDown className={classes.dropdown} arrowClass={classes.arrow}>
      {loaded ? this.renderContent() : this.renderLoading()}
    </DropDown>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['query'] })(AgentsDropDown)
)