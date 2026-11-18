/**
 * Expo config plugin: quote the path of react-native-xcode.sh in the
 * "Bundle React Native code and images" build phase.
 *
 * The default template runs it with unquoted backticks, so the shell splits the
 * path on spaces and the iOS build fails when the project lives in a folder
 * such as ".../EIP - StudaFly/..." ("line 40: .../EIP: No such file or directory").
 */
// Expo config plugins are loaded by Node as CommonJS.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { withXcodeProject } = require('expo/config-plugins');

const RESOLVE_SCRIPT =
  '"$NODE_BINARY" --print "require(\'path\').dirname(require.resolve(\'react-native/package.json\')) + \'/scripts/react-native-xcode.sh\'"';
const UNQUOTED = '`' + RESOLVE_SCRIPT + '`';
const QUOTED = '"$(' + RESOLVE_SCRIPT + ')"';

// Inside project.pbxproj, shell scripts are stored with escaped double quotes.
const escape = (value) => value.replace(/"/g, '\\"');

function quoteBundleScript(shellScript) {
  return shellScript.split(escape(UNQUOTED)).join(escape(QUOTED)).split(UNQUOTED).join(QUOTED);
}

function withQuotedBundleScript(config) {
  return withXcodeProject(config, (cfg) => {
    const phases = cfg.modResults.hash.project.objects.PBXShellScriptBuildPhase ?? {};
    for (const [key, phase] of Object.entries(phases)) {
      if (key.endsWith('_comment') || typeof phase?.shellScript !== 'string') continue;
      phase.shellScript = quoteBundleScript(phase.shellScript);
    }
    return cfg;
  });
}

module.exports = withQuotedBundleScript;
module.exports.quoteBundleScript = quoteBundleScript;
