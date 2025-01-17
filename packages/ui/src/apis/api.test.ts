import {
  verifyForgotPasswordEmailPasscode,
  verifyForgotPasswordSmsPasscode,
} from './forgot-password';
import { verifyRegisterEmailPasscode, verifyRegisterSmsPasscode } from './register';
import { verifySignInEmailPasscode, verifySignInSmsPasscode } from './sign-in';
import { getVerifyPasscodeApi } from './utils';

describe('api', () => {
  it('getVerifyPasscodeApi', () => {
    expect(getVerifyPasscodeApi('register', 'sms')).toBe(verifyRegisterSmsPasscode);
    expect(getVerifyPasscodeApi('register', 'email')).toBe(verifyRegisterEmailPasscode);
    expect(getVerifyPasscodeApi('sign-in', 'sms')).toBe(verifySignInSmsPasscode);
    expect(getVerifyPasscodeApi('sign-in', 'email')).toBe(verifySignInEmailPasscode);
    expect(getVerifyPasscodeApi('forgot-password', 'email')).toBe(
      verifyForgotPasswordEmailPasscode
    );
    expect(getVerifyPasscodeApi('forgot-password', 'sms')).toBe(verifyForgotPasswordSmsPasscode);
  });
});
