import { useContext } from 'react';
import { ConfigContext } from '../context/config-context.tsx';
import { getApiHeaders, withRequestBody } from '../utils/common.ts';

export const useUser = () => {
  const { apiHost, apiUrl } = useContext(ConfigContext);

  const registerUser = async (
    email: string,
    firstName: string,
    lastName: string,
    firebaseId: string = 'test-firebase-id',
    firebaseToken: string = 'test-firebase-token'
  ) => {
    const registerUserRequest = withRequestBody(
      {
        email,
        firstName,
        lastName,
        firebaseId
      },
      'POST'
    );

    return registerUserRequest(`${apiHost}${apiUrl.user.create}`, {
      headers: getApiHeaders(firebaseToken)
    });
  };

  return { registerUser };
};
