/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAnswer = /* GraphQL */ `
  query GetAnswer($id: ID!) {
    getAnswer(id: $id) {
      id
      Author
      Text
      questionID
      parentID
      imageUrl
      upvotes
      downvotes
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
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
        parentID
        imageUrl
        upvotes
        downvotes
        createdAt
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
  }
`;
export const syncAnswers = /* GraphQL */ `
  query SyncAnswers(
    $filter: ModelAnswerFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncAnswers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        Author
        Text
        questionID
        parentID
        imageUrl
        upvotes
        downvotes
        createdAt
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
  }
`;
export const answersByAuthor = /* GraphQL */ `
  query AnswersByAuthor(
    $Author: String!
    $sortDirection: ModelSortDirection
    $filter: ModelAnswerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    answersByAuthor(
      Author: $Author
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
        parentID
        imageUrl
        upvotes
        downvotes
        createdAt
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
        parentID
        imageUrl
        upvotes
        downvotes
        createdAt
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
  }
`;
export const answersByParentID = /* GraphQL */ `
  query AnswersByParentID(
    $parentID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelAnswerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    answersByParentID(
      parentID: $parentID
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
        parentID
        imageUrl
        upvotes
        downvotes
        createdAt
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
  }
`;
export const getQuestion = /* GraphQL */ `
  query GetQuestion($id: ID!) {
    getQuestion(id: $id) {
      id
      Author
      Text
      imageUrl
      upvotes
      downvotes
      Answers {
        items {
          id
          Author
          Text
          questionID
          parentID
          imageUrl
          upvotes
          downvotes
          createdAt
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
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
        imageUrl
        upvotes
        downvotes
        Answers {
          nextToken
          startedAt
          __typename
        }
        createdAt
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
  }
`;
export const syncQuestions = /* GraphQL */ `
  query SyncQuestions(
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncQuestions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        Author
        Text
        imageUrl
        upvotes
        downvotes
        Answers {
          nextToken
          startedAt
          __typename
        }
        createdAt
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
  }
`;
export const questionsByAuthor = /* GraphQL */ `
  query QuestionsByAuthor(
    $Author: String!
    $sortDirection: ModelSortDirection
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    questionsByAuthor(
      Author: $Author
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        Author
        Text
        imageUrl
        upvotes
        downvotes
        Answers {
          nextToken
          startedAt
          __typename
        }
        createdAt
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
  }
`;
