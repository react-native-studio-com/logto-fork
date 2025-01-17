import { isBuiltInLanguageTag } from '@logto/phrases-ui';
import { adminConsoleApplicationId, adminConsoleSignInExperience } from '@logto/schemas/lib/seeds';
import { Provider } from 'oidc-provider';

import detectLanguage from '@/i18n/detect-language';
import { getPhrase } from '@/lib/phrase';
import { findAllCustomLanguageTags } from '@/queries/custom-phrase';
import { findDefaultSignInExperience } from '@/queries/sign-in-experience';

import { AnonymousRouter } from './types';

const getLanguageInfo = async (applicationId: unknown) => {
  if (applicationId === adminConsoleApplicationId) {
    return adminConsoleSignInExperience.languageInfo;
  }

  const { languageInfo } = await findDefaultSignInExperience();

  return languageInfo;
};

export default function phraseRoutes<T extends AnonymousRouter>(router: T, provider: Provider) {
  router.get('/phrase', async (ctx, next) => {
    const interaction = await provider
      .interactionDetails(ctx.req, ctx.res)
      // Should not block when failed to get interaction
      .catch(() => null);

    const applicationId = interaction?.params.client_id;
    const { autoDetect, fallbackLanguage } = await getLanguageInfo(applicationId);

    const detectedLanguages = autoDetect ? detectLanguage(ctx) : [];
    const acceptableLanguages = [...detectedLanguages, fallbackLanguage];
    const customLanguages = await findAllCustomLanguageTags();
    const language =
      acceptableLanguages.find(
        (tag) => isBuiltInLanguageTag(tag) || customLanguages.includes(tag)
      ) ?? 'en';

    ctx.set('Content-Language', language);
    ctx.body = await getPhrase(language, customLanguages);

    return next();
  });
}
