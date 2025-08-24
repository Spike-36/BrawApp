// AppDelegate.mm
#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTLog.h>          // ok in .mm
#import <React/RCTAssert.h>        // RCTSetFatalHandler / RCTSetFatalExceptionHandler
#import <React/RCTJSStackFrame.h>  // RCTJSStackTraceKey

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Expo's AppEntry registers the root as "main"
  self.moduleName = @"main";
  self.initialProps = @{};

#if DEBUG
  NSLog(@"🔥 DEBUG build running");
#else
  NSLog(@"✅ RELEASE build running");
#endif

  // Sanity: which root name is native using?
  NSLog(@"moduleName runtime = %@", self.moduleName);

  // Print JS fatals to Console in Release so we see the cause before RN aborts
  RCTSetFatalHandler(^(__unused NSError *error) {
    NSString *stack = error.userInfo[RCTJSStackTraceKey] ?: error.userInfo[@"stack"];
    NSLog(@"🧨 RN FATAL: %@\nSTACK:\n%@", error.localizedDescription, stack);
  });
  RCTSetFatalExceptionHandler(^(__unused NSException *ex) {
    NSLog(@"🧨 RN EXCEPTION: %@\nSTACK:\n%@", ex.reason, ex.callStackSymbols);
  });

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// RN 0.71+: provide the JS bundle URL here
- (NSURL *)bundleURL
{
#if DEBUG
  // Loads JS from Metro in development
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  // Loads pre-bundled JS for TestFlight / App Store
  NSURL *url = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  if (url) {
    NSLog(@"📦 Using JS bundle: %@", url);
  } else {
    NSLog(@"❌ main.jsbundle not found in app bundle");
  }
  return url;
#endif
}

@end
