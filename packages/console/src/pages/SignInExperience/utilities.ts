import en from '@logto/phrases-ui/lib/locales/en';
import {
  SignInExperience,
  SignInMethodKey,
  SignInMethods,
  SignInMethodState,
  SignInMode,
  Translation,
} from '@logto/schemas';
import { conditional } from '@silverhand/essentials';

import { SignInExperienceForm } from './types';

const findMethodState = (
  setup: SignInExperienceForm,
  method: keyof SignInMethods
): SignInMethodState => {
  const { signInMethods } = setup;

  if (signInMethods.primary === method) {
    return SignInMethodState.Primary;
  }

  if (!signInMethods.enableSecondary) {
    return SignInMethodState.Disabled;
  }

  if (signInMethods[method]) {
    return SignInMethodState.Secondary;
  }

  return SignInMethodState.Disabled;
};

export const signInExperienceParser = {
  toLocalForm: (signInExperience: SignInExperience): SignInExperienceForm => {
    const methodKeys = Object.values(SignInMethodKey);
    const primaryMethod = methodKeys.find(
      (key) => signInExperience.signInMethods[key] === SignInMethodState.Primary
    );
    const secondaryMethods = methodKeys.filter(
      (key) => signInExperience.signInMethods[key] === SignInMethodState.Secondary
    );

    const { signInMode } = signInExperience;

    return {
      ...signInExperience,
      signInMethods: {
        primary: primaryMethod,
        enableSecondary: secondaryMethods.length > 0,
        username: secondaryMethods.includes(SignInMethodKey.Username),
        sms: secondaryMethods.includes(SignInMethodKey.Sms),
        email: secondaryMethods.includes(SignInMethodKey.Email),
        social: secondaryMethods.includes(SignInMethodKey.Social),
      },
      createAccountEnabled: signInMode !== SignInMode.SignIn,
    };
  },
  toRemoteModel: (setup: SignInExperienceForm): SignInExperience => {
    const { branding, createAccountEnabled } = setup;

    return {
      ...setup,
      branding: {
        ...branding,
        // Transform empty string to undefined
        darkLogoUrl: conditional(branding.darkLogoUrl?.length && branding.darkLogoUrl),
        slogan: conditional(branding.slogan?.length && branding.slogan),
      },
      signInMethods: {
        username: findMethodState(setup, 'username'),
        sms: findMethodState(setup, 'sms'),
        email: findMethodState(setup, 'email'),
        social: findMethodState(setup, 'social'),
      },
      signInMode: createAccountEnabled ? SignInMode.SignInAndRegister : SignInMode.SignIn,
    };
  },
};

export const compareSignInMethods = (
  before: SignInExperience,
  after: SignInExperience
): boolean => {
  if (before.socialSignInConnectorTargets.length !== after.socialSignInConnectorTargets.length) {
    return false;
  }

  if (
    before.socialSignInConnectorTargets.some(
      (target) => !after.socialSignInConnectorTargets.includes(target)
    )
  ) {
    return false;
  }

  const { signInMethods: beforeMethods } = before;
  const { signInMethods: afterMethods } = after;

  return Object.values(SignInMethodKey).every((key) => beforeMethods[key] === afterMethods[key]);
};

export const flattenTranslation = (
  translation: Translation,
  keyPrefix = ''
): Record<string, string> =>
  Object.keys(translation).reduce((result, key) => {
    const prefix = keyPrefix ? `${keyPrefix}.` : keyPrefix;
    const unwrappedKey = `${prefix}${key}`;
    const unwrapped = translation[key];

    return unwrapped === undefined
      ? result
      : {
          ...result,
          ...(typeof unwrapped === 'string'
            ? { [unwrappedKey]: unwrapped }
            : flattenTranslation(unwrapped, unwrappedKey)),
        };
  }, {});

const emptyTranslation = (translation: Translation): Translation =>
  Object.entries(translation).reduce((result, [key, value]) => {
    return typeof value === 'string'
      ? { ...result, [key]: '' }
      : {
          ...result,
          [key]: emptyTranslation(value),
        };
  }, {});

export const createEmptyUiTranslation = () => emptyTranslation(en.translation);
