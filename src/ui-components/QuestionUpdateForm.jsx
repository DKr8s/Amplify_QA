/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { Question } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify/datastore";
export default function QuestionUpdateForm(props) {
  const {
    id: idProp,
    question: questionModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    Author: "",
    Text: "",
  };
  const [Author, setAuthor] = React.useState(initialValues.Author);
  const [Text, setText] = React.useState(initialValues.Text);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = questionRecord
      ? { ...initialValues, ...questionRecord }
      : initialValues;
    setAuthor(cleanValues.Author);
    setText(cleanValues.Text);
    setErrors({});
  };
  const [questionRecord, setQuestionRecord] = React.useState(questionModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(Question, idProp)
        : questionModelProp;
      setQuestionRecord(record);
    };
    queryData();
  }, [idProp, questionModelProp]);
  React.useEffect(resetStateValues, [questionRecord]);
  const validations = {
    Author: [],
    Text: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
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
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          Author,
          Text,
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
          await DataStore.save(
            Question.copyOf(questionRecord, (updated) => {
              Object.assign(updated, modelFields);
            })
          );
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "QuestionUpdateForm")}
      {...rest}
    >
      <TextField
        label="Author"
        isRequired={false}
        isReadOnly={false}
        value={Author}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Author: value,
              Text,
            };
            const result = onChange(modelFields);
            value = result?.Author ?? value;
          }
          if (errors.Author?.hasError) {
            runValidationTasks("Author", value);
          }
          setAuthor(value);
        }}
        onBlur={() => runValidationTasks("Author", Author)}
        errorMessage={errors.Author?.errorMessage}
        hasError={errors.Author?.hasError}
        {...getOverrideProps(overrides, "Author")}
      ></TextField>
      <TextField
        label="Text"
        isRequired={true}
        isReadOnly={false}
        value={Text}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Author,
              Text: value,
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
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || questionModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || questionModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
