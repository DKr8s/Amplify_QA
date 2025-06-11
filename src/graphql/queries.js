/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getQuestion = /* GraphQL */ `
  query GetQuestion($id: ID!) {
    getQuestion(id: $id) {
      id
      Author
      Text
      Answers {
        items {
          id
          Author
          Text
          questionID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listQuestions = /* GraphQL */ `
  query ListQuestions(
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        Author
        Text
        Answers {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getAnswer = /* GraphQL */ `
  query GetAnswer($id: ID!) {
    getAnswer(id: $id) {
      id
      Author
      Text
      questionID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listAnswers = /* GraphQL */ `
  query ListAnswers(
    $filter: ModelAnswerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAnswers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        Author
        Text
        questionID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const answersByQuestionID = /* GraphQL */ `
  query AnswersByQuestionID(
    $questionID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelAnswerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    answersByQuestionID(
      questionID: $questionID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        Author
        Text
        questionID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
