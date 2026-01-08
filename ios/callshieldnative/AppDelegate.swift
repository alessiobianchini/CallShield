import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Log fatal JS errors to console/UserDefaults so we can read them even if the app aborts on startup.
    installFatalHandlers()

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "callshieldnative",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }

  private func installFatalHandlers() {
    let defaultFatalHandler = RCTGetFatalHandler()
    let defaultExceptionHandler = RCTGetFatalExceptionHandler()

    // Capture RCTFatalHandler (NSError) for JS fatal errors.
    RCTSetFatalHandler { error in
      let nsError = error as NSError?
      let message = nsError?.localizedDescription ?? "Unknown fatal error"
      let code = nsError?.code ?? 0
      let domain = nsError?.domain ?? "unknown"
      let info = nsError?.userInfo ?? [:]
      let payload: [String: Any] = [
        "type": "fatal_error",
        "message": message,
        "domain": domain,
        "code": code,
        "info": info,
        "ts": Date().timeIntervalSince1970,
      ]
      UserDefaults.standard.set(payload, forKey: "last_fatal_native")
      NSLog("[RNFatal] domain=\(domain) code=\(code) message=\(message) info=\(info)")
      defaultFatalHandler?(error)
    }

    // Capture fatal exceptions (NSException) with stack.
    RCTSetFatalExceptionHandler { exception in
      let name = exception?.name.rawValue ?? "Exception"
      let reason = exception?.reason ?? "Unknown reason"
      let stack = exception?.callStackSymbols.joined(separator: "\n") ?? ""
      let payload: [String: Any] = [
        "type": "fatal_exception",
        "name": name,
        "reason": reason,
        "stack": stack,
        "ts": Date().timeIntervalSince1970,
      ]
      UserDefaults.standard.set(payload, forKey: "last_fatal_exception_native")
      NSLog("[RNFatalException] name=\(name) reason=\(reason)\n\(stack)")
      defaultExceptionHandler?(exception)
    }
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
