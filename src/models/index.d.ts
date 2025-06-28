import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";





type EagerAnswer = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Answer, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly Author?: string | null;
  readonly Text: string;
  readonly createdAt?: string | null;
  readonly questionID: string;
  readonly parentID?: string | null;
  readonly imageUrl?: string | null;
  readonly upvotes?: number | null;
  readonly downvotes?: number | null;
  readonly updatedAt?: string | null;
}

type LazyAnswer = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Answer, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly Author?: string | null;
  readonly Text: string;
  readonly createdAt?: string | null;
  readonly questionID: string;
  readonly parentID?: string | null;
  readonly imageUrl?: string | null;
  readonly upvotes?: number | null;
  readonly downvotes?: number | null;
  readonly updatedAt?: string | null;
}

export declare type Answer = LazyLoading extends LazyLoadingDisabled ? EagerAnswer : LazyAnswer

export declare const Answer: (new (init: ModelInit<Answer>) => Answer) & {
  copyOf(source: Answer, mutator: (draft: MutableModel<Answer>) => MutableModel<Answer> | void): Answer;
}

type EagerQuestion = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Question, 'id'>;
  };
  readonly id: string;
  readonly Author?: string | null;
  readonly Text: string;
  readonly imageUrl?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly upvotes?: number | null;
  readonly downvotes?: number | null;
  readonly Answers?: (Answer | null)[] | null;
}

type LazyQuestion = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Question, 'id'>;
  };
  readonly id: string;
  readonly Author?: string | null;
  readonly Text: string;
  readonly imageUrl?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly upvotes?: number | null;
  readonly downvotes?: number | null;
  readonly Answers: AsyncCollection<Answer>;
}

export declare type Question = LazyLoading extends LazyLoadingDisabled ? EagerQuestion : LazyQuestion

export declare const Question: (new (init: ModelInit<Question>) => Question) & {
  copyOf(source: Question, mutator: (draft: MutableModel<Question>) => MutableModel<Question> | void): Question;
}