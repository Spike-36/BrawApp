// components/ExternalLink.tsx
import { openBrowserAsync } from 'expo-web-browser';
import React from 'react';
import { GestureResponderEvent, Linking, Pressable, Text } from 'react-native';

type Props = {
  href: string;
  children?: React.ReactNode;
  external?: boolean; // if true, open with in-app browser; otherwise use system
};

export default function ExternalLink({ href, children, external = true }: Props) {
  const onPress = async (event: GestureResponderEvent) => {
    event?.preventDefault?.();
    try {
      if (external) {
        await openBrowserAsync(href);
      } else {
        await Linking.openURL(href);
      }
    } catch (e) {
      console.warn('Failed to open link:', e);
    }
  };

  return (
    <Pressable onPress={onPress}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </Pressable>
  );
}
