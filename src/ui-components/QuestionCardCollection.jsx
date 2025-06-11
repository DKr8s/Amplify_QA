/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Question } from "../models";
import { getOverrideProps, useDataStoreBinding } from "./utils";
import QuestionCard from "./QuestionCard";
import { Collection } from "@aws-amplify/ui-react";
export default function QuestionCardCollection(props) {
  const { items: itemsProp, overrideItems, overrides, ...rest } = props;
  const [items, setItems] = React.useState(undefined);
  const itemsDataStore = useDataStoreBinding({
    type: "collection",
    model: Question,
  }).items;
  React.useEffect(() => {
    if (itemsProp !== undefined) {
      setItems(itemsProp);
      return;
    }
    async function setItemsFromDataStore() {
      var loaded = await Promise.all(
        itemsDataStore.map(async (item) => ({
          ...item,
          Answers: await item.Answers.toArray(),
        }))
      );
      setItems(loaded);
    }
    setItemsFromDataStore();
  }, [itemsProp, itemsDataStore]);
  return (
    <Collection
      type="list"
      isSearchable="true"
      isPaginated={true}
      searchPlaceholder="Search..."
      itemsPerPage={20}
      direction="column"
      alignItems="stretch"
      justifyContent="left"
      items={items || []}
      {...getOverrideProps(overrides, "QuestionCardCollection")}
      {...rest}
    >
      {(item, index) => (
        <QuestionCard
          question={item}
          key={item.id}
          {...(overrideItems && overrideItems({ item, index }))}
        ></QuestionCard>
      )}
    </Collection>
  );
}
