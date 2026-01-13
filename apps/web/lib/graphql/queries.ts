import { gql } from '@apollo/client';

export const SEARCH_ENTITIES = gql`
  query SearchEntities($query: String!, $limit: Int) {
    search(query: $query, limit: $limit) {
      id
      slug
      name
      type
      snippet
      score
    }
  }
`;

export const GET_ENTITY = gql`
  query GetEntity($slug: String!) {
    entity(slug: $slug) {
      id
      slug
      name
      type
      summary
      aliases
      relationships {
        id
        predicate
        targetId
        targetName
        targetType
        targetSlug
      }
    }
  }
`;

export const GET_ENTITY_GRAPH = gql`
  query GetEntityGraph($slug: String!, $depth: Int) {
    entityGraph(slug: $slug, depth: $depth) {
      centerNode
      nodes {
        id
        slug
        name
        type
        summary
      }
      edges {
        id
        from
        to
        predicate
        type
      }
    }
  }
`;

export const GET_ENTITIES = gql`
  query GetEntities($type: EntityType, $limit: Int) {
    entities(type: $type, limit: $limit) {
      id
      slug
      name
      type
      summary
      aliases
    }
  }
`;

export const GET_WORKS = gql`
  query GetWorks {
    works {
      id
      slug
      title
      workType
      publicationYear
      summary
      author
    }
  }
`;

