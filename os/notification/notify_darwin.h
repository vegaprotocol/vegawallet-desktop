#import <objc/runtime.h>
#import <Foundation/Foundation.h>
#import <UserNotifications/UserNotifications.h>

void Init() {
	@autoreleasepool {
	  if (@available(macOS 10.14, *)) {
		  UNUserNotificationCenter* center = [UNUserNotificationCenter currentNotificationCenter];
		  [center
		  	requestAuthorizationWithOptions:(UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge)
		  	completionHandler:^(BOOL granted, NSError *__nullable error){
		  	   NSLog(@"Granted: %b", granted);
		  	   NSLog(@"Error: %@", error);
		  	}
		  ];
		  NSLog(@"INIT THE NOTIFICATION");
		}
	}
}

void Send(const char *title, const char *subtitle) {
 	@autoreleasepool {
		if (@available(macOS 10.14, *)) {
      NSLog(@"SENDING THE NOTIFICATION");
			NSString *uuidString = [[NSUUID UUID] UUIDString];
			UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
			content.title = [NSString stringWithUTF8String:title];
			content.body = [NSString stringWithUTF8String:subtitle];
			content.sound = [UNNotificationSound defaultSound];

			UNTimeIntervalNotificationTrigger* trigger = [UNTimeIntervalNotificationTrigger
				triggerWithTimeInterval:1
				repeats:NO
			];

			UNNotificationRequest* request = [UNNotificationRequest
				requestWithIdentifier:uuidString
				content:content
				trigger:trigger
			];

			UNUserNotificationCenter* center = [UNUserNotificationCenter currentNotificationCenter];
			[center getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * settings) {
			  NSLog(@"Settings status %@", settings);
				if (settings.authorizationStatus != UNAuthorizationStatusAuthorized) {
					return;
				}

				// Send the notification if authorized.
				[center
					addNotificationRequest:request
					withCompletionHandler:^(NSError *error){}
				];
			}];
		} else {
			NSUserNotificationCenter *nc = [NSUserNotificationCenter defaultUserNotificationCenter];
			NSUserNotification *note = [[NSUserNotification alloc] init];
        	note.title = [NSString stringWithUTF8String:title];
        	note.subtitle = [NSString stringWithUTF8String:subtitle];
			[nc deliverNotification:note];
		}
	}
}
