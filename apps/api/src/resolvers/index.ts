import { searchResolvers } from './search.js';
import { entityResolvers } from './entity.js';
import { workResolvers } from './work.js';
import { eventResolvers } from './event.js';

export const resolvers = {
  Query: {
    ...searchResolvers.Query,
    ...entityResolvers.Query,
    ...workResolvers.Query,
    ...eventResolvers.Query,
  },
};

