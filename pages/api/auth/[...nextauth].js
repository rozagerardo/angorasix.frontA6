import NextAuth from 'next-auth';
import {
  oauthFrameworkConfig,
  oauthProviderConfig,
} from '../../../config/oauth';
import axios from 'axios';
import moment from 'moment';
import logger from '../../../utils/logger';

export const oauthCallbacksConfig = {
  async jwt({ token, user, account }) {
    if (account && user) {
      return {
        accessToken: account.access_token,
        accessTokenExpires: account.expires_at,
        refreshToken: account.refresh_token,
        user,
      };
    }
    // Return previous token if the access token has not expired yet
    if (moment().isBefore(moment.unix(token.accessTokenExpires))) {
      return token;
    }
    // Access token has expired, try to update it
    return {
      ...(await refreshAccessToken(token)),
      user: token.user,
    };
  },
  session({ session, token }) {
    session.accessToken = token.accessToken;
    session.user = token.user;
    session.error = token.error;
    return session;
  },
};

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  try {
    const params = new URLSearchParams();
    params.append('client_id', oauthProviderConfig.clientId);
    params.append('client_secret', oauthProviderConfig.clientSecret);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', token.refreshToken);
    const response = await axios.post(oauthProviderConfig.token, params);

    if (response.status >= 300) {
      throw new Error('Error refreshing token');
    }

    let accessTokenBody = response.data;
    return {
      accessToken: accessTokenBody.access_token,
      accessTokenExpires: moment().unix() + accessTokenBody.expires_in,
      refreshToken: accessTokenBody.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (err) {
    logger.error(err);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

const oauthConfig = {
  providers: [oauthProviderConfig],
  callbacks: oauthCallbacksConfig,
  ...oauthFrameworkConfig,
};

export default NextAuth(oauthConfig);
