export const RegExp = {
  REACT_APP_REGEX: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
  REACT_APP_EMAILREGEX: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
  REACT_APP_UPPERCASEREGEX: /(?=.*?[A-Z])/,
  REACT_APP_LOWERCASEREGEX: /(?=.*?[a-z])/,
  REACT_APP_DIGITSREGEX: /(?=.*?[0-9])/,
  REACT_APP_SPECIALCHARREGEX: /(?=.*?[#?!@$%^&*-])/,
  REACT_APP_MINLENGTHREGEX: /.{8,}/,
  REACT_APP_SPECIALCHAR: /(?=.*?[#?!@$%^&*-])/,
  REACT_APP_DECIMALREGEX: /^[0-9]+(\.[0-9]+)?(-[0-9]+(\.[0-9]+)*)?$/,
};
