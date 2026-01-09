#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <CallKit/CallKit.h>

@interface CallShieldDirectoryManager : NSObject <RCTBridgeModule>
@end

@implementation CallShieldDirectoryManager

RCT_EXPORT_MODULE();

// entries: array of { number: string, label: string, block: boolean }
RCT_EXPORT_METHOD(sync
                  :(NSArray<NSDictionary *> *)entries
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  // Work off the main thread to avoid blocking the JS thread.
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    NSString *appGroupId = @"group.com.alessiobianchini.callshield";
    NSString *fileName = @"callshield_directory.json";
    NSString *extensionId = @"com.alessiobianchini.callshield.CallShieldDirectory";

    NSFileManager *fm = [NSFileManager defaultManager];
    NSURL *containerURL = [fm containerURLForSecurityApplicationGroupIdentifier:appGroupId];
    if (!containerURL) {
      reject(@"app_group_unavailable", @"Unable to access App Group container", nil);
      return;
    }

    NSError *error = nil;
    NSData *data = [NSJSONSerialization dataWithJSONObject:entries options:0 error:&error];
    if (error || !data) {
      reject(@"json_encode_failed", @"Failed to encode entries to JSON", error);
      return;
    }

    NSURL *fileURL = [containerURL URLByAppendingPathComponent:fileName];
    if (![data writeToURL:fileURL options:NSDataWritingAtomic error:&error]) {
      reject(@"file_write_failed", @"Failed to persist directory entries to App Group", error);
      return;
    }

    // Ask the system to reload the Call Directory extension so the new list is picked up.
    CXCallDirectoryManager *manager = [CXCallDirectoryManager sharedInstance];
    [manager reloadExtensionWithIdentifier:extensionId completionHandler:^(NSError * _Nullable reloadError) {
      if (reloadError) {
        reject(@"reload_failed", @"Call Directory reload failed", reloadError);
      } else {
        resolve(@(YES));
      }
    }];
  });
}

@end
