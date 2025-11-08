import { Converter } from "automapper-core";

import { Client } from "../../clients/entities/client.entity";
import { Flow } from "../../flows/entities/flow.entity";

/**
 * Creates a lightweight reference of an entity with only its `id` set.
 * Useful for TypeORM relationships (e.g. setting foreign keys without loading entities).
 */
export function createEntityRef<T extends { id?: string }>(
  EntityClass: new () => T,
  id?: string | null,
): T | null {
  if (!id) return null;
  const entity = new EntityClass();
  entity.id = id;
  return entity;
}

/**
 * Creates an array of lightweight references of entities from an array of IDs.
 */
export function createEntityRefs<T extends { id?: string }>(
  EntityClass: new () => T,
  ids?: (string | null)[] | null,
): T[] {
  if (!ids?.length) return [];
  return ids
    .filter((id): id is string => !!id)
    .map((id) => {
      const entity = new EntityClass();
      entity.id = id;
      return entity;
    });
}

// export function createStringIdToRefConverter<T extends { id?: string }>(
//   EntityClass: new () => T,
// ): Converter<string | null | undefined, T | null> {
//   return {
//     convert(source) {
//       if (!source) return null;
//       const entity = new EntityClass();
//       entity.id = source;
//       return entity;
//     },
//   };
// }

/**
 * Creates a converter that transforms a string ID into an entity reference.
 * Example: "abc-123" → Client { id: "abc-123" }
 */
function createStringIdToRefConverter<T extends { id?: string }>(
  EntityClass: new () => T,
): Converter<string, T> {
  return {
    convert(source) {
      const entity = new EntityClass();
      entity.id = source;
      return entity;
    },
  };
}

export const clientRefConverter = createStringIdToRefConverter(Client);
export const flowRefConverter = createStringIdToRefConverter(Flow);

export function createStringIdsToRefsConverter<T extends { id?: string }>(
  EntityClass: new () => T,
): Converter<string[] | null | undefined, T[]> {
  return {
    convert(source) {
      if (!source?.length) return [];
      return source
        .filter((id): id is string => !!id)
        .map((id) => {
          const entity = new EntityClass();
          entity.id = id;
          return entity;
        });
    },
  };
}

export const idToRefConverter: Converter<string, any> = {
  convert(source: string) {
    console.log("Converting id to ref:", source);
    if (!source) return null;
    return { id: source };
  },
};

export const idRefMapper = (id: string | string[] | null | undefined) => {
  if (Array.isArray(id)) {
    return id
      .map((singleId) => {
        if (singleId) return { id: singleId };
      })
      .filter(Boolean);
  }
  if (id === null) return null;
  if (id) return { id };
  if (id === undefined) return;
};
