import { Intent } from './intent'

export const Colors = {
  WHITE: '#FFF',
  RED: '#ED1515',
  PINK: '#ff077f',
  GREEN: '#26ff8a',
  ORANGE: '#d9822b',
  DARK_GRAY_1: '#1f1f1f',
  DARK_GRAY_2: '#2a2a2a',
  DARK_GRAY_3: '#363636',
  DARK_GRAY_5: '#494949',
  TEXT_MUTED: '#8a9ba8'
}

export const IntentColors: { [i in Intent]: string } = {
  none: 'inherit',
  primary: 'inherit',
  success: Colors.GREEN,
  warning: Colors.ORANGE,
  danger: Colors.RED
}
