import React from 'react'
import PropTypes from 'prop-types'
import TabMenuTransactionStatus from './template.js'

class TabMenuTransactionStatusContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(value) {
    this.props.input.onChange(value)
  }

  render() {
    return (
      <TabMenuTransactionStatus
        value={this.props.input.value}
        handleClick={this.handleClick}
        statuses={this.props.statuses}
      />
    )
  }
}

TabMenuTransactionStatusContainer.propTypes = {
  input: PropTypes.object.isRequired
}

export default TabMenuTransactionStatusContainer
