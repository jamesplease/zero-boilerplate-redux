import token from '../personal-access-token.json';

// Basic Authentication for GitHub. Documentation for this is here:
// https://developer.github.com/v3/auth/#basic-authentication
const authorizationHeader = `${token.username}:${token.token}`;
const encodedHeader = btoa(authorizationHeader);

export default {
  Authorization: `Basic ${encodedHeader}`
};
