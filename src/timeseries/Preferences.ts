interface Preferences {
  node(name: string): Preferences;
  getBoolean(key: string, defaultValue: boolean): boolean;
  putBoolean(key: string, value: boolean): void;
  removePreferenceChangeListener(listener: (event: StorageEvent) => void): void;
  addPreferenceChangeListener(listener: (event: StorageEvent) => void): void;
}

/**
 * Provides a uniform way of creating the Quality settings preferences
 * @param {Preferences} rootNode The root node to create the preferences node from.
 * @returns The Quality settings preferences node.
 */
function getQualityPrefs(rootNode: Preferences): Preferences {
  return rootNode.node("Quality");
}

/**
 * Provides a uniform way of creating the quality color preferences node.
 * Please keep this for use later, it will be used once we start updating
 * the preferences for quality colors.
 * @param {Preferences} rootNode The root node to create the preferences node from.
 * @returns The quality color preferences node.
 */
function getQualityColorPrefs(rootNode: Preferences): Preferences {
  return rootNode.node("Quality").node("color");
}

/**
 * Gets the application specific edit quality flag and returns that.  Make
 * sure you're not using the Preferences.userRoot or Preferences.systemRoot
 * because these are NOT application specific, this will be user or system
 * specific preferences.
 * @param {Preferences} appSpecificRootNode The application specific root node.
 * @returns A boolean indicating whether the quality flags are editable.
 */
function canEditQuality(appSpecificRootNode: Preferences): boolean {
  const qualNode = getQualityPrefs(appSpecificRootNode);
  const value = qualNode.getBoolean("QUALITY_FLAGS_EDITABLE", true);
  if (value) {
    localStorage.setItem("QUALITY_FLAGS_EDITABLE", "true");
  } else {
    localStorage.setItem("QUALITY_FLAGS_EDITABLE", "false");
  }
  return value;
}

/**
 * Gets the application specific show quality flag and returns that.  Make
 * sure you're not using the Preferences.userRoot or Preferences.systemRoot
 * because these are NOT application specific, this will be user or system
 * specific preferences.
 * @param {Preferences} appSpecificRootNode The application specific root node.
 * @returns A boolean indicating whether the quality flags are shown.
 */
function canShowQuality(appSpecificRootNode: Preferences): boolean {
  const qualNode = getQualityPrefs(appSpecificRootNode);
  const value = qualNode.getBoolean("SHOW_QUALITY_FLAGS", true);
  if (value) {
    localStorage.setItem("SHOW_QUALITY_FLAGS", "true");
  } else {
    localStorage.setItem("SHOW_QUALITY_FLAGS", "false");
  }
  return value;
}

/**
 * Sets the application specific show quality flag to the value provided.
 * @param {Preferences} appSpecificRootNode The application specific root node.
 * @param {boolean} showQuality A boolean indicating whether to show the quality flags.
 */
function setShowQuality(
  appSpecificRootNode: Preferences,
  showQuality: boolean
): void {
  const qualNode = getQualityPrefs(appSpecificRootNode);
  qualNode.putBoolean("SHOW_QUALITY_FLAGS", showQuality);
  localStorage.setItem("SHOW_QUALITY_FLAGS", showQuality.toString());
}

/**
 * Sets the application specific edit quality flag to the value provided.
 * @param {Preferences} appSpecificRootNode The application specific root node.
 * @param {boolean} editQuality A boolean indicating whether to allow editing of the quality flags.
 */
function setCanEditQuality(
  appSpecificRootNode: Preferences,
  editQuality: boolean
): void {
  const qualNode = getQualityPrefs(appSpecificRootNode);
  qualNode.putBoolean("QUALITY_FLAGS_EDITABLE", editQuality);
  localStorage.setItem("QUALITY_FLAGS_EDITABLE", editQuality.toString());
}

/**
 * Adds a Preference change listener to the node that contains the quality
 * settings.
 * @param {Preferences} appSpecificRootNode The application specific root node.
 * @param {PreferenceChangeListener} listener The listener to add.
 */
function addQualityPreferencesListener(
  appSpecificRootNode: Preferences,
  listener: (event: StorageEvent) => void
): void {
  const qualNode = getQualityPrefs(appSpecificRootNode);
  qualNode.removePreferenceChangeListener(listener);
  window.addEventListener("storage", listener);
}

/**
 * Removes a Preference change listener from the node that contains the quality settings.
 *
 * @param appSpecificRootNode The application specific root node of the preferences.
 * @param listener The PreferenceChangeListener to remove.
 */
function removeQualityPreferencesListener(
  appSpecificRootNode: Preferences,
  listener: (event: StorageEvent) => void
): void {
  const qualNode = getQualityPrefs(appSpecificRootNode);
  qualNode.removePreferenceChangeListener(listener);
  window.removeEventListener("storage", listener);
}

export {
  removeQualityPreferencesListener,
  addQualityPreferencesListener,
  setCanEditQuality,
  setShowQuality,
  canShowQuality,
  canEditQuality
};
