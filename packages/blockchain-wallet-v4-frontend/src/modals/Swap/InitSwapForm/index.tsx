import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import React, { PureComponent } from 'react'

import {
  BalanceRow,
  FlexStartRow,
  IconBackground,
  Option,
  OptionTitle,
  OptionValue,
  StyledForm,
  TopText,
  TrendingIconRow
} from '../components'
import { Props as BaseProps, SuccessStateType } from '..'
import { Button, Icon, Text } from 'blockchain-info-components'
import { CoinType } from 'core/types'
import { compose } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { FlyoutWrapper } from 'components/Flyout'
import { getData } from './selectors'
import { InitSwapFormValuesType } from 'data/components/swap/types'
import { selectors } from 'data'
import CoinBalance from '../components/CoinBalance'
import VerifyIdentity from './VerifyIdentity'

class InitSwapForm extends PureComponent<InjectedFormProps<{}, Props> & Props> {
  state = {}

  componentDidMount () {
    this.props.swapActions.refreshAccounts()
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.swapActions.setStep({ step: 'ENTER_AMOUNT' })
  }

  getCustodialWallet = (accounts, coin: CoinType) => {
    return accounts[coin].filter(account => account.type === 'CUSTODIAL')[0]
  }

  render () {
    const { accounts, coins, userData, values } = this.props
    return userData.tiers && userData.tiers.current !== 0 ? (
      <>
        <FlyoutWrapper>
          <TopText spaceBetween marginBottom>
            <Icon name='arrow-switch-thick' color='blue600' size='24px' />
            <Icon
              name='close'
              color='grey600'
              role='button'
              cursor
              onClick={this.props.handleClose}
            />
          </TopText>
          <Text size='24px' color='grey900' weight={600}>
            <FormattedMessage id='copy.new_swap' defaultMessage='New Swap' />
          </Text>
          <Text
            size='16px'
            color='grey600'
            weight={500}
            style={{ marginTop: '10px' }}
          >
            {values?.BASE || values?.COUNTER ? (
              <FormattedMessage
                id='copy.select_swap_wallets'
                defaultMessage='Select the Wallet you want to Swap from and the crypto you want to receive.'
              />
            ) : (
              <FormattedMessage
                id='copy.instantly_exchange'
                defaultMessage='Instantly exchange your crypto into any currency we offer in your wallet.'
              />
            )}
          </Text>
        </FlyoutWrapper>
        <StyledForm onSubmit={this.handleSubmit}>
          <Field
            name='BASE'
            component={() => (
              <Option
                role='button'
                onClick={() =>
                  this.props.swapActions.setStep({
                    step: 'COIN_SELECTION',
                    options: {
                      side: 'BASE'
                    }
                  })
                }
              >
                {values?.BASE ? (
                  <>
                    <div>
                      <Text color='grey600' weight={500} size='14px'>
                        Swap From
                      </Text>
                      <OptionTitle>{values.BASE.label}</OptionTitle>
                      <OptionValue>
                        <BalanceRow>
                          <CoinBalance
                            account={values.BASE}
                            walletCurrency={this.props.walletCurrency}
                          />
                        </BalanceRow>
                      </OptionValue>
                    </div>
                    <Icon
                      name={coins[values.BASE.coin].icons.circleFilled}
                      color={coins[values.BASE.coin].colorCode}
                      size='32px'
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <Text color='grey600' weight={500} size='14px'>
                        Swap from
                      </Text>
                      <>
                        <OptionTitle>Select a Wallet</OptionTitle>
                        <OptionValue color='grey900'>
                          This is the crypto you send.
                        </OptionValue>
                      </>
                    </div>
                    <Icon name='chevron-right' size='20px' color='grey400' />
                  </>
                )}
              </Option>
            )}
          />
          <Field
            name='COUNTER'
            component={() => (
              <Option
                role='button'
                onClick={() =>
                  this.props.swapActions.setStep({
                    step: 'COIN_SELECTION',
                    options: {
                      side: 'COUNTER'
                    }
                  })
                }
              >
                {values?.COUNTER ? (
                  <>
                    <div>
                      <OptionValue>
                        <FormattedMessage
                          id='copy.receive_to'
                          defaultMessage='Receive to'
                        />
                      </OptionValue>
                      <OptionTitle color='grey900'>
                        {values.COUNTER.label}
                      </OptionTitle>
                      <OptionValue>
                        <BalanceRow>
                          <CoinBalance
                            account={values.COUNTER}
                            walletCurrency={this.props.walletCurrency}
                          />
                        </BalanceRow>
                      </OptionValue>
                    </div>
                    <Icon
                      name={coins[values.COUNTER.coin].icons.circleFilled}
                      color={coins[values.COUNTER.coin].colorCode}
                      size='32px'
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <Text color='grey600' weight={500} size='14px'>
                        <FormattedMessage
                          id='copy.receive_to'
                          defaultMessage='Receive to'
                        />
                      </Text>
                      <>
                        <OptionTitle>Select a Wallet</OptionTitle>
                        <OptionValue color='grey900'>
                          This is the crypto you get.
                        </OptionValue>
                      </>
                    </div>
                    <Icon name='chevron-right' size='20px' color='grey400' />
                  </>
                )}
              </Option>
            )}
          />
          <FlyoutWrapper>
            <Button
              nature='primary'
              data-e2e='continueSwap'
              type='submit'
              fullwidth
              jumbo
              disabled={!values?.BASE || !values?.COUNTER}
            >
              <FormattedMessage
                id='buttons.continue'
                defaultMessage='Continue'
              />
            </Button>
          </FlyoutWrapper>
          <>
            <Text
              color='grey600'
              weight={500}
              size='14px'
              style={{ margin: '0 0 8px 40px' }}
            >
              Trending
            </Text>
            <Field
              name='TRENDINGONE'
              component={() => (
                <Option
                  role='button'
                  onClick={() =>
                    this.props.swapActions.changeTrendingPair(
                      this.getCustodialWallet(accounts, 'BTC'),
                      this.getCustodialWallet(accounts, 'ETH')
                    )
                  }
                >
                  <FlexStartRow>
                    <TrendingIconRow>
                      <Icon
                        color='btc'
                        name='btc-circle-filled'
                        size='32px'
                        style={{ marginRight: '16px' }}
                      />
                      <IconBackground size='24px' position='absolute'>
                        <Icon
                          name='arrows-horizontal'
                          size='10px'
                          color='blue600'
                        />
                      </IconBackground>
                      <Icon color='eth' name='eth-circle-filled' size='32px' />
                    </TrendingIconRow>
                    <div>
                      <OptionTitle>Swap Bitcoin</OptionTitle>
                      <OptionValue>Receive Ethereum</OptionValue>
                    </div>
                  </FlexStartRow>
                  <Icon name='chevron-right' size='20px' color='grey400' />
                </Option>
              )}
            />
            <Field
              name='TRENDINGTWO'
              component={() => (
                <Option
                  role='button'
                  onClick={() =>
                    this.props.swapActions.changeTrendingPair(
                      this.getCustodialWallet(accounts, 'ETH'),
                      this.getCustodialWallet(accounts, 'BTC')
                    )
                  }
                >
                  <FlexStartRow>
                    <TrendingIconRow>
                      <Icon
                        color='eth'
                        name='eth-circle-filled'
                        size='32px'
                        style={{ marginRight: '16px' }}
                      />
                      <IconBackground size='24px' position='absolute'>
                        <Icon
                          name='arrows-horizontal'
                          size='10px'
                          color='blue600'
                        />
                      </IconBackground>
                      <Icon color='btc' name='btc-circle-filled' size='32px' />
                    </TrendingIconRow>
                    <div>
                      <OptionTitle>Swap Ethereum</OptionTitle>
                      <OptionValue>Receive Bitcoin</OptionValue>
                    </div>
                  </FlexStartRow>
                  <Icon name='chevron-right' size='20px' color='grey400' />
                </Option>
              )}
            />
            <Field
              name='TRENDINGTHREE'
              component={() => (
                <Option
                  role='button'
                  onClick={() =>
                    this.props.swapActions.changeTrendingPair(
                      this.getCustodialWallet(accounts, 'BTC'),
                      this.getCustodialWallet(accounts, 'PAX')
                    )
                  }
                >
                  <FlexStartRow>
                    <TrendingIconRow>
                      <Icon
                        color='btc'
                        name='btc-circle-filled'
                        size='32px'
                        style={{ marginRight: '16px' }}
                      />
                      <IconBackground size='24px' position='absolute'>
                        <Icon
                          name='arrows-horizontal'
                          size='10px'
                          color='blue600'
                        />
                      </IconBackground>
                      <Icon color='usd-d' name='usd-d' size='32px' />
                    </TrendingIconRow>
                    <div>
                      <OptionTitle>Swap BTC</OptionTitle>
                      <OptionValue>Receive USD Digital</OptionValue>
                    </div>
                  </FlexStartRow>
                  <Icon name='chevron-right' size='20px' color='grey400' />
                </Option>
              )}
            />
          </>
        </StyledForm>
      </>
    ) : (
      <VerifyIdentity {...this.props} />
    )
  }
}

const mapStateToProps = state => ({
  latestPendingSwapTrade: selectors.components.swap.getLatestPendingSwapTrade(
    state
  ),
  values: selectors.form.getFormValues('initSwap')(
    state
  ) as InitSwapFormValuesType,
  ...getData(state)
})

const connector = connect(mapStateToProps)

const enhance = compose(
  reduxForm<{}, Props>({ form: 'initSwap', destroyOnUnmount: false }),
  connector
)

type OwnProps = BaseProps & SuccessStateType & { handleClose: () => void }

export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(InitSwapForm) as React.ComponentClass<OwnProps>
