import { ExtractSuccess, FiatType } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'

import { InitSwapFormValuesType, SwapAmountFormValues } from 'data/types'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const formErrors = selectors.form.getFormSyncErrors('swapAmount')(state)
  const formValues = selectors.form.getFormValues('swapAmount')(
    state
  ) as SwapAmountFormValues
  const initSwapFormValues = selectors.form.getFormValues('initSwap')(
    state
  ) as InitSwapFormValuesType
  const limitsR = selectors.components.swap.getLimits(state)
  const paymentR = selectors.components.swap.getPayment(state)
  const quoteR = selectors.components.swap.getQuote(state)
  const ratesR = selectors.core.data.misc.getRatesSelector(
    initSwapFormValues?.BASE?.coin || 'BTC',
    state
  )
  const walletCurrencyR = selectors.core.settings.getCurrency(state)
  return lift(
    (
      limits: ExtractSuccess<typeof limitsR>,
      quote: ExtractSuccess<typeof quoteR>,
      rates: ExtractSuccess<typeof ratesR>,
      walletCurrency: FiatType
    ) => ({
      formErrors,
      formValues,
      limits,
      payment: paymentR.getOrElse(undefined),
      rates,
      walletCurrency
    })
  )(limitsR, quoteR, ratesR, walletCurrencyR)
}
