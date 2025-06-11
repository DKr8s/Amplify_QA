/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { getOverrideProps, useNavigateAction } from "./utils";
import { Flex, Text, View } from "@aws-amplify/ui-react";
import MyIcon from "./MyIcon";
export default function QuestionCard(props) {
  const { question, overrides, ...rest } = props;
  const readmoreThreeSixFiveTwoTwoSevenSixOneOnClick = useNavigateAction({
    type: "url",
    url: `${"/question/"}${question?.id}`,
  });
  return (
    <View
      width="923px"
      height="172px"
      display="block"
      gap="unset"
      alignItems="unset"
      justifyContent="unset"
      overflow="hidden"
      position="relative"
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
      padding="0px 0px 0px 0px"
      backgroundColor="rgba(255,255,255,1)"
      {...getOverrideProps(overrides, "QuestionCard")}
      {...rest}
    >
      <Flex
        gap="16px"
        direction="column"
        width="837px"
        height="unset"
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
          fontWeight="700"
          color="rgba(13,26,38,1)"
          lineHeight="25px"
          textAlign="left"
          display="block"
          direction="column"
          justifyContent="unset"
          width="837px"
          height="unset"
          gap="unset"
          alignItems="unset"
          shrink="0"
          position="relative"
          padding="0px 0px 0px 0px"
          whiteSpace="pre-wrap"
          children={question?.Text}
          {...getOverrideProps(
            overrides,
            "New Amplify Studio gives designers the ability to export UI to React code"
          )}
        ></Text>
        <Flex
          gap="16px"
          direction="row"
          width="unset"
          height="unset"
          justifyContent="flex-start"
          alignItems="flex-start"
          shrink="0"
          alignSelf="stretch"
          position="relative"
          padding="0px 0px 0px 0px"
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
            children={question?.Author}
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
            children={question?.createdAt}
            {...getOverrideProps(overrides, "createdAtDate")}
          ></Text>
        </Flex>
      </Flex>
      <Flex
        gap="16px"
        direction="row"
        width="712px"
        height="unset"
        justifyContent="flex-start"
        alignItems="flex-start"
        position="absolute"
        top="118px"
        left="27px"
        padding="0px 0px 0px 0px"
        {...getOverrideProps(overrides, "Read more36522759")}
      >
        <MyIcon
          width="24px"
          height="24px"
          display="block"
          gap="unset"
          alignItems="unset"
          justifyContent="unset"
          overflow="hidden"
          shrink="0"
          position="relative"
          padding="0px 0px 0px 0px"
          type="arrow-right"
          {...getOverrideProps(overrides, "MyIcon")}
        ></MyIcon>
        <Text
          fontFamily="Inter"
          fontSize="16px"
          fontWeight="400"
          color="rgba(13,26,38,1)"
          lineHeight="24px"
          textAlign="left"
          display="block"
          direction="column"
          justifyContent="unset"
          textDecoration="underline"
          letterSpacing="0.01px"
          width="unset"
          height="unset"
          gap="unset"
          alignItems="unset"
          grow="1"
          shrink="1"
          basis="0"
          position="relative"
          padding="0px 0px 0px 0px"
          whiteSpace="pre-wrap"
          children="Read more"
          onClick={() => {
            readmoreThreeSixFiveTwoTwoSevenSixOneOnClick();
          }}
          {...getOverrideProps(overrides, "Read more36522761")}
        ></Text>
      </Flex>
    </View>
  );
}
