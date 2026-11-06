import { ConfigContext, ExpoConfig } from 'expo/config';
import { ConfigPlugin, withXcodeProject } from 'expo/config-plugins';

const GOOGLE_CLIENT_SUFFIX = '.apps.googleusercontent.com';

// The "Bundle React Native code and images" build phase runs the path printed by node
// unquoted (`"$NODE_BINARY" --print ...`): it breaks when the project path contains
// spaces ("EIP - StudaFly"). Run it quoted instead: "$("$NODE_BINARY" --print ...)".
const UNQUOTED_BUNDLE_COMMAND = /`(\\"\$NODE_BINARY\\" --print \\"[^`]*react-native-xcode\.sh'\\")`/;

const withQuotedBundleScript: ConfigPlugin = (config) =>
  withXcodeProject(config, (cfg) => {
    const phases: Record<string, { shellScript?: string }> =
      cfg.modResults.hash.project.objects.PBXShellScriptBuildPhase ?? {};
    for (const phase of Object.values(phases)) {
      if (typeof phase === 'object' && phase.shellScript) {
        phase.shellScript = phase.shellScript.replace(UNQUOTED_BUNDLE_COMMAND, '\\"$($1)\\"');
      }
    }
    return cfg;
  });

/**
 * iOS Google sign-in needs the reversed iOS client ID as a URL scheme:
 * "123-abc.apps.googleusercontent.com" → "com.googleusercontent.apps.123-abc".
 */
function googleIosUrlScheme(iosClientId: string | undefined): string | null {
  if (!iosClientId?.endsWith(GOOGLE_CLIENT_SUFFIX)) return null;
  return `com.googleusercontent.apps.${iosClientId.slice(0, -GOOGLE_CLIENT_SUFFIX.length)}`;
}

// Extends app.json. The Google plugin is only added once the iOS client ID is set
// (it fails the prebuild otherwise); Android needs no native configuration.
export default ({ config }: ConfigContext): ExpoConfig => {
  const iosUrlScheme = googleIosUrlScheme(process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID);

  return withQuotedBundleScript({
    ...config,
    name: config.name ?? 'mobile',
    slug: config.slug ?? 'mobile',
    plugins: [
      ...(config.plugins ?? []),
      ...(iosUrlScheme ? [['@react-native-google-signin/google-signin', { iosUrlScheme }] as [string, object]] : []),
    ],
  });
};
