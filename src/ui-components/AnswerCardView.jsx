/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { getOverrideProps } from "./utils";
import { Flex, Text, View } from "@aws-amplify/ui-react";
export default function AnswerCardView(props) {
  const { answer, overrides, ...rest } = props;
  return (
    <View
      width="923px"
      height="180px"
      display="block"
      gap="unset"
      alignItems="unset"
      justifyContent="unset"
      overflow="hidden"
      position="relative"
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
      padding="0px 0px 0px 0px"
      backgroundColor="rgba(255,255,255,1)"
      {...getOverrideProps(overrides, "AnswerCardView")}
      {...rest}
    >
      <Flex
        gap="16px"
        direction="column"
        width="844px"
        height="104px"
        justifyContent="flex-start"
        alignItems="flex-start"
        position="absolute"
        top="28px"
        left="27px"
        padding="0px 0px 0px 0px"
        {...getOverrideProps(overrides, "Headline")}
      >
        <Text
          fontFamily="Inter"
          fontSize="20px"
          fontWeight="400"
          color="rgba(13,26,38,1)"
          lineHeight="25px"
          textAlign="left"
          display="block"
          direction="column"
          justifyContent="unset"
          width="844px"
          height="57px"
          gap="unset"
          alignItems="unset"
          shrink="0"
          position="relative"
          padding="0px 0px 0px 0px"
          whiteSpace="pre-wrap"
          children={answer?.Text}
          {...getOverrideProps(
            overrides,
            "New Amplify Studio gives designers the ability to export UI to React code. New Amplify Studio gives designers the ability to export UI to React code. New Amplify Studio gives designers the ability to export UI to React code"
          )}
        ></Text>
      </Flex>
      <Flex
        gap="16px"
        direction="row"
        width="844px"
        height="36px"
        justifyContent="flex-start"
        alignItems="flex-start"
        position="absolute"
        top="132px"
        left="27px"
        padding="5px 0px 5px 0px"
        {...getOverrideProps(overrides, "Frame")}
      >
        <Text
          fontFamily="Inter"
          fontSize="16px"
          fontWeight="400"
          color="rgba(92,102,112,1)"
          lineHeight="24px"
          textAlign="left"
          display="block"
          direction="column"
          justifyContent="unset"
          letterSpacing="0.01px"
          width="unset"
          height="unset"
          gap="unset"
          alignItems="unset"
          shrink="0"
          position="relative"
          padding="0px 0px 0px 0px"
          whiteSpace="pre-wrap"
          children={answer?.Author}
          {...getOverrideProps(overrides, "authorName")}
        ></Text>
        <Text
          fontFamily="Inter"
          fontSize="16px"
          fontWeight="400"
          color="rgba(92,102,112,1)"
          lineHeight="24px"
          textAlign="left"
          display="block"
          direction="column"
          justifyContent="unset"
          letterSpacing="0.01px"
          width="unset"
          height="unset"
          gap="unset"
          alignItems="unset"
          shrink="0"
          position="relative"
          padding="0px 0px 0px 0px"
          whiteSpace="pre-wrap"
          children={answer?.createdAt}
          {...getOverrideProps(overrides, "createdAtDate")}
        ></Text>
      </Flex>
    </View>
  );
}
