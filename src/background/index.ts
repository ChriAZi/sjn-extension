import { Analytics } from '~util/google-analytics'

chrome.runtime.onStartup.addListener(() => {
  // noinspection JSIgnoredPromiseFromCall
  Analytics.fireEvent('session_start')
})


