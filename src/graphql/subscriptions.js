/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAnswer = /* GraphQL */ `
  subscription OnCreateAnswer(
    $filter: ModelSubscriptionAnswerFilterInput
    $owner: String
  ) {
    onCreateAnswer(filter: $filter, owner: $owner) {
      id
      Author
      Text
      createdAt
      questionID
      parentID
      imageUrl
      upvotes
      downvotes
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onUpdateAnswer = /* GraphQL */ `
  subscription OnUpdateAnswer(
    $filter: ModelSubscriptionAnswerFilterInput
    $owner: String
  ) {
    onUpdateAnswer(filter: $filter, owner: $owner) {
      id
      Author
      Text
      createdAt
      questionID
      parentID
      imageUrl
      upvotes
      downvotes
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onDeleteAnswer = /* GraphQL */ `
  subscription OnDeleteAnswer(
    $filter: ModelSubscriptionAnswerFilterInput
    $owner: String
  ) {
    onDeleteAnswer(filter: $filter, owner: $owner) {
      id
      Author
      Text
      createdAt
      questionID
      parentID
      imageUrl
      upvotes
      downvotes
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onCreateQuestion = /* GraphQL */ `
  subscription OnCreateQuestion(
    $filter: ModelSubscriptionQuestionFilterInput
    $owner: String
  ) {
    onCreateQuestion(filter: $filter, owner: $owner) {
      id
      Author
      Text
      imageUrl
      createdAt
      updatedAt
      upvotes
      downvotes
      Answers {
        items {
          id
          Author
          Text
          createdAt
          questionID
          parentID
          imageUrl
          upvotes
          downvotes
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onUpdateQuestion = /* GraphQL */ `
  subscription OnUpdateQuestion(
    $filter: ModelSubscriptionQuestionFilterInput
    $owner: String
  ) {
    onUpdateQuestion(filter: $filter, owner: $owner) {
      id
      Author
      Text
      imageUrl
      createdAt
      updatedAt
      upvotes
      downvotes
      Answers {
        items {
          id
          Author
          Text
          createdAt
          questionID
          parentID
          imageUrl
          upvotes
          downvotes
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onDeleteQuestion = /* GraphQL */ `
  subscription OnDeleteQuestion(
    $filter: ModelSubscriptionQuestionFilterInput
    $owner: String
  ) {
    onDeleteQuestion(filter: $filter, owner: $owner) {
      id
      Author
      Text
      imageUrl
      createdAt
      updatedAt
      upvotes
      downvotes
      Answers {
        items {
          id
          Author
          Text
          createdAt
          questionID
          parentID
          imageUrl
          upvotes
          downvotes
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
