/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAnswer = /* GraphQL */ `
  subscription OnCreateAnswer($filter: ModelSubscriptionAnswerFilterInput) {
    onCreateAnswer(filter: $filter) {
      id
      Author
      Text
      createdAt
      questionID
      parentID
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateAnswer = /* GraphQL */ `
  subscription OnUpdateAnswer($filter: ModelSubscriptionAnswerFilterInput) {
    onUpdateAnswer(filter: $filter) {
      id
      Author
      Text
      createdAt
      questionID
      parentID
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteAnswer = /* GraphQL */ `
  subscription OnDeleteAnswer($filter: ModelSubscriptionAnswerFilterInput) {
    onDeleteAnswer(filter: $filter) {
      id
      Author
      Text
      createdAt
      questionID
      parentID
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onCreateQuestion = /* GraphQL */ `
  subscription OnCreateQuestion($filter: ModelSubscriptionQuestionFilterInput) {
    onCreateQuestion(filter: $filter) {
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
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateQuestion = /* GraphQL */ `
  subscription OnUpdateQuestion($filter: ModelSubscriptionQuestionFilterInput) {
    onUpdateQuestion(filter: $filter) {
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
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteQuestion = /* GraphQL */ `
  subscription OnDeleteQuestion($filter: ModelSubscriptionQuestionFilterInput) {
    onDeleteQuestion(filter: $filter) {
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
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
