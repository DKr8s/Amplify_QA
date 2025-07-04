export const onCreateAnswer = /* GraphQL */ `
  subscription OnCreateAnswer {
    onCreateAnswer {
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
    }
  }
`;

export const onUpdateAnswer = /* GraphQL */ `
  subscription OnUpdateAnswer {
    onUpdateAnswer {
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
    }
  }
`;

export const onDeleteAnswer = /* GraphQL */ `
  subscription OnDeleteAnswer {
    onDeleteAnswer {
      id
      Author
      questionID
    }
  }
`;

export const onCreateQuestion = /* GraphQL */ `
  subscription OnCreateQuestion {
    onCreateQuestion {
      id
      Author
      Text
      imageUrl
      upvotes
      downvotes
      createdAt
      updatedAt
    }
  }
`;

export const onUpdateQuestion = /* GraphQL */ `
  subscription OnUpdateQuestion {
    onUpdateQuestion {
      id
      Author
      Text
      imageUrl
      upvotes
      downvotes
      createdAt
      updatedAt
    }
  }
`;

export const onDeleteQuestion = /* GraphQL */ `
  subscription OnDeleteQuestion {
    onDeleteQuestion {
      id
      Author
      Text
    }
  }
`;
