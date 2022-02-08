export const Validation = {
  REQUIRED: 'Required',

  // Patterns
  URL: {
    value:
      // Complains about unnecessary escape character but I don't want to mess with it as
      // its copied from Stack Overflow
      // eslint-disable-next-line
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i,
    message: 'Invalid URL'
  },
  GOLANG_DURATION: {
    value: /[0-9]*h[0-9]*m[0-9]*s/,
    message: 'Format invalid. Expected format XhXmXs (e.g. 12h30m10s)'
  },

  // Numbers
  NUMBER_MIN_PORT: { value: 1, message: 'Port number must be greater than 1' },
  NUMBER_MAX_PORT: {
    value: 65535,
    message: 'Port number must be less than 65535'
  },
  NUMBER_MIN_GRPC_RETRIES: {
    value: 0,
    message: 'Retries cannot be less than 0'
  },
  NUMBER_MAX_GRPC_RETRIES: {
    value: 20,
    message: 'Retries cannot be more than 20'
  },

  // Custom logic
  match: (value: string | number | boolean) => ({
    message: 'Password does not match',
    value: new RegExp(`^${value}$`)
  })
}
