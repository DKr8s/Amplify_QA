import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  TextAreaField,
  TextField,
  Image,
} from "@aws-amplify/ui-react";
import { Answer } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify/datastore";

export default function CustomAnswerCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;

  const initialValues = {
    Text: "",
    Author: "",
    createdAt: "",
    parentID: "",
    imageUrl: "",
  };

  const [Text, setText] = React.useState(initialValues.Text);
  const [Author, setAuthor] = React.useState(initialValues.Author);
  const [createdAt, setCreatedAt] = React.useState(initialValues.createdAt);
  const [parentID, setParentID] = React.useState(initialValues.parentID);
  const [imageUrl, setImageUrl] = React.useState(initialValues.imageUrl);
  const [errors, setErrors] = React.useState({});

  const resetStateValues = () => {
    setText(initialValues.Text);
    setAuthor(initialValues.Author);
    setCreatedAt(initialValues.createdAt);
    setParentID(initialValues.parentID);
    setImageUrl(initialValues.imageUrl);
    setErrors({});
  };

  const validations = {
    Text: [{ type: "Required" }],
    Author: [],
    createdAt: [],
    parentID: [],
    imageUrl: [],
  };

  const runValidationTasks = async (fieldName, currentValue, getDisplayValue) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };

  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  };

  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          Text,
          Author,
          createdAt,
          parentID,
          imageUrl,
        };

        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );

        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await DataStore.save(new Answer(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "CustomAnswerCreateForm")}
      {...rest}
    >
      <TextAreaField
        label="Text"
        isRequired={true}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Text: value,
              Author,
              createdAt,
              parentID,
              imageUrl,
            };
            const result = onChange(modelFields);
            value = result?.Text ?? value;
          }
          if (errors.Text?.hasError) {
            runValidationTasks("Text", value);
          }
          setText(value);
        }}
        onBlur={() => runValidationTasks("Text", Text)}
        errorMessage={errors.Text?.errorMessage}
        hasError={errors.Text?.hasError}
        {...getOverrideProps(overrides, "Text")}
      ></TextAreaField>

      <TextField
        label="Author"
        value={Author}
        onChange={(e) => setAuthor(e.target.value)}
        {...getOverrideProps(overrides, "Author")}
      />

      <TextField
        label="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        {...getOverrideProps(overrides, "imageUrl")}
      />

      <TextField
        label="Created At"
        type="datetime-local"
        value={createdAt && convertToLocal(new Date(createdAt))}
        onChange={(e) => setCreatedAt(new Date(e.target.value).toISOString())}
        {...getOverrideProps(overrides, "createdAt")}
      />

      <TextField
        label="Parent ID"
        value={parentID}
        onChange={(e) => setParentID(e.target.value)}
        {...getOverrideProps(overrides, "parentID")}
      />

      <Flex justifyContent="flex-end">
        <Button type="reset" onClick={resetStateValues}>
          Clear
        </Button>
        <Button
          type="submit"
          variation="primary"
          isDisabled={Object.values(errors).some((e) => e?.hasError)}
        >
          Submit
        </Button>
      </Flex>
    </Grid>
  );
}
