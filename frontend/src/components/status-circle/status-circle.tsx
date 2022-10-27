type StatusCircleProps = {
  background: string
  blinking?: boolean
}

export const StatusCircle = ({ background, blinking }: StatusCircleProps) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-block',
    width: 11,
    height: 11,
    borderRadius: '50%',
    marginRight: 5,
    background
  }

  return (
    <span
      className={blinking ? 'blink' : undefined}
      style={{ ...baseStyles }}
    />
  )
}
