#import <UIKit/UIKit.h>

#if __has_include(<React/RCTAppDelegate.h>)
  // Some installs expose it under "React"
  #import <React/RCTAppDelegate.h>
#else
  // Others (RN 0.73+) expose it as a separate pod
  #import <React-RCTAppDelegate/RCTAppDelegate.h>
#endif

@interface AppDelegate : RCTAppDelegate
@end
