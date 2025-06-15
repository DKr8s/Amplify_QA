// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Answer, Question } = initSchema(schema);

export {
  Answer,
  Question
};