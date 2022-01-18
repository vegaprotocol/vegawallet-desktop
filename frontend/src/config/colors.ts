import { Intent } from './intent'

export const Colors = {
  VEGA_RED3: 'var(--vega-red3)',
  VEGA_GREEN3: 'var(--vega-green3)',
  VEGA_YELLOW3: 'var(--vega-yellow3)',
  VEGA_ORANGE3: 'var(--vega-orange3)',
  VEGA_BLUE3: 'var(--vega-blue3)',
  INTENT_SUCCESS: 'var(--intent-success)',
  INTENT_WARNING: 'var(--intent-warning)',
  INTENT_DANGER: 'var(--intent-danger)',
  BLACK: 'var(--black)',
  WHITE: 'var(--white)',
  DARK_GRAY_1: 'var(--dark-gray1)',
  DARK_GRAY_2: 'var(--dark-gray2)',
  DARK_GRAY_3: 'var(--dark-gray3)',
  DARK_GRAY_4: 'var(--dark-gray4)',
  DARK_GRAY_5: 'var(--drak-gray5)',
  GRAY_1: 'var(--gray1)',
  GRAY_2: 'var(--gray2)',
  GRAY_3: 'var(--gray3)',
  GRAY_4: 'var(--gray4)',
  GRAY_5: 'var(--gray5)',
  LIGHT_GRAY_1: 'var(--light-gray1)',
  LIGHT_GRAY_2: 'var(--light-gray2)',
  LIGHT_GRAY_3: 'var(--light-gray3)',
  LIGHT_GRAY_4: 'var(--light-gray4)',
  LIGHT_GRAY_5: 'var(--light-gray5)',
  TEXT_COLOR: 'var(--text-color)',
  TEXT_COLOR_DEEMPHASISE: 'var(--text-color-deemphasise)',
  TEXT_COLOR_EMPHASISE: 'var(--text-color-emphasise)'
}

export const IntentColors: { [i in Intent]: string } = {
  none: 'inherit',
  primary: 'inherit',
  success: Colors.INTENT_SUCCESS,
  warning: Colors.INTENT_WARNING,
  danger: Colors.INTENT_DANGER
}
