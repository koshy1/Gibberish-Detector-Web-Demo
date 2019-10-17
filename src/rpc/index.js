// @flow
import {ResponseError} from 'fusion-plugin-rpc-redux-react';
import fetch from 'isomorphic-fetch';

export default {
  getNameValidities: async ({names, threshold}) => {
    try {
      const response = await fetch(
        `http://localhost:8080/gibberishScore${
          threshold ? `?threshold=${threshold}` : ''
        }`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            names,
          }),
        }
      );
      if (response.status == 200) {
        const json = await response.json();
        return json;
      }
      throw response.statusText;
    } catch (e) {
      throw new ResponseError('Gibberish detection service unavailable');
    }
  },
};
