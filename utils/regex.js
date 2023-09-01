const LINK_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{1,6}\b([-a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)$/;
const PASS_REGEX = /^[a-zA-Z0-9\-:._/?~#[\]@!$&'()*.;+=]*$/; // /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/;
module.exports = { LINK_REGEX, PASS_REGEX };
