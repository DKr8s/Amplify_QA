import * as React from "react";
import { View, Flex, Text, Image } from "@aws-amplify/ui-react";

export default function CustomAnswerCardView({ answer, overrides = {}, ...rest }) {
  return (
    <View
      width="923px"
      display="block"
      position="relative"
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.1)"
      padding="16px"
      backgroundColor="white"
      borderRadius="12px"
      {...rest}
    >
      <Flex direction="column" gap="12px">
        {answer?.imageUrl && (
          <Image
            src={answer.imageUrl}
            alt="Answer Image"
            width="100%"
            maxHeight="300px"
            objectFit="cover"
            borderRadius="8px"
          />
        )}
        <Text fontSize="18px" color="black">
          {answer?.Text}
        </Text>
        <Flex justifyContent="space-between" fontSize="14px" color="gray">
          <Text>{answer?.Author || "anonymous"}</Text>
          <Text>
            {answer?.createdAt
              ? new Date(answer.createdAt).toLocaleString()
              : ""}
          </Text>
        </Flex>
      </Flex>
    </View>
  );
}
