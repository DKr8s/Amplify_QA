/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Answer } from "../models";
import { getOverrideProps, useDataStoreBinding } from "./utils";
import AnswerCardView from "./AnswerCardView";
import { Collection } from "@aws-amplify/ui-react";
export default function AnswerCardViewCollection(props) {
  const { items: itemsProp, overrideItems, overrides, ...rest } = props;
  const [items, setItems] = React.useState(undefined);
  const itemsDataStore = useDataStoreBinding({
    type: "collection",
    model: Answer,
  }).items;
  React.useEffect(() => {
    if (itemsProp !== undefined) {
      setItems(itemsProp);
      return;
    }
    setItems(itemsDataStore);
  }, [itemsProp, itemsDataStore]);
  return (
    <Collection
      type="list"
      isSearchable="true"
      isPaginated={true}
      searchPlaceholder="Search..."
      itemsPerPage={20}
      direction="column"
      justifyContent="left"
      items={items || []}
      {...getOverrideProps(overrides, "AnswerCardViewCollection")}
      {...rest}
    >
      {(item, index) => (
        <AnswerCardView
          answer={item}
          key={item.id}
          {...(overrideItems && overrideItems({ item, index }))}
        ></AnswerCardView>
      )}
    </Collection>
  );
}
