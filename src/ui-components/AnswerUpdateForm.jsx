/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  TextAreaField,
  TextField,
} from "@aws-amplify/ui-react";
import { Answer } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify/datastore";
export default function AnswerUpdateForm(props) {
  const {
    id: idProp,
    answer: answerModelProp,
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
  };
  const [Text, setText] = React.useState(initialValues.Text);
  const [Author, setAuthor] = React.useState(initialValues.Author);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = answerRecord
      ? { ...initialValues, ...answerRecord }
      : initialValues;
    setText(cleanValues.Text);
    setAuthor(cleanValues.Author);
    setErrors({});
  };
  const [answerRecord, setAnswerRecord] = React.useState(answerModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(Answer, idProp)
        : answerModelProp;
      setAnswerRecord(record);
    };
    queryData();
  }, [idProp, answerModelProp]);
  React.useEffect(resetStateValues, [answerRecord]);
  const validations = {
    Text: [{ type: "Required" }],
    Author: [],
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
          Text,
          Author,
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
            Answer.copyOf(answerRecord, (updated) => {
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
      {...getOverrideProps(overrides, "AnswerUpdateForm")}
      {...rest}
    >
      <TextAreaField
        label="Text"
        isRequired={true}
        isReadOnly={false}
        value={Text}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Text: value,
              Author,
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
        isRequired={false}
        isReadOnly={false}
        value={Author}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Text,
              Author: value,
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
          isDisabled={!(idProp || answerModelProp)}
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
              !(idProp || answerModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
