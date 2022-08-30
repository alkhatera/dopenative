import React, { useCallback, useEffect, useState } from 'react'
import { I18nManager } from 'react-native'
import Storage from '@react-native-async-storage/async-storage'
import i18n from 'i18n-js'
import * as Localization from 'expo-localization'

export const TranslationContext = React.createContext({})

export const TranslationProvider = ({ children, translations }) => {
  const [locale, setLocale] = useState(Localization.locale)

  useEffect(() => {
    i18n.locale = locale
    i18n.translations = translations
    i18n.fallbacks = true
    // update layout direction
    I18nManager.forceRTL(Localization.isRTL)
  }, [locale])

  const localized = useCallback(
    (key, config) =>
      i18n.t(key, { ...config, locale }).includes('missing')
        ? key
        : i18n.t(key, { ...config, locale }),
    [locale],
  )

  const getLocale = useCallback(async () => {
    const localeJSON = await Storage.getItem('locale')

    // If we have a locale stored in local storage, that is high priority (it overrides the current device locale)
    setLocale(localeJSON !== null ? localeJSON : Localization.locale)
  }, [setLocale])

  const lan = React.useMemo(() => {
    switch (locale) {
      case 'ar':
        return 'lan_s'
      default:
        return 'lan_p'
    }
  }, [locale])

  useEffect(() => {
    getLocale()
  }, [getLocale])

  useEffect(() => {
    Storage.setItem('locale', locale)
  }, [locale])

  const value = {
    localized,
    setAppLocale: setLocale,
    lan,
    Language: locale
  }

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}
