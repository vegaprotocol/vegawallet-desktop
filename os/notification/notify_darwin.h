#import <Foundation/Foundation.h>
#import <Cocoa/Cocoa.h>
#import <objc/runtime.h>

@implementation NSBundle (swizle)

// Overriding bundleIdentifier works, but overriding NSUserNotificationAlertStyle does not work.
- (NSString *)__bundleIdentifier
{
    if (self == [NSBundle mainBundle]) {
        return @"com.apple.terminal";
    }

    return [self __bundleIdentifier];
}

@end

BOOL installNSBundleHook()
{
    Class c = objc_getClass("NSBundle");
    if (c) {
        method_exchangeImplementations(class_getInstanceMethod(c, @selector(bundleIdentifier)),
                                       class_getInstanceMethod(c, @selector(__bundleIdentifier)));
        return YES;
    }

    return NO;
}

void Send(const char *title, const char *subtitle)
{
    @autoreleasepool {
        if (!installNSBundleHook()) {
            return;
        }

        NSUserNotificationCenter *nc = [NSUserNotificationCenter defaultUserNotificationCenter];

        NSUserNotification *note = [[NSUserNotification alloc] init];
        note.title = [NSString stringWithUTF8String:title];
        note.subtitle = [NSString stringWithUTF8String:subtitle];

        [nc deliverNotification:note];
    }
}
