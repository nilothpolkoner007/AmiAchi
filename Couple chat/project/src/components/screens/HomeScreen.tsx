import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { RouteProp } from "@react-navigation/core";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { ListView, NavigationButton, ActionItem } from "@nativescript/core";

type HomeScreenProps = {
  route: RouteProp<any, "Home">;
  navigation: FrameNavigationProp<any, "Home">;
};

const DUMMY_POSTS = [
  { id: 1, user: "John", content: "Beautiful day!", likes: 5 },
  { id: 2, user: "Sarah", content: "Missing you! ❤️", likes: 8 },
];

export function HomeScreen({ navigation }: HomeScreenProps) {
  const renderPost = (item) => {
    return (
      <gridLayout rows="auto, auto" columns="*" className="p-4 bg-white mb-2">
        <stackLayout row="0" className="mb-2">
          <label className="font-bold text-lg">{item.user}</label>
        </stackLayout>
        <stackLayout row="1">
          <label className="text-base">{item.content}</label>
          <flexboxLayout className="mt-2">
            <button className="text-red-500 mr-2">❤️ {item.likes}</button>
            <button className="text-gray-500">💬 Comment</button>
          </flexboxLayout>
        </stackLayout>
      </gridLayout>
    );
  };

  return (
    <gridLayout rows="auto, *">
      <actionBar row="0" title="Home" className="bg-blue-500 text-white">
        <NavigationButton text="Menu" android={{ systemIcon: "ic_menu_moreoverflow" }} />
        <ActionItem ios={{ position: "right" }} android={{ position: "actionBar" }}>
          <button className="text-white" text="New Post" />
        </ActionItem>
      </actionBar>

      <listView
        row="1"
        items={DUMMY_POSTS}
        itemTemplateSelector={renderPost}
        className="bg-gray-100"
      />
    </gridLayout>
  );
}